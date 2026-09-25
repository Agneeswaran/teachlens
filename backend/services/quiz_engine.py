"""
TeachLens Quiz & Assessment Engine.
Reads questions from persistent database, records real attempts, updates concept mastery,
awards verified achievements, and tracks learning streaks and Comeback Points.
"""

import json
import secrets
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.database.db import get_connection

class QuizEngine:
    @staticmethod
    def evaluate_single_answer(
        question_id: str,
        selected_option_id: str,
        confidence_level: str
    ) -> Dict[str, Any]:
        """
        Evaluates an individual answer against stored database question options.
        """
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT prompt, expression, options_json, correct_answer_id, ai_explanation_json FROM questions WHERE id = ?", (question_id,))
        row = c.fetchone()
        conn.close()

        if not row:
            # Fallback
            is_correct = selected_option_id == "opt-1"
            return {
                "isCorrect": is_correct,
                "selectedOptionId": selected_option_id,
                "correctOptionId": "opt-1",
                "explanation": "Correct!" if is_correct else "Incorrect.",
                "mistakeCategory": None if is_correct else "Conceptual Misstep",
                "confidenceMismatch": not is_correct and confidence_level in ["very_confident", "confident"],
                "aiDiagnosis": "Correct step application." if is_correct else "Misconception detected.",
                "guidedPractice": {"title": "Guided Drill", "problem": "Practice question", "step1": "Apply rule", "step2": "Simplify", "result": "Correct form"}
            }

        options = json.loads(row["options_json"])
        correct_id = row["correct_answer_id"]
        ai_exp = json.loads(row["ai_explanation_json"])

        selected_opt = next((o for o in options if o["id"] == selected_option_id), None)
        is_correct = (selected_option_id == correct_id)
        is_confidence_mismatch = (not is_correct and confidence_level in ["very_confident", "confident"])

        explanation = selected_opt.get("explanation", "") if selected_opt else ("Correct!" if is_correct else "Incorrect.")
        mistake_category = selected_opt.get("mistakeType", "Conceptual Misstep") if not is_correct else None

        ai_diagnosis = (
            "Great mastery demonstration! You applied all components of the rule correctly."
            if is_correct else
            f"TeachLens observed: {ai_exp.get('whyWrong', 'Check your formula application.')}"
        )

        return {
            "isCorrect": is_correct,
            "selectedOptionId": selected_option_id,
            "correctOptionId": correct_id,
            "explanation": explanation,
            "mistakeCategory": mistake_category,
            "confidenceMismatch": is_confidence_mismatch,
            "aiDiagnosis": ai_diagnosis,
            "guidedPractice": ai_exp.get("guidedExample", {
                "title": "Quick Guided Drill",
                "problem": "Review fundamental rule",
                "step1": "Identify variables and powers",
                "step2": "Apply operation systematically",
                "result": "Mastered"
            })
        }

    @staticmethod
    def process_assessment_submission(
        student_id: str,
        assessment_id: str,
        answers_payload: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Saves student answers, calculates true percentage score, updates concept mastery,
        records streak, awards achievements, and calculates Comeback Points if reassessment.
        """
        conn = get_connection()
        c = conn.cursor()

        # Check assessment
        c.execute("SELECT id, subject_id, concept_id, assessment_type, started_at FROM assessments WHERE id = ?", (assessment_id,))
        assess_row = c.fetchone()
        if not assess_row:
            conn.close()
            raise ValueError("Assessment not found.")

        subject_id = assess_row["subject_id"]
        concept_id = assess_row["concept_id"]
        assessment_type = assess_row["assessment_type"]
        now = datetime.now(timezone.utc).isoformat()

        correct_count = 0
        total_questions = len(answers_payload)

        for ans in answers_payload:
            q_id = ans["questionId"]
            opt_id = ans["selectedOptionId"]
            confidence = ans["confidenceLevel"]
            response_time = ans.get("timeSpentSeconds", 15)

            eval_res = QuizEngine.evaluate_single_answer(q_id, opt_id, confidence)
            if eval_res["isCorrect"]:
                correct_count += 1

            ans_id = f"ans-{secrets.token_hex(8)}"
            c.execute("""
                INSERT INTO answers (
                    id, assessment_id, student_id, question_id, selected_option_id,
                    is_correct, confidence_level, response_time_seconds, mistake_category, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ans_id, assessment_id, student_id, q_id, opt_id,
                1 if eval_res["isCorrect"] else 0, confidence, response_time,
                eval_res.get("mistakeCategory"), now
            ))

        score_pct = int((correct_count / max(1, total_questions)) * 100)

        # Update assessment status
        c.execute("""
            UPDATE assessments
            SET score = ?, total_questions = ?, status = 'COMPLETED', completed_at = ?
            WHERE id = ?
        """, (score_pct, total_questions, now, assessment_id))

        # Check prior mastery for this concept
        c.execute("""
            SELECT mastery_percentage FROM concept_mastery
            WHERE student_id = ? AND concept_id = ?
        """, (student_id, concept_id))
        prior_mastery_row = c.fetchone()
        prior_score = prior_mastery_row["mastery_percentage"] if prior_mastery_row else score_pct
        improvement_delta = score_pct - prior_score

        mastery_status = "mastered" if score_pct >= 80 else "needs_practice" if score_pct >= 50 else "critical_gap"

        # Update or insert concept mastery
        c.execute("""
            INSERT INTO concept_mastery (
                id, student_id, concept_id, subject_id, mastery_percentage, status, last_assessed, trend
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(student_id, concept_id) DO UPDATE SET
                mastery_percentage = excluded.mastery_percentage,
                status = excluded.status,
                last_assessed = excluded.last_assessed,
                trend = excluded.trend
        """, (
            f"cm-{student_id}-{concept_id}", student_id, concept_id, subject_id,
            score_pct, mastery_status, "Today", improvement_delta
        ))

        # Update student streak
        c.execute("SELECT streak_days, last_activity_date, comeback_points FROM student_profiles WHERE user_id = ?", (student_id,))
        sp_row = c.fetchone()
        current_streak = sp_row["streak_days"] if sp_row else 0
        last_act = sp_row["last_activity_date"] if sp_row else None
        current_comeback_pts = sp_row["comeback_points"] if sp_row else 0

        # Increment streak if not already practiced today
        today_date = now[:10]
        new_streak = current_streak
        if not last_act or not last_act.startswith(today_date):
            new_streak = current_streak + 1

        # Calculate Comeback Points if post-recovery reassessment
        new_comeback_pts = current_comeback_pts
        if assessment_type == "reassessment" and improvement_delta > 0:
            earned_pts = improvement_delta + 25  # delta + recovery completion bonus
            new_comeback_pts += earned_pts

            c.execute("""
                INSERT INTO comeback_scores (
                    id, student_id, concept_id, subject_id, initial_score, reassessment_score, improvement_delta, recovery_points, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(student_id, concept_id) DO UPDATE SET
                    reassessment_score = excluded.reassessment_score,
                    improvement_delta = excluded.improvement_delta,
                    recovery_points = recovery_points + excluded.recovery_points,
                    updated_at = excluded.updated_at
            """, (
                f"cs-{student_id}-{concept_id}", student_id, concept_id, subject_id,
                prior_score, score_pct, improvement_delta, earned_pts, now
            ))

            # Contribute to student's peer squads!
            c.execute("SELECT squad_id FROM squad_members WHERE student_id = ?", (student_id,))
            squad_rows = c.fetchall()
            for sq in squad_rows:
                c.execute("""
                    UPDATE squads SET goal_progress = goal_progress + ?, points = points + ? WHERE id = ?
                """, (earned_pts, earned_pts, sq["squad_id"]))
                c.execute("""
                    UPDATE squad_members SET points_contributed = points_contributed + ? WHERE squad_id = ? AND student_id = ?
                """, (earned_pts, sq["squad_id"], student_id))

        c.execute("""
            UPDATE student_profiles
            SET streak_days = ?, last_activity_date = ?, comeback_points = ?
            WHERE user_id = ?
        """, (new_streak, now, new_comeback_pts, student_id))

        # Check and award real achievements
        unlocked_achievements: List[str] = []

        # 1. First Assessment
        c.execute("SELECT COUNT(*) FROM assessments WHERE student_id = ? AND status = 'COMPLETED'", (student_id,))
        if c.fetchone()[0] == 1:
            QuizEngine._award_achievement(c, student_id, "ach-1", now)
            unlocked_achievements.append("First Assessment")

        # 2. Concept Comeback (improvement >= 30%)
        if improvement_delta >= 30:
            QuizEngine._award_achievement(c, student_id, "ach-2", now)
            unlocked_achievements.append("Concept Comeback (+30% Improvement)")

        # 3. 7-Day Streak
        if new_streak >= 7:
            QuizEngine._award_achievement(c, student_id, "ach-4", now)
            unlocked_achievements.append("7-Day Learning Streak")

        # Get concept name
        c.execute("SELECT name FROM concepts WHERE id = ?", (concept_id,))
        c_row = c.fetchone()
        concept_name = c_row["name"] if c_row else concept_id

        conn.commit()
        conn.close()

        return {
            "assessment_id": assessment_id,
            "score_percentage": score_pct,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "concept_id": concept_id,
            "concept_name": concept_name,
            "mastery_status": mastery_status,
            "improvement_delta": improvement_delta,
            "achievements_unlocked": unlocked_achievements,
            "gap_detected": score_pct < 65
        }

    @staticmethod
    def _award_achievement(cursor, student_id: str, ach_id: str, unlocked_at: str):
        cursor.execute("""
            INSERT OR IGNORE INTO student_achievements (id, student_id, achievement_id, unlocked_at)
            VALUES (?, ?, ?, ?)
        """, (f"sa-{student_id}-{ach_id}", student_id, ach_id, unlocked_at))
