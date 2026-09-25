"""
TeachLens REST API Router.
Fully integrated with persistent SQLite database, real authentication,
multi-subject taxonomy, adaptive assessments, peer squads, and comeback leaderboards.
"""

import json
import secrets
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status

from backend.models.schemas import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    TeacherStatusResponse,
    TeacherAdminView,
    SubjectSchema,
    TopicSchema,
    ConceptMasterySchema,
    StartAssessmentRequest,
    StartAssessmentResponse,
    AnswerSubmissionSchema,
    AnswerEvaluationResponse,
    SubmitAssessmentRequest,
    SubmitAssessmentResponse,
    GapDiagnosisSchema,
    RecoveryPlanSchema,
    CreateSquadRequest,
    JoinSquadRequest,
    SquadView,
    SquadMemberView,
    ComebackLeaderboardEntry,
    TeacherAnalyticsSchema
)
from backend.database.db import get_connection, hash_password, verify_password
from backend.auth.auth import (
    create_session,
    delete_session,
    get_current_user,
    get_optional_user,
    get_verified_teacher,
    get_admin_user
)
from backend.services.gap_engine import GapEngine
from backend.services.quiz_engine import QuizEngine
from backend.services.teacher_engine import TeacherEngine

api_router = APIRouter(prefix="/api/v1")

# ================= 1. HEALTH =================
@api_router.get("/health")
async def health_check():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT 1")
    conn.close()
    return {"status": "ok", "database": "connected"}

# ================= 2. AUTHENTICATION =================
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    conn = get_connection()
    c = conn.cursor()

    # Check if email exists
    c.execute("SELECT id FROM users WHERE email = ?", (req.email.lower(),))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = f"usr-{secrets.token_hex(8)}"
    pw_hash = hash_password(req.password)
    now = datetime.now(timezone.utc).isoformat()
    role = req.role if req.role in ["student", "teacher"] else "student"

    c.execute(
        "INSERT INTO users (id, email, password_hash, role, name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, req.email.lower(), pw_hash, role, req.name, now)
    )

    if role == "teacher":
        c.execute("""
            INSERT INTO teacher_profiles (user_id, institution, department, status)
            VALUES (?, ?, ?, 'PENDING')
        """, (user_id, req.institution or "Institution", req.department or "General"))
    else:
        c.execute("""
            INSERT INTO student_profiles (user_id, display_name, streak_days, comeback_points)
            VALUES (?, ?, 0, 0)
        """, (user_id, req.name))

    conn.commit()
    conn.close()

    token = create_session(user_id)
    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": req.email.lower(),
            "name": req.name,
            "role": role,
            "teacher_status": "PENDING" if role == "teacher" else None,
            "display_name": req.name,
            "streak_days": 0,
            "comeback_points": 0
        }
    }

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT u.id, u.email, u.password_hash, u.role, u.name,
               tp.status as teacher_status, tp.institution,
               sp.display_name, sp.streak_days, sp.comeback_points
        FROM users u
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE u.email = ?
    """, (req.email.lower(),))
    row = c.fetchone()
    conn.close()

    if not row or not verify_password(row["password_hash"], req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_session(row["id"])
    return {
        "token": token,
        "user": {
            "id": row["id"],
            "email": row["email"],
            "name": row["name"],
            "role": row["role"],
            "teacher_status": row["teacher_status"],
            "teacher_institution": row["institution"],
            "display_name": row["display_name"] or row["name"],
            "streak_days": row["streak_days"] or 0,
            "comeback_points": row["comeback_points"] or 0
        }
    }

@api_router.post("/auth/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    # Handled via token removal from client; session cleaned up automatically
    return {"message": "Logged out successfully."}

@api_router.get("/auth/me")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user

# ================= 3. TEACHER STATUS & VERIFICATION =================
@api_router.get("/teacher/status", response_model=TeacherStatusResponse)
async def get_teacher_status(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user["role"] != "teacher" and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not a teacher account.")

    status_val = current_user.get("teacher_status", "PENDING")
    messages = {
        "PENDING": "Your teacher account is awaiting verification by an administrator.",
        "VERIFIED": "Your teacher account has been verified.",
        "REJECTED": "Your teacher account has been rejected.",
        "SUSPENDED": "Your teacher account has been suspended."
    }
    return {
        "status": status_val,
        "message": messages.get(status_val, "Verification status pending."),
        "institution": current_user.get("teacher_institution")
    }

# Admin endpoints for managing teachers
@api_router.get("/admin/teachers/pending", response_model=List[TeacherAdminView])
async def list_pending_teachers(admin: Dict[str, Any] = Depends(get_admin_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT u.id as user_id, u.name, u.email, u.created_at,
               tp.institution, tp.department, tp.status, tp.reviewed_at
        FROM users u
        JOIN teacher_profiles tp ON u.id = tp.user_id
        ORDER BY u.created_at DESC
    """)
    rows = c.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "user_id": r["user_id"],
            "name": r["name"],
            "email": r["email"],
            "institution": r["institution"],
            "department": r["department"],
            "status": r["status"],
            "created_at": r["created_at"][:10],
            "reviewed_at": r["reviewed_at"][:10] if r["reviewed_at"] else None
        })
    return result

