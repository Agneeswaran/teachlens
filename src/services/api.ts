import type {
  SubjectItem,
  TopicItem,
  ConceptMastery,
  GapDiagnosis,
  RecoveryPlan,
  SquadItem,
  ComebackLeaderboardEntry,
  TeacherAdminView,
  TeacherAnalyticsSchema,
  CurrentUser
} from '../types';

import {
  getDB,
  saveDB,
  getSubjects,
  getConcepts,
  getQuestions,
  getStudentProfile,
  getGapDiagnosis,
  getRecoveryPlan,
  getTeacherStudents,
  getEarlyWarnings
} from './localDb';

function getCurrentUserId(): string {
  return localStorage.getItem('teachlens_user_id') || 'local-student-1';
}

function getCurrentUser() {
  const db = getDB();

  return (
    db.users.find(user => user.id === getCurrentUserId()) ||
    db.users[0]
  );
}

function makeToken(userId: string): string {
  return `local-token-${userId}`;
}

function buildConceptMastery(subjectId?: string): ConceptMastery[] {
  const concepts = getConcepts() as any[];

  return concepts
    .filter(concept => {
      if (!subjectId) return true;

      return (
        concept.subject_id === subjectId ||
        subjectId === 'math'
      );
    })
    .map(concept => ({
      ...concept,
      subject_id: concept.subject_id || 'math'
    }));
}

