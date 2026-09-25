import {
  initialConcepts,
  mockGapDiagnosis,
  mockRecoveryPlan,
  mockQuizQuestions,
  mockStudentProfile,
  mockTeacherStudents,
  mockEarlyWarnings,
  mockNotifications
} from '../data/mockData';

const DB_KEY = 'teachlens_local_db';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  teacher_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  institution?: string;
  department?: string;
}

interface LocalDB {
  users: LocalUser[];
  assessments: Record<string, any>;
  mastery: Record<string, any>;
  recoveryPlans: Record<string, any>;
  squads: any[];
  notifications: any[];
}

const subjects = [
  {
    id: 'math',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Algebra, calculus, functions, limits and more.',
    icon: 'Calculator',
    color: '#6366f1'
  },
  {
    id: 'physics',
    name: 'Physics',
    slug: 'physics',
    description: 'Mechanics, motion, forces and physical principles.',
    icon: 'Atom',
    color: '#0ea5e9'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    slug: 'chemistry',
    description: 'Atoms, reactions, bonding and chemical concepts.',
    icon: 'FlaskConical',
    color: '#8b5cf6'
  },
  {
    id: 'biology',
    name: 'Biology',
    slug: 'biology',
    description: 'Cells, genetics, organisms and life sciences.',
    icon: 'Dna',
    color: '#10b981'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Programming, algorithms and computer concepts.',
    icon: 'Code',
    color: '#f59e0b'
  },
  {
    id: 'english',
    name: 'English',
    slug: 'english',
    description: 'Grammar, vocabulary, reading and communication.',
    icon: 'BookOpen',
    color: '#ec4899'
  }
];

function defaultDB(): LocalDB {
  return {
    users: [
      {
        id: 'local-student-1',
        name: mockStudentProfile.name,
        email: mockStudentProfile.email,
        password: 'student123',
        role: 'student'
      }
    ],
    assessments: {},
    mastery: {},
    recoveryPlans: {},
    squads: [],
    notifications: [...mockNotifications]
  };
}

export function getDB(): LocalDB {
  const raw = localStorage.getItem(DB_KEY);

  if (!raw) {
    const db = defaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const db = defaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
}

export function saveDB(db: LocalDB): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getSubjects() {
  return subjects;
}

export function getConcepts() {
  return initialConcepts;
}

export function getQuestions() {
  return mockQuizQuestions;
}

export function getStudentProfile() {
  return mockStudentProfile;
}

export function getGapDiagnosis() {
  return mockGapDiagnosis;
}

export function getRecoveryPlan() {
  return mockRecoveryPlan;
}

export function getTeacherStudents() {
  return mockTeacherStudents;
}

export function getEarlyWarnings() {
  return mockEarlyWarnings;
}