@api_router.post("/admin/teachers/{user_id}/verify")
async def verify_teacher(user_id: str, admin: Dict[str, Any] = Depends(get_admin_user)):
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    c.execute("""
        UPDATE teacher_profiles
        SET status = 'VERIFIED', reviewed_at = ?, reviewed_by = ?
        WHERE user_id = ?
    """, (now, admin["id"], user_id))
    conn.commit()
    conn.close()
    return {"message": "Teacher verified successfully."}

@api_router.post("/admin/teachers/{user_id}/reject")
async def reject_teacher(user_id: str, admin: Dict[str, Any] = Depends(get_admin_user)):
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    c.execute("""
        UPDATE teacher_profiles
        SET status = 'REJECTED', reviewed_at = ?, reviewed_by = ?
        WHERE user_id = ?
    """, (now, admin["id"], user_id))
    conn.commit()
    conn.close()
    return {"message": "Teacher application rejected."}

@api_router.post("/admin/teachers/{user_id}/suspend")
async def suspend_teacher(user_id: str, admin: Dict[str, Any] = Depends(get_admin_user)):
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    c.execute("""
        UPDATE teacher_profiles
        SET status = 'SUSPENDED', reviewed_at = ?, reviewed_by = ?
        WHERE user_id = ?
    """, (now, admin["id"], user_id))
    conn.commit()
    conn.close()
    return {"message": "Teacher account suspended."}

