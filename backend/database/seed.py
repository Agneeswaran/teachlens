"""
TeachLens Database Seeding Script.
Populates standard multi-subject taxonomy (Math, Physics, Chem, CS, Bio, English),
question banks, achievement types, and default administrator / verified teacher.
DOES NOT populate fake student assessment or fake mastery data.
"""

import json
import os
"""
TeachLens Database Seeding Script.

Populates:
- Standard multi-subject taxonomy
- Math, Physics, Chemistry, Computer Science, Biology, English questions
- Achievement types
- Optional administrator / verified teacher account

Passwords are supplied through environment variables.
No default passwords are stored in source code.
"""

import json
import os
from datetime import datetime, timezone

from backend.database.db import get_connection, hash_password


def seed_database():
    conn = get_connection()
    c = conn.cursor()

    # Check if subjects are already seeded
    c.execute("SELECT COUNT(*) FROM subjects;")
    if c.fetchone()[0] > 0:
        conn.close()
        return

    now = datetime.now(timezone.utc).isoformat()

    # ============================================================
    # 1. Seed Admin & Sample Verified Teacher
    # ============================================================
    #
    # Passwords must come from environment variables.
    # Do NOT put real/default passwords directly in this file.
    #

    admin_id = "user-admin-01"
    teacher_id = "user-teacher-01"

    admin_password = os.getenv("TEACHLENS_ADMIN_PASSWORD")
    teacher_password = os.getenv("TEACHLENS_TEACHER_PASSWORD")

    if admin_password and teacher_password:

        admin_pass = hash_password(admin_password)

        c.execute(
            """
            INSERT OR IGNORE INTO users
            (id, email, password_hash, role, name, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                admin_id,
                "admin@teachlens.ai",
                admin_pass,
                "admin",
                "System Administrator",
                now,
            ),
        )

        teacher_pass = hash_password(teacher_password)

        c.execute(
            """
            INSERT OR IGNORE INTO users
            (id, email, password_hash, role, name, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                teacher_id,
                "carter@academy.edu",
                teacher_pass,
                "teacher",
                "Prof. Eleanor Carter",
                now,
            ),
        )

        c.execute(
            """
            INSERT OR IGNORE INTO teacher_profiles
            (user_id, institution, department, status, reviewed_at, reviewed_by)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                teacher_id,
                "Stanford University",
                "Department of Mathematics",
                "VERIFIED",
                now,
                admin_id,
            ),
        )

    # ============================================================
    # 2. Subjects
    # ============================================================

    subjects = [
        ("math", "Mathematics"),
        ("physics", "Physics"),
        ("chemistry", "Chemistry"),
        ("cs", "Computer Science"),
        ("biology", "Biology"),
        ("english", "English"),
    ]

    for subject_id, subject_name in subjects:
        c.execute(
            """
            INSERT OR IGNORE INTO subjects
            (id, name)
            VALUES (?, ?)
            """,
            (subject_id, subject_name),
        )

    # ============================================================
    # 3. Math Questions
    # ============================================================

    math_questions = [
        {
            "id": "math-algebra-001",
            "concept": "algebra",
            "question": "Solve for x: 2x + 5 = 15.",
            "options": ["x = 5", "x = 10", "x = 2", "x = 7"],
            "answer": "x = 5",
            "difficulty": "easy",
        },
        {
            "id": "math-algebra-002",
            "concept": "algebra",
            "question": "If 3x - 4 = 11, what is the value of x?",
            "options": ["3", "4", "5", "6"],
            "answer": "5",
            "difficulty": "easy",
        },
        {
            "id": "math-functions-001",
            "concept": "functions",
            "question": "If f(x) = 2x + 3, what is f(4)?",
            "options": ["7", "9", "11", "12"],
            "answer": "11",
            "difficulty": "easy",
        },
        {
            "id": "math-functions-002",
            "concept": "functions",
            "question": "If f(x) = x², what is f(5)?",
            "options": ["10", "15", "20", "25"],
            "answer": "25",
            "difficulty": "easy",
        },
        {
            "id": "math-limits-001",
            "concept": "limits",
            "question": "What is lim(x→2) (x + 3)?",
            "options": ["3", "4", "5", "6"],
            "answer": "5",
            "difficulty": "easy",
        },
        {
            "id": "math-integration-001",
            "concept": "integration",
            "question": "What is ∫2x dx?",
            "options": ["x² + C", "2x² + C", "x + C", "2 + C"],
            "answer": "x² + C",
            "difficulty": "easy",
        },
        {
            "id": "math-integration-002",
            "concept": "integration",
            "question": "What is ∫3x² dx?",
            "options": ["x³ + C", "3x³ + C", "x² + C", "6x + C"],
            "answer": "x³ + C",
            "difficulty": "easy",
        },
        {
            "id": "math-differentiation-001",
            "concept": "differentiation",
            "question": "What is the derivative of x²?",
            "options": ["x", "2x", "x²", "2"],
            "answer": "2x",
            "difficulty": "easy",
        },
        {
            "id": "math-differentiation-002",
            "concept": "differentiation",
            "question": "What is the derivative of 3x²?",
            "options": ["3x", "6x", "x²", "6"],
            "answer": "6x",
            "difficulty": "easy",
        },
        {
            "id": "math-differentiation-003",
            "concept": "differentiation",
            "question": "What is the derivative of x³?",
            "options": ["x²", "2x", "3x²", "3x"],
            "answer": "3x²",
            "difficulty": "medium",
        },
    ]

    for q in math_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "math",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 4. Physics Questions
    # ============================================================

    physics_questions = [
        {
            "id": "physics-newton-001",
            "concept": "newtons_laws",
            "question": "Which law states that every action has an equal and opposite reaction?",
            "options": [
                "Newton's First Law",
                "Newton's Second Law",
                "Newton's Third Law",
                "Law of Gravitation",
            ],
            "answer": "Newton's Third Law",
            "difficulty": "easy",
        },
        {
            "id": "physics-force-001",
            "concept": "force",
            "question": "What is the SI unit of force?",
            "options": ["Joule", "Newton", "Watt", "Pascal"],
            "answer": "Newton",
            "difficulty": "easy",
        },
    ]

    for q in physics_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "physics",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 5. Chemistry Questions
    # ============================================================

    chemistry_questions = [
        {
            "id": "chemistry-atom-001",
            "concept": "atomic_structure",
            "question": "Which particle has a negative charge?",
            "options": ["Proton", "Neutron", "Electron", "Nucleus"],
            "answer": "Electron",
            "difficulty": "easy",
        },
        {
            "id": "chemistry-periodic-001",
            "concept": "periodic_table",
            "question": "What is the chemical symbol for oxygen?",
            "options": ["O", "Ox", "C", "N"],
            "answer": "O",
            "difficulty": "easy",
        },
    ]

    for q in chemistry_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "chemistry",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 6. Computer Science Questions
    # ============================================================

    cs_questions = [
        {
            "id": "cs-oop-001",
            "concept": "oop",
            "question": "Which concept allows one class to acquire properties of another class?",
            "options": [
                "Encapsulation",
                "Inheritance",
                "Polymorphism",
                "Abstraction",
            ],
            "answer": "Inheritance",
            "difficulty": "easy",
        },
        {
            "id": "cs-dsa-001",
            "concept": "data_structures",
            "question": "Which data structure follows the LIFO principle?",
            "options": ["Queue", "Stack", "Array", "Linked List"],
            "answer": "Stack",
            "difficulty": "easy",
        },
    ]

    for q in cs_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "cs",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 7. Biology Questions
    # ============================================================

    biology_questions = [
        {
            "id": "biology-cell-001",
            "concept": "cell",
            "question": "Which organelle is known as the powerhouse of the cell?",
            "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
            "answer": "Mitochondria",
            "difficulty": "easy",
        },
        {
            "id": "biology-dna-001",
            "concept": "genetics",
            "question": "What molecule carries genetic information?",
            "options": ["RNA", "DNA", "Protein", "Glucose"],
            "answer": "DNA",
            "difficulty": "easy",
        },
    ]

    for q in biology_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "biology",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 8. English Questions
    # ============================================================

    english_questions = [
        {
            "id": "english-grammar-001",
            "concept": "grammar",
            "question": "Choose the correct sentence.",
            "options": [
                "She go to school.",
                "She goes to school.",
                "She going to school.",
                "She gone to school.",
            ],
            "answer": "She goes to school.",
            "difficulty": "easy",
        },
        {
            "id": "english-vocabulary-001",
            "concept": "vocabulary",
            "question": "What is the opposite of 'ancient'?",
            "options": ["Old", "Modern", "Historic", "Past"],
            "answer": "Modern",
            "difficulty": "easy",
        },
    ]

    for q in english_questions:
        c.execute(
            """
            INSERT OR IGNORE INTO questions
            (id, subject_id, concept, question, options, answer, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                q["id"],
                "english",
                q["concept"],
                q["question"],
                json.dumps(q["options"]),
                q["answer"],
                q["difficulty"],
            ),
        )

    # ============================================================
    # 9. Achievement Types
    # ============================================================

    achievements = [
        ("first_assessment", "First Assessment", "Complete your first assessment."),
        ("perfect_score", "Perfect Score", "Get 100% in an assessment."),
        ("improving", "Improving", "Show improvement in a weak concept."),
        ("streak", "Learning Streak", "Maintain a learning streak."),
    ]

    for achievement_id, name, description in achievements:
        c.execute(
            """
            INSERT OR IGNORE INTO achievements
            (id, name, description)
            VALUES (?, ?, ?)
            """,
            (achievement_id, name, description),
        )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    seed_database()