import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  ActiveTab,
  SubjectItem,
  ConceptMastery,
  GapDiagnosis,
  RecoveryPlan,
  QuizQuestion,
  StudentProfile,
  CurrentUser,
  TeacherStudentView,
  NotificationItem
} from '../types';
import { TeachLensAPI } from '../services/api';

interface AppContextType {
  // Connection & Health
  isBackendUnavailable: boolean;
  retryBackendHealth: () => Promise<void>;
  isAuthLoading: boolean;

  // Session & User
  isLoggedIn: boolean;
  currentUser: CurrentUser | null;
  userRole: 'student' | 'teacher' | 'admin';
  setUserRole: (role: 'student' | 'teacher' | 'admin') => void;
  teacherStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | null;
  checkTeacherVerification: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role?: string; institution?: string; department?: string }) => Promise<void>;
  logout: () => void;

  // Navigation
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;

  // Multi-Subject
  subjects: SubjectItem[];
  selectedSubject: SubjectItem | null;
  setSelectedSubject: (sub: SubjectItem) => void;

  // Student State
  studentProfile: StudentProfile;
  concepts: ConceptMastery[];
  gapDiagnosis: GapDiagnosis | null;
  recoveryPlan: RecoveryPlan | null;
  refreshStudentData: () => Promise<void>;

  // Quiz Engine
  activeAssessmentId: string | null;
  quizQuestions: QuizQuestion[];
  activeQuizIndex: number;
  setActiveQuizIndex: (idx: number) => void;
  startQuiz: (subjectId: string, conceptId?: string) => Promise<void>;
  submitQuiz: (answers: { questionId: string; selectedOptionId: string; confidenceLevel: string; timeSpentSeconds?: number }[]) => Promise<any>;
  lastAssessmentResult: any | null;

  // Recovery Engine
  generateRecovery: (conceptId: string) => Promise<void>;
  completeRecoveryStep: (stepNumber: number) => Promise<void>;

  // Modals & Drawers
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;

  // Legacy compat for views
  selectedStudent: TeacherStudentView | null;
  isStudentDrawerOpen: boolean;
  openStudentDrawer: (student: TeacherStudentView) => void;
  closeStudentDrawer: () => void;
  activePrereqConcept: string | null;
  setActivePrereqConcept: (conceptId: string | null) => void;
  reassessmentBefore: number;
  reassessmentAfter: number;
  isReassessmentCompleted: boolean;
  triggerReassessmentCompletion: () => void;
  updateConceptScore: (conceptId: string, score: number) => void;
}

