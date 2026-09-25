"""
TeachLens Teacher Analytics Engine.
Calculates class aggregates, concept weakness spectra, and evidence-grounded
early warning signals from real student database records.
"""

from typing import Dict, Any, List
from backend.database.db import get_connection

class TeacherEngine:
    @staticmethod
    def get_class_analytics() -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()

        # 1. Fetch all real students
        c.execute("""
            SELECT u.id, u.name, u.email, sp.streak_days, sp.comeback_points
            FROM users u
            LEFT JOIN student_profiles sp ON u.id = sp.user_id
            WHERE u.role = 'student'
        """)
        students_rows = c.fetchall()
        total_students = len(students_rows)

        if total_students == 0:
            conn.close()
            return {
                "totalStudents": 0,
                "studentsImproving": 0,
                "studentsNeedingAttention": 0,
                "classAverageMastery": 0,
                "conceptWeaknesses": [],
                "commonMistakes": [],
                "earlyWarnings": [],
                "students": []
            }

        student_views = []
        improving_count = 0
        needing_attention_count = 0
        all_masteries = []

        for s in students_rows:
            s_id = s["id"]
            # Get concept mastery for this student
            c.execute("""
                SELECT c.id as concept_id, c.name as concept_name, cm.mastery_percentage, cm.status, cm.trend
                FROM concept_mastery cm
                JOIN concepts c ON cm.concept_id = c.id
                WHERE cm.student_id = ?
            """, (s_id,))
            cm_rows = c.fetchall()

            concept_scores = {row["concept_id"]: row["mastery_percentage"] for row in cm_rows}
            scores_list = [row["mastery_percentage"] for row in cm_rows]
            avg_student_mastery = int(sum(scores_list) / len(scores_list)) if scores_list else 0

            if scores_list:
                all_masteries.append(avg_student_mastery)

            # Find weakest concept
            weakest_concept = "None"
            weakest_score = 100
            trend_val = "neutral"
            if cm_rows:
                sorted_cm = sorted(cm_rows, key=lambda x: x["mastery_percentage"])
                weakest_concept = sorted_cm[0]["concept_name"]
                weakest_score = sorted_cm[0]["mastery_percentage"]
                if sorted_cm[0]["trend"] > 0:
                    trend_val = "up"
                elif sorted_cm[0]["trend"] < 0:
                    trend_val = "down"

            status = "steady"
            if avg_student_mastery >= 75:
                status = "improving"
                improving_count += 1
            elif avg_student_mastery < 60 or weakest_score < 50:
                status = "needs_attention"
                needing_attention_count += 1

            student_views.append({
                "id": s_id,
                "name": s["name"],
                "email": s["email"],
                "overallMastery": avg_student_mastery,
                "status": status,
                "weakestConcept": weakest_concept,
                "weakestConceptScore": weakest_score if weakest_score <= 100 else 0,
                "trend": trend_val,
                "lastActive": "Recent",
                "conceptScores": concept_scores
            })

        class_avg_mastery = int(sum(all_masteries) / len(all_masteries)) if all_masteries else 0

        # 2. Concept Weakness Spectrum across all concepts
        c.execute("""
            SELECT c.name, AVG(cm.mastery_percentage) as avg_score,
                   SUM(CASE WHEN cm.mastery_percentage < 50 THEN 1 ELSE 0 END) as critical_count
            FROM concepts c
            LEFT JOIN concept_mastery cm ON c.id = cm.concept_id
            GROUP BY c.id, c.name
            HAVING COUNT(cm.id) > 0
        """)
        weakness_rows = c.fetchall()
        concept_weaknesses = []
        for w in weakness_rows:
            avg_sc = int(w["avg_score"] or 0)
            concept_weaknesses.append({
                "concept": w["name"],
                "averageScore": avg_sc,
                "gapRate": int((w["critical_count"] / max(1, total_students)) * 100),
                "criticalStudents": w["critical_count"]
            })

        # 3. Common Mistake Patterns from real answers
        c.execute("""
            SELECT mistake_category, COUNT(*) as cnt
            FROM answers
            WHERE is_correct = 0 AND mistake_category IS NOT NULL
            GROUP BY mistake_category
            ORDER BY cnt DESC
            LIMIT 5
        """)
        mistake_rows = c.fetchall()
        common_mistakes = []
        for m in mistake_rows:
            common_mistakes.append({
                "pattern": m["mistake_category"],
                "frequency": m["cnt"],
                "concept": "Core Concepts"
            })

        # 4. Real Early Warning Signals (Students with consecutive decreasing scores)
        early_warnings = []
        for s in students_rows:
            s_id = s["id"]
            # Look up recent completed assessments
            c.execute("""
                SELECT a.score, c.name as concept_name, c.id as concept_id
                FROM assessments a
                JOIN concepts c ON a.concept_id = c.id
                WHERE a.student_id = ? AND a.status = 'COMPLETED'
                ORDER BY a.completed_at DESC
                LIMIT 3
            """, (s_id,))
            recent_assessments = c.fetchall()

            if len(recent_assessments) >= 2:
                scores = [r["score"] for r in recent_assessments]
                # Check for strictly decreasing scores
                if len(scores) == 3 and scores[0] < scores[1] < scores[2]:
                    early_warnings.append({
                        "id": f"ew-{s_id}",
                        "studentId": s_id,
                        "studentName": s["name"],
                        "conceptId": recent_assessments[0]["concept_id"],
                        "conceptName": recent_assessments[0]["concept_name"],
                        "historicalTrend": list(reversed(scores)),
                        "severity": "critical",
                        "detectedAt": "Recent Attempt",
                        "evidence": f"Assessment scores dropped continuously across last 3 attempts ({scores[2]}% → {scores[1]}% → {scores[0]}%).",
                        "recommendation": f"Targeted prerequisite review recommended for {recent_assessments[0]['concept_name']}."
                    })

        conn.close()

        return {
            "totalStudents": total_students,
            "studentsImproving": improving_count,
            "studentsNeedingAttention": needing_attention_count,
            "classAverageMastery": class_avg_mastery,
            "conceptWeaknesses": concept_weaknesses,
            "commonMistakes": common_mistakes,
            "earlyWarnings": early_warnings,
            "students": student_views
        }