export const TeachLensAPI = {

  // --------------------------------------------------
  // HEALTH
  // --------------------------------------------------

  async checkHealth(): Promise<{
    status: string;
    database: string;
  }> {
    return {
      status: 'ok',
      database: 'localStorage'
    };
  },

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
    institution?: string;
    department?: string;
  }) {
    const db = getDB();

    const existing = db.users.find(
      user =>
        user.email.toLowerCase() ===
        payload.email.toLowerCase()
    );

    if (existing) {
      throw new Error(
        'An account with this email already exists'
      );
    }

    const role =
      payload.role === 'teacher'
        ? 'teacher'
        : payload.role === 'admin'
          ? 'admin'
          : 'student';

    const user = {
      id: `local-${role}-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role,
      teacher_status:
        role === 'teacher'
          ? 'PENDING'
          : undefined,
      institution: payload.institution,
      department: payload.department
    } as any;

    db.users.push(user);

    saveDB(db);

    const token = makeToken(user.id);

    localStorage.setItem(
      'teachlens_token',
      token
    );

    localStorage.setItem(
      'teachlens_user_id',
      user.id
    );

    return {
      access_token: token,
      token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teacher_status: user.teacher_status,
        teacher_institution: user.institution,
        display_name: user.name,
        streak_days: 0,
        comeback_points: 0
      }
    };
  },

  async login(payload: {
    email: string;
    password: string;
  }) {
    const db = getDB();

    const user = db.users.find(
      item =>
        item.email.toLowerCase() ===
        payload.email.toLowerCase()
    );

    if (
      !user ||
      user.password !== payload.password
    ) {
      throw new Error(
        'Invalid email or password'
      );
    }

    const token = makeToken(user.id);

    localStorage.setItem(
      'teachlens_token',
      token
    );

    localStorage.setItem(
      'teachlens_user_id',
      user.id
    );

    return {
      access_token: token,
      token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teacher_status: user.teacher_status,
        teacher_institution: user.institution,
        display_name: user.name,
        streak_days: 0,
        comeback_points: 0
      }
    };
  },

  async getMe(): Promise<CurrentUser> {
    const user = getCurrentUser();

    if (!user) {
      throw new Error('Session invalid');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teacher_status: user.teacher_status,
      teacher_institution: user.institution,
      display_name: user.name,
      streak_days: 0,
      comeback_points: 0
    };
  },

  // --------------------------------------------------
  // TEACHER
  // --------------------------------------------------

  async getTeacherStatus(): Promise<{
    status: string;
    message: string;
    institution?: string;
  }> {
    const user = getCurrentUser();

    if (!user || user.role !== 'teacher') {
      throw new Error('Teacher account required');
    }

    return {
      status: user.teacher_status || 'PENDING',

      message:
        user.teacher_status === 'VERIFIED'
          ? 'Teacher account verified'
          : 'Teacher account is waiting for verification',

      institution: user.institution
    };
  },

  async getAdminTeachers(): Promise<
    TeacherAdminView[]
  > {
    const db = getDB();

    return db.users
      .filter(user => user.role === 'teacher')
      .map(user => ({
        user_id: user.id,
        name: user.name,
        email: user.email,
        institution:
          user.institution || 'Not specified',
        department:
          user.department || 'Not specified',
        status:
          user.teacher_status || 'PENDING',
        created_at:
          new Date().toISOString()
      }));
  },

  async verifyTeacher(userId: string) {
    const db = getDB();

    const user = db.users.find(
      item => item.id === userId
    );

    if (!user) {
      throw new Error('Teacher not found');
    }

    user.teacher_status = 'VERIFIED';

    saveDB(db);

    return {
      success: true,
      message: 'Teacher verified'
    };
  },

  async rejectTeacher(userId: string) {
    const db = getDB();

    const user = db.users.find(
      item => item.id === userId
    );

    if (!user) {
      throw new Error('Teacher not found');
    }

    user.teacher_status = 'REJECTED';

    saveDB(db);

    return {
      success: true,
      message: 'Teacher rejected'
    };
  },

  async suspendTeacher(userId: string) {
    const db = getDB();

    const user = db.users.find(
      item => item.id === userId
    );

    if (!user) {
      throw new Error('Teacher not found');
    }

    user.teacher_status = 'SUSPENDED';

    saveDB(db);

    return {
      success: true,
      message: 'Teacher suspended'
    };
  },

  // --------------------------------------------------
  // SUBJECTS
  // --------------------------------------------------

  async getSubjects(): Promise<SubjectItem[]> {
    return getSubjects() as SubjectItem[];
  },

  async getSubjectTopics(
    subjectId: string
  ): Promise<TopicItem[]> {
    const concepts = getConcepts() as any[];

    return concepts
      .filter(
        concept =>
          !subjectId ||
          concept.subject_id === subjectId
      )
      .map((concept, index) => ({
        id: `topic-${concept.id}`,
        subject_id: subjectId,
        name:
          concept.category ||
          `Topic ${index + 1}`,
        description:
          concept.description ||
          'Learning topic'
      }));
  },

  async getSubjectConcepts(
    subjectId: string
  ): Promise<ConceptMastery[]> {
    return buildConceptMastery(subjectId);
  },

  // --------------------------------------------------
  // STUDENT
  // --------------------------------------------------

  async getStudentOverview() {
    const profile = getStudentProfile();

    return {
      ...profile,

      display_name: profile.name,

      overall_mastery:
        profile.overallMastery,

      concepts_mastered:
        profile.conceptsMasteredCount,

      needs_practice:
        profile.needsPracticeCount,

      streak_days:
        profile.streakDays,

      comeback_points:
        profile.comebackPoints || 0,

      completed_assessments:
        profile.completedAssessments || 0,

      completed_recoveries:
        profile.completedRecoveries || 0,

      has_started: true
    };
  },

  async getStudentMastery(
    subjectId?: string
  ): Promise<ConceptMastery[]> {
    return buildConceptMastery(subjectId);
  },

  async getStudentHistory() {
    return [
      {
        id: 'history-1',
        title: 'Diagnostic assessment completed',
        description:
          'Completed a learning assessment.',
        timestamp:
          new Date().toISOString(),
        type: 'assessment'
      },

      {
        id: 'history-2',
        title: 'Recovery practice completed',
        description:
          'Completed targeted practice.',
        timestamp:
          new Date(
            Date.now() - 86400000
          ).toISOString(),
        type: 'recovery'
      }
    ];
  },

  async getStudentAchievements() {
    return (
      getStudentProfile().achievements || []
    );
  },

  // --------------------------------------------------
  // ASSESSMENT
  // --------------------------------------------------

  async startAssessment(
    subjectId: string,
    conceptId?: string,
    assessmentType: string = 'diagnostic'
  ) {
    const questions =
      (getQuestions() as any[])
        .filter(question => {
          if (conceptId) {
            return (
              question.conceptId ===
              conceptId
            );
          }

          return (
            !question.subjectId ||
            question.subjectId === subjectId
          );
        })
        .map(question => ({
          ...question,
          subjectId:
            question.subjectId ||
            subjectId
        }));

    const selectedQuestions =
      questions.length
        ? questions
        : (getQuestions() as any[]);

    const assessmentId =
      `assessment-${Date.now()}`;

    const db = getDB();

    db.assessments[assessmentId] = {
      id: assessmentId,
      subjectId,
      conceptId,
      assessmentType,
      answers: []
    };

    saveDB(db);

    return {
      assessmentId,
      assessment_id: assessmentId,
      concept_id:
        conceptId ||
        selectedQuestions[0]?.conceptId ||
        'differentiation',

      questions: selectedQuestions,

      totalQuestions:
        selectedQuestions.length
    };
  },

  async evaluateAnswer(
    assessmentId: string,
    payload: {
      questionId: string;
      selectedOptionId: string;
      confidenceLevel: string;
      timeSpentSeconds?: number;
    }
  ) {
    const question =
      (getQuestions() as any[]).find(
        item =>
          item.id === payload.questionId
      );

    if (!question) {
      throw new Error(
        'Question not found'
      );
    }

    const selected =
      question.options?.find(
        (option: any) =>
          option.id ===
          payload.selectedOptionId
      );

    const correct =
      selected?.isCorrect === true ||
      payload.selectedOptionId ===
        question.correctAnswerId;

    const db = getDB();

    if (db.assessments[assessmentId]) {
      db.assessments[
        assessmentId
      ].answers.push({
        ...payload,
        correct
      });

      saveDB(db);
    }

    return {
      correct,
      isCorrect: correct,

      questionId:
        payload.questionId,

      selectedOptionId:
        payload.selectedOptionId,

      correctAnswerId:
        question.correctAnswerId,

      explanation:
        selected?.explanation ||
        question.aiExplanation?.whyWrong ||
        'Review the concept and try again.'
    };
  },

  async submitAssessment(
    assessmentId: string,
    answers: {
      questionId: string;
      selectedOptionId: string;
      confidenceLevel: string;
      timeSpentSeconds?: number;
    }[]
  ) {
    let correctCount = 0;

    const questions =
      getQuestions() as any[];

    const evaluatedAnswers =
      answers.map(answer => {
        const question =
          questions.find(
            q =>
              q.id === answer.questionId
          );

        const correct =
          question &&
          (
            answer.selectedOptionId ===
              question.correctAnswerId ||

            question.options?.some(
              (option: any) =>
                option.id ===
                  answer.selectedOptionId &&
                option.isCorrect
            )
          );

        if (correct) {
          correctCount++;
        }

        return {
          ...answer,
          correct: Boolean(correct)
        };
      });

    const score =
      answers.length > 0
        ? Math.round(
            (correctCount /
              answers.length) *
              100
          )
        : 0;

    const db = getDB();

    const assessment =
      db.assessments[assessmentId];

    if (assessment) {
      assessment.answers =
        evaluatedAnswers;

      assessment.score =
        score;

      assessment.completed =
        true;

      saveDB(db);
    }

    const conceptId =
      assessment?.conceptId ||
      evaluatedAnswers.length > 0
        ? (
            questions.find(
              q =>
                q.id ===
                evaluatedAnswers[0]
                  ?.questionId
            )?.conceptId ||
            'differentiation'
          )
        : 'differentiation';

    return {
      assessmentId,
      assessment_id: assessmentId,

      score,

      masteryScore: score,

      correctCount,

      totalQuestions:
        answers.length,

      answers:
        evaluatedAnswers,

      completed: true,

      comeback_points_earned:
        Math.max(
          0,
          Math.round(score / 10)
        ),

      concept_id:
        typeof conceptId === 'string'
          ? conceptId
          : 'differentiation'
    };
  },

  // --------------------------------------------------
  // GAP ANALYSIS
  // --------------------------------------------------

  async getGapDiagnosis(
    conceptId: string =
      'differentiation'
  ): Promise<GapDiagnosis | null> {
    const diagnosis =
      getGapDiagnosis();

    if (!diagnosis) {
      return null;
    }

    if (
      conceptId ===
      'differentiation'
    ) {
      return diagnosis as GapDiagnosis;
    }

    return {
      ...(diagnosis as GapDiagnosis),
      conceptId
    };
  },

  // --------------------------------------------------
  // RECOVERY
  // --------------------------------------------------

  async getRecoveryPlans(): Promise<
    RecoveryPlan[]
  > {
    const db = getDB();

    const savedPlans =
      Object.values(
        db.recoveryPlans
      ) as RecoveryPlan[];

    if (savedPlans.length > 0) {
      return savedPlans;
    }

    return [
      getRecoveryPlan() as RecoveryPlan
    ];
  },

  async generateRecoveryPlan(
    conceptId: string
  ): Promise<RecoveryPlan> {
    const basePlan =
      getRecoveryPlan() as RecoveryPlan;

    const plan: RecoveryPlan = {
      ...basePlan,

      id:
        `recovery-${Date.now()}`,

      conceptId,

      createdAt:
        new Date().toISOString(),

      status: 'NOT_STARTED'
    };

    const db = getDB();

    db.recoveryPlans[plan.id] =
      plan;

    saveDB(db);

    return plan;
  },

  async completeRecoveryStep(
    planId: string,
    stepNumber: number
  ) {
    const db = getDB();

    const plan =
      db.recoveryPlans[
        planId
      ] as RecoveryPlan | undefined;

    if (plan) {
      const step =
        plan.steps.find(
          item =>
            item.stepNumber ===
            stepNumber
        );

      if (step) {
        step.completed = true;
      }

      const nextStep =
        plan.steps.findIndex(
          item => !item.completed
        );

      plan.currentStepIndex =
        nextStep >= 0
          ? nextStep
          : plan.steps.length - 1;

      if (
        plan.steps.every(
          item => item.completed
        )
      ) {
        plan.status =
          'COMPLETED';
      } else {
        plan.status =
          'IN_PROGRESS';
      }

      saveDB(db);

      return plan;
    }

    const fallback =
      getRecoveryPlan() as RecoveryPlan;

    return {
      ...fallback,

      steps:
        fallback.steps.map(step =>
          step.stepNumber ===
          stepNumber
            ? {
                ...step,
                completed: true
              }
            : step
        )
    };
  },

  // --------------------------------------------------
  // PEER SQUADS
  // --------------------------------------------------

  async getSquads(
    subjectId?: string
  ): Promise<SquadItem[]> {
    const db = getDB();

    return db.squads.filter(
      squad =>
        !subjectId ||
        squad.subject_id ===
          subjectId
    );
  },

  async createSquad(payload: {
    name: string;
    subject_id: string;
    goal_description: string;
    goal_target?: number;
  }): Promise<SquadItem> {
    const db = getDB();

    const currentUser =
      getCurrentUser();

    const squad: SquadItem = {
      id:
        `squad-${Date.now()}`,

      name:
        payload.name,

      subject_id:
        payload.subject_id,

      join_code:
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase(),

      goal_description:
        payload.goal_description,

      goal_target:
        payload.goal_target ||
        100,

      goal_progress: 0,

      points: 0,

      created_at:
        new Date().toISOString(),

      is_member: true,

      members_count: 1,

      members: [
        {
          student_id:
            getCurrentUserId(),

          display_name:
            currentUser?.name ||
            'Student',

          points_contributed: 0,

          joined_at:
            new Date().toISOString()
        }
      ]
    };

    db.squads.push(squad);

    saveDB(db);

    return squad;
  },

  async joinSquad(
    joinCode: string
  ) {
    const db = getDB();

    const squad =
      db.squads.find(
        item =>
          item.join_code
            .toUpperCase() ===
          joinCode.toUpperCase()
      );

    if (!squad) {
      throw new Error(
        'Squad not found'
      );
    }

    if (!squad.is_member) {
      squad.is_member = true;
      squad.members_count += 1;
    }

    saveDB(db);

    return squad;
  },

  async leaveSquad(
    squadId: string
  ) {
    const db = getDB();

    const squad =
      db.squads.find(
        item =>
          item.id === squadId
      );

    if (!squad) {
      throw new Error(
        'Squad not found'
      );
    }

    squad.is_member = false;

    squad.members_count =
      Math.max(
        0,
        squad.members_count - 1
      );

    saveDB(db);

    return squad;
  },

  async getSquadDetails(
    squadId: string
  ): Promise<SquadItem> {
    const db = getDB();

    const squad =
      db.squads.find(
        item =>
          item.id === squadId
      );

    if (!squad) {
      throw new Error(
        'Squad not found'
      );
    }

    return squad;
  },

  // --------------------------------------------------
  // LEADERBOARD
  // --------------------------------------------------

  async getComebackLeaderboard(
    _subjectId?: string
  ): Promise<
    ComebackLeaderboardEntry[]
  > {
    const currentUser =
      getCurrentUser();

    return [
      {
        rank: 1,

        student_id:
          'student-1',

        display_name:
          'Alex Rivera',

        improvement_delta: 24,

        recovery_completions: 5,

        total_comeback_points: 240,

        concept_name:
          'Differentiation',

        subject_name:
          'Mathematics',

        is_current_user:
          false
      },

      {
        rank: 2,

        student_id:
          getCurrentUserId(),

        display_name:
          currentUser?.name ||
          'Student',

        improvement_delta: 18,

        recovery_completions: 4,

        total_comeback_points: 180,

        concept_name:
          'Functions',

        subject_name:
          'Mathematics',

        is_current_user:
          true
      }
    ];
  },

  // --------------------------------------------------
  // TEACHER ANALYTICS
  // --------------------------------------------------

  async getTeacherAnalytics(): Promise<
    TeacherAnalyticsSchema
  > {
    const students =
      getTeacherStudents();

    return {
      totalStudents:
        students.length,

      studentsImproving:
        students.filter(
          (student: any) =>
            student.status ===
            'improving'
        ).length,

      studentsNeedingAttention:
        students.filter(
          (student: any) =>
            student.status ===
            'needs_attention'
        ).length,

      classAverageMastery:
        students.length > 0
          ? Math.round(
              students.reduce(
                (
                  total: number,
                  student: any
                ) =>
                  total +
                  student.overallMastery,
                0
              ) /
                students.length
            )
          : 0,

      conceptWeaknesses: [
        {
          concept:
            'Differentiation',

          averageScore: 52,

          gapRate: 48,

          criticalStudents: 2
        },

        {
          concept:
            'Functions',

          averageScore: 61,

          gapRate: 39,

          criticalStudents: 1
        },

        {
          concept:
            'Limits',

          averageScore: 68,

          gapRate: 32,

          criticalStudents: 1
        }
      ],

      commonMistakes: [
        {
          pattern:
            'Formula application error',

          frequency: 12,

          concept:
            'Differentiation'
        },

        {
          pattern:
            'Sign error',

          frequency: 8,

          concept:
            'Algebra'
        }
      ],

      earlyWarnings:
        getEarlyWarnings(),

      students
    };
  }
};