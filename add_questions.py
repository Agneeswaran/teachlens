import json
from backend.database.db import get_connection

questions = [
    (
        "q-math-algebra-1", "algebra", "sub-math", "Easy",
        "Solve for x: 3x + 7 = 22.", "3x + 7 = 22",
        json.dumps([
            {"id": "opt-1", "text": "5"},
            {"id": "opt-2", "text": "7"},
            {"id": "opt-3", "text": "9"},
            {"id": "opt-4", "text": "10"}
        ]),
        "opt-1",
        json.dumps({"explanation": "Subtract 7 from both sides, then divide by 3. x = 5."})
    ),
    (
        "q-math-algebra-2", "algebra", "sub-math", "Medium",
        "Factor the expression x² + 5x + 6.", "x^2 + 5x + 6",
        json.dumps([
            {"id": "opt-1", "text": "(x + 2)(x + 3)"},
            {"id": "opt-2", "text": "(x + 1)(x + 6)"},
            {"id": "opt-3", "text": "(x - 2)(x - 3)"},
            {"id": "opt-4", "text": "(x + 5)(x + 1)"}
        ]),
        "opt-1",
        json.dumps({"explanation": "2 × 3 = 6 and 2 + 3 = 5."})
    ),
    (
        "q-math-functions-1", "functions", "sub-math", "Easy",
        "If f(x) = 2x + 3, what is f(4)?", "f(x) = 2x + 3",
        json.dumps([
            {"id": "opt-1", "text": "11"},
            {"id": "opt-2", "text": "8"},
            {"id": "opt-3", "text": "10"},
            {"id": "opt-4", "text": "14"}
        ]),
        "opt-1",
        json.dumps({"explanation": "Substitute x = 4: 2(4) + 3 = 11."})
    ),
    (
        "q-math-functions-2", "functions", "sub-math", "Medium",
        "What is the domain of f(x) = 1/(x - 4)?", "f(x) = 1/(x - 4)",
        json.dumps([
            {"id": "opt-1", "text": "All real numbers except 4"},
            {"id": "opt-2", "text": "All real numbers"},
            {"id": "opt-3", "text": "Only x = 4"},
            {"id": "opt-4", "text": "Only positive real numbers"}
        ]),
        "opt-1",
        json.dumps({"explanation": "The denominator cannot be zero, so x cannot be 4."})
    ),
    (
        "q-math-limits-1", "limits", "sub-math", "Medium",
        "Evaluate lim(x→2) (x² + 3).", "lim(x->2)(x^2 + 3)",
        json.dumps([
            {"id": "opt-1", "text": "7"},
            {"id": "opt-2", "text": "5"},
            {"id": "opt-3", "text": "8"},
            {"id": "opt-4", "text": "9"}
        ]),
        "opt-1",
        json.dumps({"explanation": "Substitute x = 2: 2² + 3 = 7."})
    ),
    (
        "q-math-integration-1", "integration", "sub-math", "Medium",
        "What is the indefinite integral of 3x² with respect to x?", "integral 3x^2 dx",
        json.dumps([
            {"id": "opt-1", "text": "x³ + C"},
            {"id": "opt-2", "text": "6x + C"},
            {"id": "opt-3", "text": "3x³ + C"},
            {"id": "opt-4", "text": "x² + C"}
        ]),
        "opt-1",
        json.dumps({"explanation": "The antiderivative of 3x² is x³ + C."})
    ),
    (
        "q-math-integration-2", "integration", "sub-math", "Easy",
        "What is the value of the integral of x from 0 to 2?", "integral x dx from 0 to 2",
        json.dumps([
            {"id": "opt-1", "text": "2"},
            {"id": "opt-2", "text": "1"},
            {"id": "opt-3", "text": "4"},
            {"id": "opt-4", "text": "0"}
        ]),
        "opt-1",
        json.dumps({"explanation": "The antiderivative is x²/2. From 0 to 2, the value is 2."})
    )
]

conn = get_connection()
c = conn.cursor()

for q in questions:
    c.execute("""
        INSERT OR IGNORE INTO questions
        (id, concept_id, subject_id, difficulty, prompt, expression,
         options_json, correct_answer_id, ai_explanation_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, q)

conn.commit()

c.execute("SELECT COUNT(*) FROM questions WHERE subject_id = 'sub-math'")
count = c.fetchone()[0]

conn.close()

print(f"Math questions in database: {count}")
print("New questions added successfully.")