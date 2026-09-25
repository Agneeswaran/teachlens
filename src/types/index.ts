export type MasteryStatus = 'mastered' | 'needs_practice' | 'critical_gap';

export type ConfidenceLevel = 'very_confident' | 'confident' | 'not_sure' | 'guessing';

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface TopicItem {
  id: string;
  subject_id: string;
  name: string;
  description: string;
}

export interface ConceptMastery {
  id: string;
  name: string;
  category: string;
  subject_id?: string;
  masteryPercentage: number;
  status: MasteryStatus;
  lastAssessed: string;
  trend: number; // e.g. +12 or -8
  prerequisites: string[];
  subconcepts: string[];
  description: string;
}

export interface MistakePattern {
  id: string;
  category: string;
  percentage: number;
  count: number;
  description: string;
  examples: string[];
}

export interface EvidenceItem {
  id: string;
  type: 'incorrect_answer' | 'repeated_pattern' | 'time_anomaly' | 'confidence_mismatch';
  title: string;
  detail: string;
  timestamp: string;
  questionRef: string;
}

export interface GapDiagnosis {
  conceptId: string;
  conceptName: string;
  subjectId?: string;
  masteryScore: number;
  status: MasteryStatus;
  struggles: string[];
  whyHappening: string;
  evidence: EvidenceItem[];
  possibleRootCauses: string[];
  prerequisiteGaps: {
    conceptId: string;
    conceptName: string;
    impactLevel: 'high' | 'medium' | 'low';
    note: string;
  }[];
  mistakeFingerprint: MistakePattern[];
  mostRepeatedPattern: string;
}

export interface RecoveryStep {
  stepNumber: number;
  title: string;
  type: 'review' | 'video' | 'guided_example' | 'targeted_practice' | 'reassessment';
  durationMinutes: number;
  completed: boolean;
  content: {
    summary: string;
    keyRule?: string;
    formula?: string;
    walkthroughSteps?: { step: string; explanation: string }[];
    practiceCount?: number;
  };
}

export interface RecoveryPlan {
  id: string;
  conceptId: string;
  conceptName: string;
  subjectId?: string;
  title: string;
  estimatedMinutes: number;
  steps: RecoveryStep[];
  currentStepIndex: number;
  createdAt: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  subjectId?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionNumber: number;
  totalQuestions: number;
  prompt: string;
  expression?: string;
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;
    mistakeType?: string;
    explanation?: string;
  }[];
  correctAnswerId?: string;
  aiExplanation?: {
    commonMisstep: string;
    whyWrong: string;
    guidedExample: {
      problem: string;
      step1: string;
      step2: string;
      result: string;
    };
  };
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  grade?: string;
  overallMastery: number;
  conceptsMasteredCount: number;
  needsPracticeCount: number;
  streakDays: number;
  comebackPoints?: number;
  completedAssessments?: number;
  completedRecoveries?: number;
  hasStarted?: boolean;
  joinedDate?: string;
  achievements?: any[];
  recentActivity?: any[];
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  teacher_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  teacher_institution?: string;
  display_name?: string;
  streak_days: number;
  comeback_points: number;
}

export interface SquadMember {
  student_id: string;
  display_name: string;
  points_contributed: number;
  joined_at: string;
}

export interface SquadItem {
  id: string;
  name: string;
  subject_id: string;
  subject_name?: string;
  join_code: string;
  goal_description: string;
  goal_target: number;
  goal_progress: number;
  points: number;
  created_at: string;
  is_member: boolean;
  members_count: number;
  members?: SquadMember[];
}

export interface ComebackLeaderboardEntry {
  rank: number;
  student_id: string;
  display_name: string;
  improvement_delta: number;
  recovery_completions: number;
  total_comeback_points: number;
  concept_name?: string;
  subject_name?: string;
  is_current_user: boolean;
}

export interface TeacherAdminView {
  user_id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  created_at: string;
  reviewed_at?: string;
}

export interface TeacherStudentView {
  id: string;
  name: string;
  email: string;
  overallMastery: number;
  status: 'improving' | 'steady' | 'needs_attention';
  weakestConcept: string;
  weakestConceptScore: number;
  trend: 'up' | 'down' | 'neutral';
  lastActive: string;
  conceptScores: Record<string, number>;
}

export interface EarlyWarningSignal {
  id: string;
  studentId: string;
  studentName: string;
  conceptId: string;
  conceptName: string;
  historicalTrend: number[];
  severity: 'critical' | 'moderate';
  detectedAt: string;
  evidence: string;
  recommendation: string;
}

export interface TeacherAnalyticsSchema {
  totalStudents: number;
  studentsImproving: number;
  studentsNeedingAttention: number;
  classAverageMastery: number;

  conceptWeaknesses: {
    concept: string;
    averageScore: number;
    gapRate: number;
    criticalStudents: number;
  }[];

  commonMistakes: {
    pattern: string;
    frequency: number;
    concept: string;
  }[];

  earlyWarnings: EarlyWarningSignal[];

  students: TeacherStudentView[];
}export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'recovery' | 'mastery' | 'assessment' | 'system';
  read: boolean;
  actionUrl?: string;
}

export type ActiveTab =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'subjects'
  | 'mastery'
  | 'gap-analysis'
  | 'prerequisites'
  | 'recovery'
  | 'quiz'
  | 'reassessment'
  | 'history'
  | 'profile'
  | 'squads'
  | 'leaderboard'
  | 'teacher'
  | 'teacher-pending'
  | 'early-warnings'
  | 'admin-teachers';
