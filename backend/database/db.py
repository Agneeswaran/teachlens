"""
TeachLens Persistent Relational Database Layer.
Backed by SQLite (file: teachlens.db) for zero-dependency, permanent ACID persistence,
with schema designed to be 100% compatible with PostgreSQL.
"""

import sqlite3
import os
import json
import hashlib
import secrets
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "teachlens.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def hash_password(password: str) -> str:
    """Hash password with PBKDF2-HMAC-SHA256 and unique salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{key.hex()}"

def verify_password(stored_hash: str, password: str) -> bool:
    try:
        salt, key_hex = stored_hash.split(':')
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return secrets.compare_digest(key.hex(), key_hex)
    except Exception:
        return False

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # 1. Users table
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL, -- 'student', 'teacher', 'admin'
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 2. Teacher Profiles
    c.execute("""
    CREATE TABLE IF NOT EXISTS teacher_profiles (
        user_id TEXT PRIMARY KEY,
        institution TEXT NOT NULL,
        department TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'
        reviewed_at TEXT,
        reviewed_by TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 3. Student Profiles
    c.execute("""
    CREATE TABLE IF NOT EXISTS student_profiles (
        user_id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        privacy_level TEXT NOT NULL DEFAULT 'public', -- 'public', 'squad_only', 'anonymous'
        streak_days INTEGER NOT NULL DEFAULT 0,
        last_activity_date TEXT,
        comeback_points INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 4. Sessions
    c.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 5. Subjects
    c.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL
    );
    """)

    # 6. Topics
    c.execute("""
    CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        subject_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
    """)

    # 7. Concepts
    c.execute("""
    CREATE TABLE IF NOT EXISTS concepts (
        id TEXT PRIMARY KEY,
        topic_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        prerequisites_json TEXT NOT NULL DEFAULT '[]',
        subconcepts_json TEXT NOT NULL DEFAULT '[]',
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
    """)

    # 8. Questions
    c.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        concept_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        difficulty TEXT NOT NULL, -- 'Easy', 'Medium', 'Hard'
        prompt TEXT NOT NULL,
        expression TEXT,
        options_json TEXT NOT NULL,
        correct_answer_id TEXT NOT NULL,
        ai_explanation_json TEXT NOT NULL,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
    """)

    # 9. Assessments
    c.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        concept_id TEXT,
        assessment_type TEXT NOT NULL, -- 'diagnostic', 'practice', 'reassessment'
        score INTEGER NOT NULL DEFAULT 0,
        total_questions INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED'
        started_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
    """)

    # 10. Answers
    c.execute("""
    CREATE TABLE IF NOT EXISTS answers (
        id TEXT PRIMARY KEY,
        assessment_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        selected_option_id TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        confidence_level TEXT NOT NULL,
        response_time_seconds INTEGER NOT NULL DEFAULT 15,
        mistake_category TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
    """)

    # 11. Concept Mastery
    c.execute("""
    CREATE TABLE IF NOT EXISTS concept_mastery (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        mastery_percentage INTEGER NOT NULL,
        status TEXT NOT NULL, -- 'mastered', 'needs_practice', 'critical_gap'
        last_assessed TEXT NOT NULL,
        trend INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE(student_id, concept_id)
    );
    """)

    # 12. Gap Diagnoses (AI Root-cause storage)
    c.execute("""
    CREATE TABLE IF NOT EXISTS gap_diagnoses (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        mastery_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        struggles_json TEXT NOT NULL,
        why_happening TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        possible_root_causes_json TEXT NOT NULL,
        prerequisite_gaps_json TEXT NOT NULL,
        mistake_fingerprint_json TEXT NOT NULL,
        most_repeated_pattern TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        UNIQUE(student_id, concept_id)
    );
    """)

    # 13. Recovery Plans
    c.execute("""
    CREATE TABLE IF NOT EXISTS recovery_plans (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        title TEXT NOT NULL,
        estimated_minutes INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'NOT_STARTED', -- 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'
        steps_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        UNIQUE(student_id, concept_id)
    );
    """)

    # 14. Peer Squads
    c.execute("""
    CREATE TABLE IF NOT EXISTS squads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        join_code TEXT UNIQUE NOT NULL,
        goal_description TEXT NOT NULL,
        goal_target INTEGER NOT NULL DEFAULT 50,
        goal_progress INTEGER NOT NULL DEFAULT 0,
        creator_id TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 15. Squad Members
    c.execute("""
    CREATE TABLE IF NOT EXISTS squad_members (
        id TEXT PRIMARY KEY,
        squad_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        joined_at TEXT NOT NULL,
        points_contributed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(squad_id, student_id)
    );
    """)

    # 16. Achievements
    c.execute("""
    CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        criteria_key TEXT UNIQUE NOT NULL
    );
    """)

    # 17. Student Achievements
    c.execute("""
    CREATE TABLE IF NOT EXISTS student_achievements (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        achievement_id TEXT NOT NULL,
        unlocked_at TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
        UNIQUE(student_id, achievement_id)
    );
    """)

    # 18. Comeback Scores
    c.execute("""
    CREATE TABLE IF NOT EXISTS comeback_scores (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        initial_score INTEGER NOT NULL,
        reassessment_score INTEGER NOT NULL,
        improvement_delta INTEGER NOT NULL,
        recovery_points INTEGER NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        UNIQUE(student_id, concept_id)
    );
    """)

    # Create indexes for performant lookups
    c.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_answers_student ON answers(student_id);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_concept_mastery_student ON concept_mastery(student_id);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessments(student_id);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_questions_concept ON questions(concept_id);")

    conn.commit()
    conn.close()

init_db()