# ================= 4. MULTI-SUBJECT SYSTEM =================
@api_router.get("/subjects", response_model=List[SubjectSchema])
async def list_subjects():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, name, slug, description, icon, color FROM subjects")
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@api_router.get("/subjects/{subject_id}/topics", response_model=List[TopicSchema])
async def list_topics(subject_id: str):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, subject_id, name, description FROM topics WHERE subject_id = ?", (subject_id,))
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@api_router.get("/subjects/{subject_id}/concepts", response_model=List[ConceptMasterySchema])
async def list_subject_concepts(subject_id: str, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    conn = get_connection()
    c = conn.cursor()

    student_id = current_user["id"] if current_user else None

    c.execute("""
        SELECT c.id, c.name, c.description, c.prerequisites_json, c.subconcepts_json,
               t.name as category_name,
               cm.mastery_percentage, cm.status, cm.last_assessed, cm.trend
        FROM concepts c
        JOIN topics t ON c.topic_id = t.id
        LEFT JOIN concept_mastery cm ON (c.id = cm.concept_id AND cm.student_id = ?)
        WHERE c.subject_id = ?
    """, (student_id, subject_id))
    rows = c.fetchall()
    conn.close()

    result = []
    for r in rows:
        mastery_pct = r["mastery_percentage"] if r["mastery_percentage"] is not None else 0
        stat = r["status"] if r["status"] else "needs_practice"
        last_ass = r["last_assessed"] if r["last_assessed"] else "Not assessed yet"
        trend_val = r["trend"] if r["trend"] is not None else 0

        result.append({
            "id": r["id"],
            "name": r["name"],
            "category": r["category_name"],
            "subject_id": subject_id,
            "masteryPercentage": mastery_pct,
            "status": stat,
            "lastAssessed": last_ass,
            "trend": trend_val,
            "prerequisites": json.loads(r["prerequisites_json"] or "[]"),
            "subconcepts": json.loads(r["subconcepts_json"] or "[]"),
            "description": r["description"]
        })
    return result

# ================= 5. ADAPTIVE ASSESSMENTS =================
@api_router.post("/assessments/start", response_model=StartAssessmentResponse)
async def start_assessment(req: StartAssessmentRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()

    # Find questions for this subject & concept
    if req.concept_id:
        c.execute("""
            SELECT q.id, q.concept_id, q.subject_id, q.difficulty, q.prompt, q.expression,
                   q.options_json, c.name as concept_name
            FROM questions q
            JOIN concepts c ON q.concept_id = c.id
            WHERE q.concept_id = ?
        """, (req.concept_id,))
    else:
        c.execute("""
            SELECT q.id, q.concept_id, q.subject_id, q.difficulty, q.prompt, q.expression,
                   q.options_json, c.name as concept_name
            FROM questions q
            JOIN concepts c ON q.concept_id = c.id
            WHERE q.subject_id = ?
        """, (req.subject_id,))

    rows = c.fetchall()

    if not rows:
        # Fallback to differentiation questions if none in subject yet
        c.execute("""
            SELECT q.id, q.concept_id, q.subject_id, q.difficulty, q.prompt, q.expression,
                   q.options_json, c.name as concept_name
            FROM questions q
            JOIN concepts c ON q.concept_id = c.id
            LIMIT 5
        """)
        rows = c.fetchall()

    assessment_id = f"asmt-{secrets.token_hex(8)}"
    now = datetime.now(timezone.utc).isoformat()
    target_concept = req.concept_id or (rows[0]["concept_id"] if rows else "differentiation")

    c.execute("""
        INSERT INTO assessments (id, student_id, subject_id, concept_id, assessment_type, total_questions, status, started_at)
        VALUES (?, ?, ?, ?, ?, ?, 'IN_PROGRESS', ?)
    """, (assessment_id, current_user["id"], req.subject_id, target_concept, req.assessment_type, len(rows), now))

    conn.commit()
    conn.close()

    formatted_questions = []
    for idx, r in enumerate(rows):
        options = json.loads(r["options_json"])
        # Scrub isCorrect from client delivery during assessment
        clean_opts = [{"id": o["id"], "text": o["text"]} for o in options]
        formatted_questions.append({
            "id": r["id"],
            "conceptId": r["concept_id"],
            "conceptName": r["concept_name"],
            "subjectId": r["subject_id"],
            "difficulty": r["difficulty"],
            "questionNumber": idx + 1,
            "totalQuestions": len(rows),
            "prompt": r["prompt"],
            "expression": r["expression"],
            "options": clean_opts
        })

    return {
        "assessment_id": assessment_id,
        "subject_id": req.subject_id,
        "concept_id": target_concept,
        "assessment_type": req.assessment_type,
        "total_questions": len(formatted_questions),
        "questions": formatted_questions
    }

@api_router.post("/assessments/{assessment_id}/answer", response_model=AnswerEvaluationResponse)
async def submit_single_answer(assessment_id: str, ans: AnswerSubmissionSchema, current_user: Dict[str, Any] = Depends(get_current_user)):
    return QuizEngine.evaluate_single_answer(
        question_id=ans.questionId,
        selected_option_id=ans.selectedOptionId,
        confidence_level=ans.confidenceLevel
    )

@api_router.post("/assessments/{assessment_id}/submit", response_model=SubmitAssessmentResponse)
async def submit_assessment(assessment_id: str, req: SubmitAssessmentRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    payload = [a.model_dump() for a in req.answers]
    result = QuizEngine.process_assessment_submission(
        student_id=current_user["id"],
        assessment_id=assessment_id,
        answers_payload=payload
    )
    return result

# ================= 6. STUDENT MASTERY, HISTORY & OVERVIEW =================
@api_router.get("/students/me/overview")
async def get_student_overview(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    s_id = current_user["id"]

    c.execute("SELECT streak_days, comeback_points, display_name FROM student_profiles WHERE user_id = ?", (s_id,))
    sp_row = c.fetchone()

    c.execute("""
        SELECT COUNT(CASE WHEN status = 'mastered' THEN 1 END) as mastered_cnt,
               COUNT(CASE WHEN status = 'needs_practice' OR status = 'critical_gap' THEN 1 END) as needs_cnt,
               AVG(mastery_percentage) as avg_mastery,
               COUNT(*) as total_assessed
        FROM concept_mastery
        WHERE student_id = ?
    """, (s_id,))
    cm_summary = c.fetchone()

    c.execute("SELECT COUNT(*) FROM assessments WHERE student_id = ? AND status = 'COMPLETED'", (s_id,))
    completed_assessments = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM recovery_plans WHERE student_id = ? AND status = 'COMPLETED'", (s_id,))
    completed_recoveries = c.fetchone()[0]

    conn.close()

    return {
        "display_name": sp_row["display_name"] if sp_row else current_user["name"],
        "streak_days": sp_row["streak_days"] if sp_row else 0,
        "comeback_points": sp_row["comeback_points"] if sp_row else 0,
        "overall_mastery": int(cm_summary["avg_mastery"] or 0),
        "concepts_mastered": cm_summary["mastered_cnt"] or 0,
        "needs_practice": cm_summary["needs_cnt"] or 0,
        "completed_assessments": completed_assessments,
        "completed_recoveries": completed_recoveries,
        "has_started": completed_assessments > 0
    }

@api_router.get("/students/me/mastery", response_model=List[ConceptMasterySchema])
async def get_student_mastery(subject_id: Optional[str] = None, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    s_id = current_user["id"]

    query = """
        SELECT c.id, c.name, c.description, c.subject_id, c.prerequisites_json, c.subconcepts_json,
               t.name as category_name,
               cm.mastery_percentage, cm.status, cm.last_assessed, cm.trend
        FROM concepts c
        JOIN topics t ON c.topic_id = t.id
        LEFT JOIN concept_mastery cm ON (c.id = cm.concept_id AND cm.student_id = ?)
    """
    params = [s_id]
    if subject_id:
        query += " WHERE c.subject_id = ?"
        params.append(subject_id)

    c.execute(query, tuple(params))
    rows = c.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "name": r["name"],
            "category": r["category_name"],
            "subject_id": r["subject_id"],
            "masteryPercentage": r["mastery_percentage"] if r["mastery_percentage"] is not None else 0,
            "status": r["status"] if r["status"] else "needs_practice",
            "lastAssessed": r["last_assessed"] if r["last_assessed"] else "Not assessed",
            "trend": r["trend"] if r["trend"] is not None else 0,
            "prerequisites": json.loads(r["prerequisites_json"] or "[]"),
            "subconcepts": json.loads(r["subconcepts_json"] or "[]"),
            "description": r["description"]
        })
    return result

@api_router.get("/students/me/history")
async def get_student_history(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT a.id, a.assessment_type, a.score, a.total_questions, a.completed_at,
               c.name as concept_name, s.name as subject_name
        FROM assessments a
        LEFT JOIN concepts c ON a.concept_id = c.id
        LEFT JOIN subjects s ON a.subject_id = s.id
        WHERE a.student_id = ? AND a.status = 'COMPLETED'
        ORDER BY a.completed_at DESC
        LIMIT 20
    """, (current_user["id"],))
    rows = c.fetchall()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "date": r["completed_at"][:10] if r["completed_at"] else "Today",
            "time": r["completed_at"][11:16] if r["completed_at"] else "Now",
            "title": f"{r['concept_name']} {r['assessment_type'].capitalize()}",
            "desc": f"Scored {r['score']}% across {r['total_questions']} items in {r['subject_name']}.",
            "delta": r["score"],
            "type": r["assessment_type"],
            "tag": r["assessment_type"].capitalize()
        })
    return history

@api_router.get("/students/me/achievements")
async def get_student_achievements(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT a.id, a.name, a.description, a.icon,
               sa.unlocked_at, (sa.id IS NOT NULL) as is_unlocked
        FROM achievements a
        LEFT JOIN student_achievements sa ON (a.id = sa.achievement_id AND sa.student_id = ?)
    """, (current_user["id"],))
    rows = c.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "title": r["name"],
            "description": r["description"],
            "icon": r["icon"],
            "is_unlocked": bool(r["is_unlocked"]),
            "unlockedAt": r["unlocked_at"][:10] if r["unlocked_at"] else None
        }
        for r in rows
    ]

# ================= 7. AI GAP ANALYSIS =================
@api_router.get("/gap-analysis/{concept_id}", response_model=Optional[GapDiagnosisSchema])
async def get_gap_diagnosis(concept_id: str = "differentiation", current_user: Dict[str, Any] = Depends(get_current_user)):
    diag = GapEngine.get_or_generate_gap_diagnosis(current_user["id"], concept_id)
    if not diag:
        raise HTTPException(
            status_code=404,
            detail="No diagnostic data available yet for this concept. Take an assessment first!"
        )
    return diag

# ================= 8. PERSONALIZED RECOVERY PLAN =================
@api_router.get("/recovery", response_model=List[RecoveryPlanSchema])
async def list_recovery_plans(current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT rp.id, rp.concept_id, rp.subject_id, rp.title, rp.estimated_minutes,
               rp.status, rp.steps_json, rp.created_at, c.name as concept_name
        FROM recovery_plans rp
        JOIN concepts c ON rp.concept_id = c.id
        WHERE rp.student_id = ?
        ORDER BY rp.created_at DESC
    """, (current_user["id"],))
    rows = c.fetchall()
    conn.close()

    plans = []
    for r in rows:
        steps = json.loads(r["steps_json"])
        completed_count = sum(1 for s in steps if s.get("completed", False))
        plans.append({
            "id": r["id"],
            "conceptId": r["concept_id"],
            "conceptName": r["concept_name"],
            "subjectId": r["subject_id"],
            "title": r["title"],
            "estimatedMinutes": r["estimated_minutes"],
            "steps": steps,
            "currentStepIndex": min(completed_count, len(steps) - 1),
            "createdAt": r["created_at"][:10],
            "status": r["status"]
        })
    return plans

@api_router.post("/recovery/{concept_id}/generate", response_model=RecoveryPlanSchema)
async def generate_recovery_plan(concept_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT name, subject_id FROM concepts WHERE id = ?", (concept_id,))
    c_row = c.fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Concept not found.")

    concept_name = c_row["name"]
    subject_id = c_row["subject_id"]
    plan_id = f"rec-{current_user['id']}-{concept_id}"
    now = datetime.now(timezone.utc).isoformat()

    steps = [
        {
            "stepNumber": 1,
            "title": f"Review Core {concept_name} Formulation",
            "type": "review",
            "durationMinutes": 3,
            "completed": True,
            "content": {
                "summary": f"Deconstruct the exact operational rule for {concept_name} term by term.",
                "keyRule": "d/dx [ c · xⁿ ] = c · n · xⁿ⁻¹",
                "formula": "Step 1: Multiply current power. Step 2: Decrement exponent by 1: x^(n-1)."
            }
        },
        {
            "stepNumber": 2,
            "title": "Interactive Conceptual Breakdown",
            "type": "video",
            "durationMinutes": 3,
            "completed": False,
            "content": {
                "summary": "Understand geometric rate of growth and why the exponent decrements.",
                "walkthroughSteps": [
                    {"step": "Geometric View", "explanation": "Area x² increases along two boundary edges, yielding instantaneous rate 2x."},
                    {"step": "Algebraic Anchor", "explanation": "The difference quotient expands via binomial expansion, reducing the power."}
                ]
            }
        },
        {
            "stepNumber": 3,
            "title": "Solve Guided Step-by-Step Examples",
            "type": "guided_example",
            "durationMinutes": 4,
            "completed": False,
            "content": {
                "summary": "Walk through 2 guided drills with immediate scaffolding hints.",
                "walkthroughSteps": [
                    {"step": "Example A: d/dx(5x⁴ - 3x²)", "explanation": "Differentiate: (5·4)x³ - (3·2)x = 20x³ - 6x."},
                    {"step": "Example B: d/dx(2/x³)", "explanation": "Rewrite as 2x⁻³. Apply rule: 2(-3)x⁻⁴ = -6/x⁴."}
                ]
            }
        },
        {
            "stepNumber": 4,
            "title": "Practice 5 Targeted Micro-Questions",
            "type": "targeted_practice",
            "durationMinutes": 3,
            "completed": False,
            "content": {
                "summary": "Solve 5 targeted single-concept problems designed to reinforce the exponent decrement step.",
                "practiceCount": 5
            }
        },
        {
            "stepNumber": 5,
            "title": "Take Reassessment Diagnostic",
            "type": "reassessment",
            "durationMinutes": 2,
            "completed": False,
            "content": {
                "summary": "Verify mastery retention and unlock Comeback Points."
            }
        }
    ]

    c.execute("""
        INSERT INTO recovery_plans (id, student_id, concept_id, subject_id, title, estimated_minutes, status, steps_json, created_at)
        VALUES (?, ?, ?, ?, ?, 15, 'IN_PROGRESS', ?, ?)
        ON CONFLICT(student_id, concept_id) DO UPDATE SET
            status = 'IN_PROGRESS',
            steps_json = excluded.steps_json
    """, (plan_id, current_user["id"], concept_id, subject_id, f"Targeted Recovery: {concept_name}", json.dumps(steps), now))

    conn.commit()
    conn.close()

    return {
        "id": plan_id,
        "conceptId": concept_id,
        "conceptName": concept_name,
        "subjectId": subject_id,
        "title": f"Targeted Recovery: {concept_name}",
        "estimatedMinutes": 15,
        "steps": steps,
        "currentStepIndex": 0,
        "createdAt": now[:10],
        "status": "IN_PROGRESS"
    }

@api_router.post("/recovery/{plan_id}/step/{step_number}/complete")
async def complete_recovery_step(plan_id: str, step_number: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT steps_json, student_id FROM recovery_plans WHERE id = ?", (plan_id,))
    row = c.fetchone()
    if not row or row["student_id"] != current_user["id"]:
        conn.close()
        raise HTTPException(status_code=404, detail="Recovery plan not found.")

    steps = json.loads(row["steps_json"])
    for s in steps:
        if s["stepNumber"] == step_number:
            s["completed"] = True

    all_done = all(s.get("completed", False) for s in steps)
    now = datetime.now(timezone.utc).isoformat()

    c.execute("""
        UPDATE recovery_plans
        SET steps_json = ?, status = ?, completed_at = ?
        WHERE id = ?
    """, (json.dumps(steps), "COMPLETED" if all_done else "IN_PROGRESS", now if all_done else None, plan_id))

    if all_done:
        QuizEngine._award_achievement(c, current_user["id"], "ach-3", now)

    conn.commit()
    conn.close()
    return {"message": f"Step {step_number} completed.", "all_completed": all_done}

# ================= 9. PEER SQUADS / STUDY GUILDS =================
@api_router.get("/squads", response_model=List[SquadView])
async def list_squads(subject_id: Optional[str] = None, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    s_id = current_user["id"]

    query = """
        SELECT sq.id, sq.name, sq.subject_id, sq.join_code, sq.goal_description,
               sq.goal_target, sq.goal_progress, sq.points, sq.created_at,
               sub.name as subject_name,
               (sm.student_id IS NOT NULL) as is_member,
               (SELECT COUNT(*) FROM squad_members WHERE squad_id = sq.id) as members_count
        FROM squads sq
        JOIN subjects sub ON sq.subject_id = sub.id
        LEFT JOIN squad_members sm ON (sq.id = sm.squad_id AND sm.student_id = ?)
    """
    params = [s_id]
    if subject_id:
        query += " WHERE sq.subject_id = ?"
        params.append(subject_id)

    query += " ORDER BY sq.points DESC"

    c.execute(query, tuple(params))
    rows = c.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "name": r["name"],
            "subject_id": r["subject_id"],
            "subject_name": r["subject_name"],
            "join_code": r["join_code"],
            "goal_description": r["goal_description"],
            "goal_target": r["goal_target"],
            "goal_progress": min(r["goal_progress"], r["goal_target"]),
            "points": r["points"],
            "created_at": r["created_at"][:10],
            "is_member": bool(r["is_member"]),
            "members_count": r["members_count"]
        })
    return result

@api_router.post("/squads", response_model=SquadView)
async def create_squad(req: CreateSquadRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    squad_id = f"sq-{secrets.token_hex(6)}"
    join_code = f"SQUAD-{secrets.token_hex(3).upper()}"

    c.execute("""
        INSERT INTO squads (id, name, subject_id, join_code, goal_description, goal_target, creator_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (squad_id, req.name, req.subject_id, join_code, req.goal_description, req.goal_target, current_user["id"], now))

    # Add creator as first member
    c.execute("""
        INSERT INTO squad_members (id, squad_id, student_id, joined_at, points_contributed)
        VALUES (?, ?, ?, ?, 0)
    """, (f"sm-{secrets.token_hex(6)}", squad_id, current_user["id"], now))

    conn.commit()
    conn.close()

    return {
        "id": squad_id,
        "name": req.name,
        "subject_id": req.subject_id,
        "join_code": join_code,
        "goal_description": req.goal_description,
        "goal_target": req.goal_target,
        "goal_progress": 0,
        "points": 0,
        "created_at": now[:10],
        "is_member": True,
        "members_count": 1
    }

@api_router.post("/squads/join")
async def join_squad(req: JoinSquadRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT id, name FROM squads WHERE join_code = ?", (req.join_code.strip().upper(),))
    squad_row = c.fetchone()
    if not squad_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Invalid squad join code.")

    squad_id = squad_row["id"]
    now = datetime.now(timezone.utc).isoformat()

    c.execute("""
        INSERT OR IGNORE INTO squad_members (id, squad_id, student_id, joined_at, points_contributed)
        VALUES (?, ?, ?, ?, 0)
    """, (f"sm-{secrets.token_hex(6)}", squad_id, current_user["id"], now))

    conn.commit()
    conn.close()
    return {"message": f"Successfully joined {squad_row['name']}!", "squad_id": squad_id}

@api_router.post("/squads/{squad_id}/leave")
async def leave_squad(squad_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("DELETE FROM squad_members WHERE squad_id = ? AND student_id = ?", (squad_id, current_user["id"]))
    conn.commit()
    conn.close()
    return {"message": "Left squad successfully."}

@api_router.get("/squads/{squad_id}", response_model=SquadView)
async def get_squad_details(squad_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT sq.id, sq.name, sq.subject_id, sq.join_code, sq.goal_description,
               sq.goal_target, sq.goal_progress, sq.points, sq.created_at,
               sub.name as subject_name,
               (SELECT COUNT(*) FROM squad_members WHERE squad_id = sq.id) as members_count,
               (SELECT 1 FROM squad_members WHERE squad_id = sq.id AND student_id = ?) as is_member
        FROM squads sq
        JOIN subjects sub ON sq.subject_id = sub.id
        WHERE sq.id = ?
    """, (current_user["id"], squad_id))
    sq = c.fetchone()
    if not sq:
        conn.close()
        raise HTTPException(status_code=404, detail="Squad not found.")

    # Fetch safe member views (respecting privacy)
    c.execute("""
        SELECT sm.student_id, sm.points_contributed, sm.joined_at,
               u.name, sp.display_name, sp.privacy_level
        FROM squad_members sm
        JOIN users u ON sm.student_id = u.id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE sm.squad_id = ?
        ORDER BY sm.points_contributed DESC
    """, (squad_id,))
    members_rows = c.fetchall()
    conn.close()

    members = []
    for m in members_rows:
        privacy = m["privacy_level"] or "public"
        if privacy == "anonymous":
            shown_name = f"Student-{m['student_id'][-4:]}"
        else:
            shown_name = m["display_name"] or m["name"]

        members.append({
            "student_id": m["student_id"],
            "display_name": shown_name,
            "points_contributed": m["points_contributed"],
            "joined_at": m["joined_at"][:10]
        })

    return {
        "id": sq["id"],
        "name": sq["name"],
        "subject_id": sq["subject_id"],
        "subject_name": sq["subject_name"],
        "join_code": sq["join_code"],
        "goal_description": sq["goal_description"],
        "goal_target": sq["goal_target"],
        "goal_progress": min(sq["goal_progress"], sq["goal_target"]),
        "points": sq["points"],
        "created_at": sq["created_at"][:10],
        "is_member": bool(sq["is_member"]),
        "members_count": sq["members_count"],
        "members": members
    }

# ================= 10. COMEBACK LEADERBOARD =================
@api_router.get("/leaderboard/comeback", response_model=List[ComebackLeaderboardEntry])
async def get_comeback_leaderboard(subject_id: Optional[str] = None, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    conn = get_connection()
    c = conn.cursor()

    query = """
        SELECT cs.student_id, cs.improvement_delta, cs.recovery_points,
               u.name, sp.display_name, sp.privacy_level,
               c.name as concept_name, sub.name as subject_name
        FROM comeback_scores cs
        JOIN users u ON cs.student_id = u.id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        JOIN concepts c ON cs.concept_id = c.id
        JOIN subjects sub ON cs.subject_id = sub.id
    """
    params = []
    if subject_id:
        query += " WHERE cs.subject_id = ?"
        params.append(subject_id)

    query += " ORDER BY (cs.improvement_delta + cs.recovery_points) DESC LIMIT 25"

    c.execute(query, tuple(params))
    rows = c.fetchall()
    conn.close()

    leaderboard = []
    curr_id = current_user["id"] if current_user else None

    for rank, r in enumerate(rows, start=1):
        privacy = r["privacy_level"] or "public"
        is_curr = (r["student_id"] == curr_id)

        if privacy == "anonymous" and not is_curr:
            shown_name = f"Learner-{r['student_id'][-4:]}"
        else:
            shown_name = r["display_name"] or r["name"]

        total_pts = r["improvement_delta"] + r["recovery_points"]
        leaderboard.append({
            "rank": rank,
            "student_id": r["student_id"],
            "display_name": shown_name,
            "improvement_delta": r["improvement_delta"],
            "recovery_completions": max(1, r["recovery_points"] // 25),
            "total_comeback_points": total_pts,
            "concept_name": r["concept_name"],
            "subject_name": r["subject_name"],
            "is_current_user": is_curr
        })
    return leaderboard

# ================= 11. TEACHER DASHBOARD (VERIFIED ONLY) =================
@api_router.get("/teacher/analytics", response_model=TeacherAnalyticsSchema)
async def get_teacher_analytics(teacher: Dict[str, Any] = Depends(get_verified_teacher)):
    return TeacherEngine.get_class_analytics()
