import type {
  SubjectItem,
  TopicItem,
  ConceptMastery,
  GapDiagnosis,
  RecoveryPlan,
  QuizQuestion,
  StudentProfile,
  SquadItem,
  ComebackLeaderboardEntry,
  TeacherAdminView,
  TeacherAnalyticsSchema
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8010/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('teachlens_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const TeachLensAPI = {
  async checkHealth(): Promise<{ status: string; database: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return await res.json();
  },

  async register(payload: { name: string; email: string; password: string; role?: string; institution?: string; department?: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  },

  async login(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Invalid email or password');
    }
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return await res.json();
  },

  async getTeacherStatus(): Promise<{ status: string; message: string; institution?: string }> {
    const res = await fetch(`${API_BASE_URL}/teacher/status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Could not fetch teacher status');
    return await res.json();
  },

  async getAdminTeachers(): Promise<TeacherAdminView[]> {
    const res = await fetch(`${API_BASE_URL}/admin/teachers/pending`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Admin authorization required');
    return await res.json();
  },

  async verifyTeacher(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/teachers/${userId}/verify`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to verify teacher');
    return await res.json();
  },

  async rejectTeacher(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/teachers/${userId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reject teacher');
    return await res.json();
  },

  async suspendTeacher(userId: string) {
    const res = await fetch(`${API_BASE_URL}/admin/teachers/${userId}/suspend`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to suspend teacher');
    return await res.json();
  },

  async getSubjects(): Promise<SubjectItem[]> {
    const res = await fetch(`${API_BASE_URL}/subjects`);
    if (!res.ok) throw new Error('Failed to load subjects');
    return await res.json();
  },

  async getSubjectTopics(subjectId: string): Promise<TopicItem[]> {
    const res = await fetch(`${API_BASE_URL}/subjects/${subjectId}/topics`);
    if (!res.ok) throw new Error('Failed to load topics');
    return await res.json();
  },

  async getSubjectConcepts(subjectId: string): Promise<ConceptMastery[]> {
    const res = await fetch(`${API_BASE_URL}/subjects/${subjectId}/concepts`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load concepts');
    return await res.json();
  },

  async getStudentOverview() {
    const res = await fetch(`${API_BASE_URL}/students/me/overview`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load student overview');
    return await res.json();
  },

  async getStudentMastery(subjectId?: string): Promise<ConceptMastery[]> {
    const url = subjectId ? `${API_BASE_URL}/students/me/mastery?subject_id=${subjectId}` : `${API_BASE_URL}/students/me/mastery`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load student mastery');
    return await res.json();
  },

  async getStudentHistory() {
    const res = await fetch(`${API_BASE_URL}/students/me/history`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load learning history');
    return await res.json();
  },

  async getStudentAchievements() {
    const res = await fetch(`${API_BASE_URL}/students/me/achievements`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load achievements');
    return await res.json();
  },

  async startAssessment(subjectId: string, conceptId?: string, assessmentType: string = 'diagnostic') {
    const res = await fetch(`${API_BASE_URL}/assessments/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject_id: subjectId, concept_id: conceptId, assessment_type: assessmentType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to start assessment');
    }
    return await res.json();
  },

  async evaluateAnswer(assessmentId: string, payload: { questionId: string; selectedOptionId: string; confidenceLevel: string; timeSpentSeconds?: number }) {
    const res = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to evaluate answer');
    return await res.json();
  },

  async submitAssessment(assessmentId: string, answers: { questionId: string; selectedOptionId: string; confidenceLevel: string; timeSpentSeconds?: number }[]) {
    const res = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return await res.json();
  },

  async getGapDiagnosis(conceptId: string = 'differentiation'): Promise<GapDiagnosis | null> {
    const res = await fetch(`${API_BASE_URL}/gap-analysis/${conceptId}`, {
      headers: getAuthHeaders()
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch gap analysis');
    return await res.json();
  },

  async getRecoveryPlans(): Promise<RecoveryPlan[]> {
    const res = await fetch(`${API_BASE_URL}/recovery`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load recovery plans');
    return await res.json();
  },

  async generateRecoveryPlan(conceptId: string): Promise<RecoveryPlan> {
    const res = await fetch(`${API_BASE_URL}/recovery/${conceptId}/generate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate recovery plan');
    return await res.json();
  },

  async completeRecoveryStep(planId: string, stepNumber: number) {
    const res = await fetch(`${API_BASE_URL}/recovery/${planId}/step/${stepNumber}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to complete recovery step');
    return await res.json();
  },

  async getSquads(subjectId?: string): Promise<SquadItem[]> {
    const url = subjectId ? `${API_BASE_URL}/squads?subject_id=${subjectId}` : `${API_BASE_URL}/squads`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load squads');
    return await res.json();
  },

  async createSquad(payload: { name: string; subject_id: string; goal_description: string; goal_target?: number }): Promise<SquadItem> {
    const res = await fetch(`${API_BASE_URL}/squads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create squad');
    return await res.json();
  },

  async joinSquad(joinCode: string) {
    const res = await fetch(`${API_BASE_URL}/squads/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ join_code: joinCode })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to join squad');
    }
    return await res.json();
  },

  async leaveSquad(squadId: string) {
    const res = await fetch(`${API_BASE_URL}/squads/${squadId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to leave squad');
    return await res.json();
  },

  async getSquadDetails(squadId: string): Promise<SquadItem> {
    const res = await fetch(`${API_BASE_URL}/squads/${squadId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load squad details');
    return await res.json();
  },

  async getComebackLeaderboard(subjectId?: string): Promise<ComebackLeaderboardEntry[]> {
    const url = subjectId ? `${API_BASE_URL}/leaderboard/comeback?subject_id=${subjectId}` : `${API_BASE_URL}/leaderboard/comeback`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load comeback leaderboard');
    return await res.json();
  },

  async getTeacherAnalytics(): Promise<TeacherAnalyticsSchema> {
    const res = await fetch(`${API_BASE_URL}/teacher/analytics`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Teacher authorization required');
    }
    return await res.json();
  }
};
