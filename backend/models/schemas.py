from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ================= AUTH SCHEMAS =================
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    role: str = "student"  # 'student' or 'teacher'
    institution: Optional[str] = None
    department: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    teacher_status: Optional[str] = None
    teacher_institution: Optional[str] = None
    display_name: str
    streak_days: int
    comeback_points: int
    privacy_level: str

# ================= TEACHER ADMIN SCHEMAS =================
class TeacherStatusResponse(BaseModel):
    status: str  # 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'
    message: str
    institution: Optional[str] = None
    department: Optional[str] = None

class TeacherAdminView(BaseModel):
    user_id: str
    name: str
    email: str
    institution: str
    department: str
    status: str
    created_at: str
    reviewed_at: Optional[str] = None

# ================= SUBJECTS & CONCEPTS =================
class SubjectSchema(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    icon: str
    color: str

class TopicSchema(BaseModel):
    id: str
    subject_id: str
    name: str
    description: str

class ConceptMasterySchema(BaseModel):
    id: str
    name: str
    category: str
    subject_id: Optional[str] = None
    masteryPercentage: int
    status: str  # 'mastered' | 'needs_practice' | 'critical_gap'
    lastAssessed: str
    trend: int
    prerequisites: List[str]
    subconcepts: List[str]
    description: str

# ================= ASSESSMENTS & QUIZ =================
class StartAssessmentRequest(BaseModel):
    subject_id: str
    concept_id: Optional[str] = None
    assessment_type: str = "diagnostic"  # 'diagnostic', 'practice', 'reassessment'

class QuizOptionSchema(BaseModel):
    id: str
    text: str
    isCorrect: Optional[bool] = None  # Hidden on assessment start, returned on evaluation
    mistakeType: Optional[str] = None
    explanation: Optional[str] = None

class QuizQuestionSchema(BaseModel):
    id: str
    conceptId: str
    conceptName: str
    subjectId: str
    difficulty: str
    questionNumber: int
    totalQuestions: int
    prompt: str
    expression: Optional[str] = None
    options: List[QuizOptionSchema]
    correctAnswerId: Optional[str] = None
    aiExplanation: Optional[Dict[str, Any]] = None

class StartAssessmentResponse(BaseModel):
    assessment_id: str
    subject_id: str
    concept_id: Optional[str]
    assessment_type: str
    total_questions: int
    questions: List[QuizQuestionSchema]

class AnswerSubmissionSchema(BaseModel):
    questionId: str
    selectedOptionId: str
    confidenceLevel: str  # 'very_confident' | 'confident' | 'not_sure' | 'guessing'
    timeSpentSeconds: Optional[int] = 15

class AnswerEvaluationResponse(BaseModel):
    isCorrect: bool
    selectedOptionId: str
    correctOptionId: str
    explanation: str
    mistakeCategory: Optional[str] = None
    confidenceMismatch: bool
    aiDiagnosis: str
    updatedMastery: Optional[int] = None
    guidedPractice: Dict[str, Any]

class SubmitAssessmentRequest(BaseModel):
    answers: List[AnswerSubmissionSchema]

class SubmitAssessmentResponse(BaseModel):
    assessment_id: str
    score_percentage: int
    correct_count: int
    total_questions: int
    concept_id: Optional[str]
    concept_name: Optional[str]
    mastery_status: str
    improvement_delta: Optional[int] = None
    achievements_unlocked: List[str]
    gap_detected: bool

# ================= AI GAP ANALYSIS =================
class EvidenceItemSchema(BaseModel):
    id: str
    type: str
    title: str
    detail: str
    timestamp: str
    questionRef: str

class MistakePatternSchema(BaseModel):
    id: str
    category: str
    percentage: int
    count: int
    description: str
    examples: List[str]

class PrerequisiteGapSchema(BaseModel):
    conceptId: str
    conceptName: str
    impactLevel: str
    note: str

class GapDiagnosisSchema(BaseModel):
    conceptId: str
    conceptName: str
    subjectId: Optional[str] = None
    masteryScore: int
    status: str
    struggles: List[str]
    whyHappening: str
    evidence: List[EvidenceItemSchema]
    possibleRootCauses: List[str]
    prerequisiteGaps: List[PrerequisiteGapSchema]
    mistakeFingerprint: List[MistakePatternSchema]
    mostRepeatedPattern: str

# ================= RECOVERY PLAN =================
class RecoveryStepContent(BaseModel):
    summary: str
    keyRule: Optional[str] = None
    formula: Optional[str] = None
    walkthroughSteps: Optional[List[Dict[str, str]]] = None
    practiceCount: Optional[int] = None

class RecoveryStepSchema(BaseModel):
    stepNumber: int
    title: str
    type: str
    durationMinutes: int
    completed: bool
    content: RecoveryStepContent

class RecoveryPlanSchema(BaseModel):
    id: str
    conceptId: str
    conceptName: str
    subjectId: Optional[str] = None
    title: str
    estimatedMinutes: int
    steps: List[RecoveryStepSchema]
    currentStepIndex: int
    createdAt: str
    status: str  # 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'

# ================= PEER SQUADS =================
class CreateSquadRequest(BaseModel):
    name: str = Field(..., min_length=3)
    subject_id: str
    goal_description: str
    goal_target: int = 50

class JoinSquadRequest(BaseModel):
    join_code: str

class SquadMemberView(BaseModel):
    student_id: str
    display_name: str
    points_contributed: int
    joined_at: str

class SquadView(BaseModel):
    id: str
    name: str
    subject_id: str
    subject_name: Optional[str] = None
    join_code: str
    goal_description: str
    goal_target: int
    goal_progress: int
    points: int
    created_at: str
    is_member: bool
    members_count: int
    members: Optional[List[SquadMemberView]] = None

# ================= COMEBACK LEADERBOARD =================
class ComebackLeaderboardEntry(BaseModel):
    rank: int
    student_id: str
    display_name: str
    improvement_delta: int
    recovery_completions: int
    total_comeback_points: int
    concept_name: Optional[str] = None
    subject_name: Optional[str] = None
    is_current_user: bool = False

# ================= TEACHER ANALYTICS =================
class EarlyWarningSignalSchema(BaseModel):
    id: str
    studentId: str
    studentName: str
    conceptId: str
    conceptName: str
    historicalTrend: List[int]
    severity: str
    detectedAt: str
    evidence: str
    recommendation: str

class TeacherAnalyticsSchema(BaseModel):
    totalStudents: int
    studentsImproving: int
    studentsNeedingAttention: int
    classAverageMastery: int
    conceptWeaknesses: List[Dict[str, Any]]
    commonMistakes: List[Dict[str, Any]]
    earlyWarnings: List[EarlyWarningSignalSchema]