const defaultStudentProfile: StudentProfile = {
  id: '',
  name: 'New Student',
  email: '',
  role: 'student',
  overallMastery: 0,
  conceptsMasteredCount: 0,
  needsPracticeCount: 0,
  streakDays: 0,
  comebackPoints: 0,
  completedAssessments: 0,
  completedRecoveries: 0,
  hasStarted: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Backend & Auth States
  const [isBackendUnavailable, setIsBackendUnavailable] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [teacherStatus, setTeacherStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | null>(null);

  // Navigation
  const [currentTab, setCurrentTab] = useState<ActiveTab>('landing');

  // Multi-Subject
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubjectState] = useState<SubjectItem | null>(null);

  // Learning Data
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(defaultStudentProfile);
  const [concepts, setConcepts] = useState<ConceptMastery[]>([]);
  const [gapDiagnosis, setGapDiagnosis] = useState<GapDiagnosis | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);

  // Assessments
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [lastAssessmentResult, setLastAssessmentResult] = useState<any | null>(null);

  // Modals & Alerts
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Teacher Drawer & Reassessment Compat
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudentView | null>(null);
  const [isStudentDrawerOpen, setIsStudentDrawerOpen] = useState<boolean>(false);
  const [activePrereqConcept, setActivePrereqConcept] = useState<string | null>(null);
  const [reassessmentBefore, setReassessmentBefore] = useState<number>(32);
  const [reassessmentAfter, setReassessmentAfter] = useState<number>(76);
  const [isReassessmentCompleted, setIsReassessmentCompleted] = useState<boolean>(false);

  // 1. Initial Health Check & Session Verification
  const verifySession = async () => {
    setIsAuthLoading(true);
    try {
      // Backend Connection Test
      await TeachLensAPI.checkHealth();
      setIsBackendUnavailable(false);

      // Load Subjects
      const subs = await TeachLensAPI.getSubjects();
      setSubjects(subs);
      if (subs.length > 0 && !selectedSubject) {
        setSelectedSubjectState(subs[0]);
      }

      // Check existing token
      const token = localStorage.getItem('teachlens_token');
      if (token) {
        try {
          const user = await TeachLensAPI.getMe();
          handleAuthSuccess(user, token, false);
        } catch {
          // Token expired or invalid
          localStorage.removeItem('teachlens_token');
          setIsLoggedIn(false);
          setCurrentUser(null);
          setCurrentTab('landing');
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Backend connection error:', err);
      setIsBackendUnavailable(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  // 2. Auth Handler
  const handleAuthSuccess = async (user: any, token: string, shouldRedirect: boolean = true) => {
    localStorage.setItem('teachlens_token', token);
    setIsLoggedIn(true);

    const mappedUser: CurrentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      teacher_status: user.teacher_status,
      teacher_institution: user.teacher_institution,
      display_name: user.display_name || user.name,
      streak_days: user.streak_days || 0,
      comeback_points: user.comeback_points || 0
    };

    setCurrentUser(mappedUser);
    setUserRole(mappedUser.role);

    if (mappedUser.role === 'teacher') {
      try {
        const tStatus = await TeachLensAPI.getTeacherStatus();
        setTeacherStatus(tStatus.status as any);
        if (tStatus.status === 'VERIFIED') {
          if (shouldRedirect) setCurrentTab('teacher');
        } else {
          setCurrentTab('teacher-pending');
        }
      } catch {
        setTeacherStatus(user.teacher_status || 'PENDING');
        setCurrentTab('teacher-pending');
      }
    } else if (mappedUser.role === 'admin') {
      if (shouldRedirect) setCurrentTab('admin-teachers');
    } else {
      // Student Account
      await loadStudentData(selectedSubject?.id);
      if (shouldRedirect) setCurrentTab('dashboard');
    }
  };

  // 3. Load Student Data from DB
  const loadStudentData = async (subjectId?: string) => {
    try {
      const overview = await TeachLensAPI.getStudentOverview();
      const mastery = await TeachLensAPI.getStudentMastery(subjectId);
      const plans = await TeachLensAPI.getRecoveryPlans();

      setStudentProfile({
        id: currentUser?.id || '',
        name: overview.display_name || currentUser?.name || 'Student',
        email: currentUser?.email || '',
        role: 'student',
        overallMastery: overview.overall_mastery,
        conceptsMasteredCount: overview.concepts_mastered,
        needsPracticeCount: overview.needs_practice,
        streakDays: overview.streak_days,
        comebackPoints: overview.comeback_points,
        completedAssessments: overview.completed_assessments,
        completedRecoveries: overview.completed_recoveries,
        hasStarted: overview.has_started
      });

      setConcepts(mastery);

      if (plans.length > 0) {
        setRecoveryPlan(plans[0]);
      } else {
        setRecoveryPlan(null);
      }

      // Check if diagnostic gap is available
      const firstGap = mastery.find((c) => c.status === 'critical_gap' || c.status === 'needs_practice');
      if (firstGap) {
        const diag = await TeachLensAPI.getGapDiagnosis(firstGap.id);
        setGapDiagnosis(diag);
      } else {
        setGapDiagnosis(null);
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    }
  };

  const refreshStudentData = async () => {
    if (isLoggedIn && userRole === 'student') {
      await loadStudentData(selectedSubject?.id);
    }
  };

  // 4. Change Subject
  const setSelectedSubject = async (sub: SubjectItem) => {
    setSelectedSubjectState(sub);
    if (isLoggedIn && userRole === 'student') {
      try {
        const mastery = await TeachLensAPI.getStudentMastery(sub.id);
        setConcepts(mastery);
      } catch (err) {
        console.error('Failed to load subject mastery:', err);
      }
    }
  };

  // 5. Login / Register / Logout
  const login = async (payload: { email: string; password: string }) => {
    const res = await TeachLensAPI.login(payload);
    await handleAuthSuccess(res.user, res.token, true);
    closeAuthModal();
  };

  const register = async (payload: { name: string; email: string; password: string; role?: string; institution?: string; department?: string }) => {
    const res = await TeachLensAPI.register(payload);
    await handleAuthSuccess(res.user, res.token, true);
    closeAuthModal();
  };

  const logout = () => {
    localStorage.removeItem('teachlens_token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('student');
    setTeacherStatus(null);
    setStudentProfile(defaultStudentProfile);
    setConcepts([]);
    setGapDiagnosis(null);
    setRecoveryPlan(null);
    setCurrentTab('landing');
  };

  const checkTeacherVerification = async () => {
    try {
      const res = await TeachLensAPI.getTeacherStatus();
      setTeacherStatus(res.status as any);
      if (res.status === 'VERIFIED') {
        setCurrentTab('teacher');
      }
    } catch (err) {
      console.error('Teacher status check failed:', err);
    }
  };

  // 6. Assessments & Quizzes
  const startQuiz = async (subjectId: string, conceptId?: string) => {
    const res = await TeachLensAPI.startAssessment(subjectId, conceptId, 'diagnostic');
    setActiveAssessmentId(res.assessment_id);
    setQuizQuestions(res.questions);
    setActiveQuizIndex(0);
    setCurrentTab('quiz');
  };

  const submitQuiz = async (answers: { questionId: string; selectedOptionId: string; confidenceLevel: string; timeSpentSeconds?: number }[]) => {
    if (!activeAssessmentId) throw new Error('No active assessment.');
    const result = await TeachLensAPI.submitAssessment(activeAssessmentId, answers);
    setLastAssessmentResult(result);
    setReassessmentBefore(result.score - (result.comeback_points_earned || 0));
    setReassessmentAfter(result.score);

    // Refresh student data & gap diagnosis
    await refreshStudentData();

    // Check if recovery is needed
    if (result.concept_id) {
      const diag = await TeachLensAPI.getGapDiagnosis(result.concept_id);
      if (diag) setGapDiagnosis(diag);
    }

    return result;
  };

  // 7. Recovery Engine
  const generateRecovery = async (conceptId: string) => {
    const plan = await TeachLensAPI.generateRecoveryPlan(conceptId);
    setRecoveryPlan(plan);
    setCurrentTab('recovery');
  };

  const completeRecoveryStep = async (stepNumber: number) => {
    if (!recoveryPlan) return;
    await TeachLensAPI.completeRecoveryStep(recoveryPlan.id, stepNumber);

    // Update local plan state
    setRecoveryPlan((prev) => {
      if (!prev) return null;
      const updatedSteps = prev.steps.map((st) =>
        st.stepNumber === stepNumber ? { ...st, completed: true } : st
      );
      const allDone = updatedSteps.every((s) => s.completed);
      return {
        ...prev,
        steps: updatedSteps,
        currentStepIndex: Math.min(stepNumber, prev.steps.length - 1),
        status: allDone ? 'COMPLETED' : 'IN_PROGRESS'
      };
    });

    await refreshStudentData();
  };

  // 8. Modals & Notifications
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const openStudentDrawer = (student: TeacherStudentView) => {
    setSelectedStudent(student);
    setIsStudentDrawerOpen(true);
  };

  const closeStudentDrawer = () => {
    setIsStudentDrawerOpen(false);
  };

  const updateConceptScore = (conceptId: string, score: number) => {
    setConcepts((prev) =>
      prev.map((c) => {
        if (c.id === conceptId) {
          const status = score >= 80 ? 'mastered' : score >= 50 ? 'needs_practice' : 'critical_gap';
          return {
            ...c,
            masteryPercentage: score,
            status,
            trend: score - c.masteryPercentage
          };
        }
        return c;
      })
    );
  };

  const triggerReassessmentCompletion = () => {
    setIsReassessmentCompleted(true);
    setReassessmentAfter(76);
    updateConceptScore('differentiation', 76);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#38BDF8', '#10B981', '#60A5FA']
      });
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        isBackendUnavailable,
        retryBackendHealth: verifySession,
        isAuthLoading,
        isLoggedIn,
        currentUser,
        userRole,
        setUserRole,
        teacherStatus,
        checkTeacherVerification,
        login,
        register,
        logout,
        currentTab,
        setCurrentTab,
        subjects,
        selectedSubject,
        setSelectedSubject,
        studentProfile,
        concepts,
        gapDiagnosis,
        recoveryPlan,
        refreshStudentData,
        activeAssessmentId,
        quizQuestions,
        activeQuizIndex,
        setActiveQuizIndex,
        startQuiz,
        submitQuiz,
        lastAssessmentResult,
        generateRecovery,
        completeRecoveryStep,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        notifications,
        unreadNotifsCount: notifications.filter((n) => !n.read).length,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationAsRead,
        selectedStudent,
        isStudentDrawerOpen,
        openStudentDrawer,
        closeStudentDrawer,
        activePrereqConcept,
        setActivePrereqConcept,
        reassessmentBefore,
        reassessmentAfter,
        isReassessmentCompleted,
        triggerReassessmentCompletion,
        updateConceptScore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
