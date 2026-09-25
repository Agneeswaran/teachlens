import type {
  ConceptMastery,
  GapDiagnosis,
  RecoveryPlan,
  QuizQuestion,
  StudentProfile,
  TeacherStudentView,
  EarlyWarningSignal,
  NotificationItem
} from '../types';

export const initialConcepts: ConceptMastery[] = [
  {
    id: 'algebra',
    name: 'Algebra',
    category: 'Foundations',
    masteryPercentage: 94,
    status: 'mastered',
    lastAssessed: '3 days ago',
    trend: 4,
    prerequisites: [],
    subconcepts: ['Linear Equations', 'Polynomials', 'Factoring', 'Exponents'],
    description: 'Foundational algebraic manipulation, exponent laws, and polynomial factorization.'
  },
  {
    id: 'functions',
    name: 'Functions & Graphs',
    category: 'Foundations',
    masteryPercentage: 88,
    status: 'mastered',
    lastAssessed: '5 days ago',
    trend: 6,
    prerequisites: ['algebra'],
    subconcepts: ['Domain & Range', 'Composition', 'Transformations', 'Rational Functions'],
    description: 'Understanding functional mappings, inverse functions, and graphical representations.'
  },
  {
    id: 'limits',
    name: 'Limits & Continuity',
    category: 'Calculus',
    masteryPercentage: 64,
    status: 'needs_practice',
    lastAssessed: '2 days ago',
    trend: -3,
    prerequisites: ['functions', 'algebra'],
    subconcepts: ['One-sided Limits', 'L’Hopital’s Rule', 'Infinite Limits', 'Epsilon-Delta'],
    description: 'Behavior of functions near boundary values and continuous function definitions.'
  },
  {
    id: 'differentiation',
    name: 'Differentiation',
    category: 'Calculus',
    masteryPercentage: 32,
    status: 'critical_gap',
    lastAssessed: 'Today',
    trend: -14,
    prerequisites: ['limits', 'functions', 'algebra'],
    subconcepts: ['Power Rule', 'Product & Quotient Rules', 'Chain Rule', 'Implicit Differentiation'],
    description: 'Instantaneous rates of change, derivative shortcuts, and physical tangents.'
  },
  {
    id: 'matrices',
    name: 'Matrices & Linear Systems',
    category: 'Linear Algebra',
    masteryPercentage: 71,
    status: 'needs_practice',
    lastAssessed: '1 week ago',
    trend: 2,
    prerequisites: ['algebra'],
    subconcepts: ['Matrix Multiplication', 'Determinants', 'Inverse Matrices', 'Row Reduction'],
    description: 'Vector spaces, matrix transforms, and solving systems of simultaneous linear equations.'
  },
  {
    id: 'probability',
    name: 'Probability & Statistics',
    category: 'Applied Math',
    masteryPercentage: 85,
    status: 'mastered',
    lastAssessed: '4 days ago',
    trend: 8,
    prerequisites: ['algebra'],
    subconcepts: ['Bayes Theorem', 'Discrete Distributions', 'Normal Distribution', 'Hypothesis Testing'],
    description: 'Stochastic analysis, conditional likelihoods, and continuous variable modeling.'
  },
  {
    id: 'integration',
    name: 'Integration',
    category: 'Calculus',
    masteryPercentage: 18,
    status: 'critical_gap',
    lastAssessed: 'Locked (Requires Differentiation)',
    trend: 0,
    prerequisites: ['differentiation'],
    subconcepts: ['Riemann Sums', 'Definite Integrals', 'Substitution Method', 'Integration by Parts'],
    description: 'Accumulation functions, anti-derivatives, and area under complex curves.'
  }
];

export const mockGapDiagnosis: GapDiagnosis = {
  conceptId: 'differentiation',
  conceptName: 'Differentiation',
  masteryScore: 32,
  status: 'critical_gap',
  struggles: [
    'Power rule application on negative and fractional powers',
    'Exponent reduction step (forgetting n - 1)',
    'Coefficient multiplication when combining with constant multipliers'
  ],
  whyHappening: 'Your recent answers demonstrate a systematic pattern of applying exponentiation instead of multiplying by the power, as well as leaving the exponent un-decremented.',
  evidence: [
    {
      id: 'ev-1',
      type: 'incorrect_answer',
      title: '4 Incorrect Answers in Recent Diagnostic',
      detail: 'Questions #3, #6, #8, and #11 failed on polynomial derivatives.',
      timestamp: 'Today at 09:14 AM',
      questionRef: 'd/dx (3x⁴)'
    },
    {
      id: 'ev-2',
      type: 'repeated_pattern',
      title: '3 Related to the Same Subconcept (Power Rule)',
      detail: 'Specifically when differentiating expressions of the form c · xⁿ where n > 1.',
      timestamp: 'Today at 09:16 AM',
      questionRef: 'd/dx (5x³ - 2x²)'
    },
    {
      id: 'ev-3',
      type: 'repeated_pattern',
      title: '2 Repeated Mistake Patterns: Exponent Invariance',
      detail: 'Student multiplied coefficient by original exponent but failed to decrement power: d/dx(x³) answered as 3x³ instead of 3x².',
      timestamp: 'Today at 09:18 AM',
      questionRef: 'd/dx (x³ + 4x)'
    },
    {
      id: 'ev-4',
      type: 'confidence_mismatch',
      title: 'High Confidence Mismatch',
      detail: 'Student reported "Very Confident" on 3 of the 4 failed questions, indicating an entrenched conceptual misconception rather than a careless slip.',
      timestamp: 'Today at 09:19 AM',
      questionRef: 'Confidence metric: 90%'
    }
  ],
  possibleRootCauses: [
    'Power rule formulation confusion: conflating d/dx(xⁿ) = n·xⁿ⁻¹ with exponential functions aˣ',
    'Cognitive overload when handling multiple terms concurrently in polynomial polynomials',
    'Weakness in algebra prerequisite: manipulation of negative & fractional exponents'
  ],
  prerequisiteGaps: [
    {
      conceptId: 'algebra',
      conceptName: 'Algebra: Exponent Laws',
      impactLevel: 'high',
      note: 'Negative exponent inversion (x⁻² = 1/x²) caused 2 cascading derivative calculation failures.'
    },
    {
      conceptId: 'limits',
      conceptName: 'Limits & Difference Quotients',
      impactLevel: 'medium',
      note: 'Lack of visual understanding of secant-to-tangent transition impairs intuitive grasp of slope.'
    }
  ],
  mistakeFingerprint: [
    {
      id: 'mf-1',
      category: 'Concept Misunderstanding',
      percentage: 80,
      count: 8,
      description: 'Misapplying fundamental derivative rules rather than simple arithmetic.',
      examples: ['Confusing power rule with exponential derivative', 'Differentiating constants as variables']
    },
    {
      id: 'mf-2',
      category: 'Formula Confusion',
      percentage: 45,
      count: 4,
      description: 'Mixing product rule structure with simple polynomial derivative rules.',
      examples: ['Applying product rule unnecessarily to constant multiples']
    },
    {
      id: 'mf-3',
      category: 'Sign Errors',
      percentage: 30,
      count: 3,
      description: 'Flipping minus signs when bringing negative exponents to the numerator.',
      examples: ['d/dx(1/x) answered as +x⁻² instead of -x⁻²']
    },
    {
      id: 'mf-4',
      category: 'Calculation Errors',
      percentage: 20,
      count: 2,
      description: 'Minor arithmetic computation missteps in the final coefficient.',
      examples: ['Multiplying 3 · 4 as 14']
    }
  ],
  mostRepeatedPattern: 'Formula application (Omission of exponent reduction n - 1)'
};

export const mockRecoveryPlan: RecoveryPlan = {
  id: 'rec-diff-01',
  conceptId: 'differentiation',
  conceptName: 'Differentiation: Power Rule Mastery',
  title: 'Targeted Recovery: The Power Rule & Exponent Dynamics',
  estimatedMinutes: 15,
  currentStepIndex: 0,
  createdAt: 'Today, 09:25 AM',
  status: 'IN_PROGRESS',
  steps: [
    {
      stepNumber: 1,
      title: 'Review the Power Rule Formulation',
      type: 'review',
      durationMinutes: 3,
      completed: true,
      content: {
        summary: 'Deconstruct the exact 2-step mechanical rule for differentiating power terms: multiply by current power, then subtract 1 from power.',
        keyRule: 'd/dx [ c · xⁿ ] = c · n · xⁿ⁻¹',
        formula: 'Step 1: Bring n forward ➔ (c · n). Step 2: Decrease power ➔ x^(n-1). Example: d/dx(4x³) = (4·3)x^(3-1) = 12x².'
      }
    },
    {
      stepNumber: 2,
      title: 'Interactive Conceptual Breakdown: Why Power Decreases',
      type: 'video',
      durationMinutes: 3,
      completed: true,
      content: {
        summary: 'Understand the geometric meaning of why the power reduces by 1 through secant lines and rates of growth.',
        walkthroughSteps: [
          { step: 'Geometric View', explanation: 'A parabolic area x² expands along two perimeter edges, giving growth rate 2x.' },
          { step: 'Algebraic Anchor', explanation: 'The difference quotient ((x+h)ⁿ - xⁿ)/h collapses via binomial expansion leaving n·xⁿ⁻¹.' }
        ]
      }
    },
    {
      stepNumber: 3,
      title: 'Solve Guided Step-by-Step Examples',
      type: 'guided_example',
      durationMinutes: 4,
      completed: false,
      content: {
        summary: 'Walk through 2 guided problems with instant hint scaffolding before unassisted practice.',
        walkthroughSteps: [
          {
            step: 'Example A: d/dx [ 5x⁴ - 3x² + 7 ]',
            explanation: 'Differentiate term by term: (5·4)x³ - (3·2)x¹ + 0 = 20x³ - 6x.'
          },
          {
            step: 'Example B: d/dx [ 2 / x³ ]',
            explanation: 'Rewrite as 2x⁻³. Apply power rule: 2(-3)x⁻⁴ = -6x⁻⁴ = -6 / x⁴.'
          }
        ]
      }
    },
    {
      stepNumber: 4,
      title: 'Practice 5 Targeted Micro-Questions',
      type: 'targeted_practice',
      durationMinutes: 3,
      completed: false,
      content: {
        summary: 'Solve 5 targeted single-concept problems designed to reinforce the exponent decrement step.',
        practiceCount: 5
      }
    },
    {
      stepNumber: 5,
      title: 'Take Reassessment Diagnostic',
      type: 'reassessment',
      durationMinutes: 2,
      completed: false,
      content: {
        summary: 'Verify mastery retention. Completing this unlocks a direct mastery level boost from 32% to 76%+.'
      }
    }
  ]
};

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q-1',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    difficulty: 'Easy',
    questionNumber: 1,
    totalQuestions: 5,
    prompt: 'What is the first derivative of f(x) = 5x³ with respect to x?',
    expression: 'f(x) = 5x^3',
    options: [
      { id: 'opt-1', text: '15x²', isCorrect: true, explanation: 'Correct! Multiply 5 by 3 to get 15, then reduce the power 3 to 2.' },
      { id: 'opt-2', text: '15x³', isCorrect: false, mistakeType: 'Exponent Invariance', explanation: 'You multiplied the coefficient by 3, but forgot to subtract 1 from the exponent.' },
      { id: 'opt-3', text: '5x²', isCorrect: false, mistakeType: 'Coefficient Drop', explanation: 'You reduced the power, but forgot to multiply by the original exponent 3.' },
      { id: 'opt-4', text: '8x²', isCorrect: false, mistakeType: 'Addition Error', explanation: 'You added 5 + 3 instead of multiplying 5 · 3.' }
    ],
    correctAnswerId: 'opt-1',
    aiExplanation: {
      commonMisstep: 'Leaving the exponent unchanged after multiplying the coefficient.',
      whyWrong: 'Remember that the derivative of xⁿ is n·xⁿ⁻¹. The power must decrease by 1.',
      guidedExample: {
        problem: 'Find d/dx(5x³)',
        step1: 'Multiply current coefficient by power: 5 × 3 = 15',
        step2: 'Reduce exponent by 1: 3 - 1 = 2',
        result: 'Result: 15x²'
      }
    }
  },
  {
    id: 'q-2',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    difficulty: 'Medium',
    questionNumber: 2,
    totalQuestions: 5,
    prompt: 'Find the derivative of the polynomial function: g(x) = 4x² - 7x + 12',
    expression: 'g(x) = 4x^2 - 7x + 12',
    options: [
      { id: 'opt-1', text: '8x - 7', isCorrect: true, explanation: 'Spot on! d/dx(4x²) = 8x, d/dx(-7x) = -7, and d/dx(12) = 0.' },
      { id: 'opt-2', text: '8x - 7x + 12', isCorrect: false, mistakeType: 'Linear Term Failure', explanation: 'Remember that d/dx(cx) = c, and constants become 0.' },
      { id: 'opt-3', text: '4x - 7', isCorrect: false, mistakeType: 'Multiplier Omission', explanation: '4 was not multiplied by the exponent 2.' },
      { id: 'opt-4', text: '8x²', isCorrect: false, mistakeType: 'Exponent Invariance', explanation: 'The exponent on the first term remained 2 instead of 1.' }
    ],
    correctAnswerId: 'opt-1',
    aiExplanation: {
      commonMisstep: 'Retaining the x term on linear components or failing to zero out constants.',
      whyWrong: 'The derivative of a constant term like 12 is always 0 because horizontal lines have zero slope.',
      guidedExample: {
        problem: 'Differentiate 4x² - 7x + 12',
        step1: 'Term 1: 4 · 2 · x¹ = 8x',
        step2: 'Term 2: -7 · 1 · x⁰ = -7, Term 3: d/dx(12) = 0',
        result: 'Result: 8x - 7'
      }
    }
  },
  {
    id: 'q-3',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    difficulty: 'Medium',
    questionNumber: 3,
    totalQuestions: 5,
    prompt: 'Evaluate d/dx [ 2x⁻³ ] using the general power rule.',
    expression: 'd/dx [ 2x^{-3} ]',
    options: [
      { id: 'opt-1', text: '-6x⁻⁴', isCorrect: true, explanation: 'Masterfully done! 2 · (-3) = -6, and -3 - 1 = -4.' },
      { id: 'opt-2', text: '-6x⁻²', isCorrect: false, mistakeType: 'Sign Inversion in Decrement', explanation: 'Notice: -3 - 1 is -4, not -2. Subtracting 1 makes negative numbers more negative.' },
      { id: 'opt-3', text: '6x⁻⁴', isCorrect: false, mistakeType: 'Sign Error', explanation: 'The negative sign from the power was dropped during multiplication.' },
      { id: 'opt-4', text: '-6x³', isCorrect: false, mistakeType: 'Sign Flip', explanation: 'Negative exponent was incorrectly transformed into positive exponent.' }
    ],
    correctAnswerId: 'opt-1',
    aiExplanation: {
      commonMisstep: 'Calculating -3 - 1 as -2 instead of -4.',
      whyWrong: 'When working on the negative number line, decrementing moves further left: -3 - 1 = -4.',
      guidedExample: {
        problem: 'Differentiate 2x⁻³',
        step1: 'Multiply coefficient: 2 × (-3) = -6',
        step2: 'Decrement exponent: (-3) - 1 = -4',
        result: 'Result: -6x⁻⁴ (or -6/x⁴)'
      }
    }
  },
  {
    id: 'q-4',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    difficulty: 'Hard',
    questionNumber: 4,
    totalQuestions: 5,
    prompt: 'Differentiate the rational expression: y = 3 / x²',
    expression: 'y = \\frac{3}{x^2}',
    options: [
      { id: 'opt-1', text: '-6 / x³', isCorrect: true, explanation: 'Excellent! Rewrite as 3x⁻², differentiate to get -6x⁻³, then rewrite as -6/x³.' },
      { id: 'opt-2', text: '3 / (2x)', isCorrect: false, mistakeType: 'Denominator Derivative Fallacy', explanation: 'Differentiating just the denominator directly inside a fraction violates derivative rules.' },
      { id: 'opt-3', text: '6 / x³', isCorrect: false, mistakeType: 'Sign Error', explanation: 'Bringing the negative power down produces a negative sign.' },
      { id: 'opt-4', text: '-6 / x', isCorrect: false, mistakeType: 'Exponent Calculation Error', explanation: 'Power decreased from -2 to -3, not -1.' }
    ],
    correctAnswerId: 'opt-1',
    aiExplanation: {
      commonMisstep: 'Trying to differentiate the denominator in place rather than converting to a negative exponent.',
      whyWrong: 'You cannot simply take d/dx(x²) in the denominator. You must first convert to 3x⁻² or use quotient rule.',
      guidedExample: {
        problem: 'Find dy/dx for y = 3/x²',
        step1: 'Rewrite algebraically: y = 3x⁻²',
        step2: 'Apply power rule: 3(-2)x⁻³ = -6x⁻³ = -6/x³',
        result: 'Result: -6/x³'
      }
    }
  },
  {
    id: 'q-5',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    difficulty: 'Hard',
    questionNumber: 5,
    totalQuestions: 5,
    prompt: 'Find the slope of the tangent line to f(x) = x³ - 2x at the point x = 2.',
    expression: 'f(x) = x^3 - 2x, \\quad x = 2',
    options: [
      { id: 'opt-1', text: '10', isCorrect: true, explanation: 'Brilliant! f’(x) = 3x² - 2. At x = 2, f’(2) = 3(4) - 2 = 10.' },
      { id: 'opt-2', text: '4', isCorrect: false, mistakeType: 'Calculation Fallacy', explanation: 'f(2) = 8 - 4 = 4 is the y-coordinate, not the slope f’(2).' },
      { id: 'opt-3', text: '12', isCorrect: false, mistakeType: 'Omission of Linear Term', explanation: 'Differentiated x³ to 12 at x=2, but neglected the -2 derivative from -2x.' },
      { id: 'opt-4', text: '8', isCorrect: false, mistakeType: 'Arithmetic Error', explanation: 'Calculated 3(2) + 2 instead of 3(2)² - 2.' }
    ],
    correctAnswerId: 'opt-1',
    aiExplanation: {
      commonMisstep: 'Confusing the function value f(a) with the slope value f’(a).',
      whyWrong: 'The tangent slope is given by the derivative evaluated at that point, f’(2), not the original curve height f(2).',
      guidedExample: {
        problem: 'Slope of f(x) = x³ - 2x at x = 2',
        step1: 'Find derivative function: f’(x) = 3x² - 2',
        step2: 'Substitute x = 2: 3(2²) - 2 = 3(4) - 2 = 10',
        result: 'Tangent slope m = 10'
      }
    }
  }
];

export const mockStudentProfile: StudentProfile = {
  id: 'std-1042',
  name: 'Alex Rivera',
  email: 'alex.rivera@stanford.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  grade: 'Calculus I & Linear Foundations',
  overallMastery: 78,
  conceptsMasteredCount: 24,
  needsPracticeCount: 7,
  streakDays: 12,
  joinedDate: 'August 2025',
  recentActivity: [
    {
      id: 'act-1',
      date: 'Today, 09:30 AM',
      concept: 'Differentiation',
      changeText: 'Identified critical learning gap in Power Rule application',
      delta: -14,
      type: 'diagnostic'
    },
    {
      id: 'act-2',
      date: 'Yesterday, 04:15 PM',
      concept: 'Limits & Continuity',
      changeText: 'Completed recovery plan: One-sided limits & jump discontinuities',
      delta: 18,
      type: 'recovery'
    },
    {
      id: 'act-3',
      date: '3 days ago',
      concept: 'Functions & Graphs',
      changeText: 'Reassessed mastery: Inverse functions and domain mappings',
      delta: 12,
      type: 'reassessment'
    },
    {
      id: 'act-4',
      date: '5 days ago',
      concept: 'Algebra Foundations',
      changeText: '10-day consistent practice milestone unlocked',
      delta: 5,
      type: 'streak'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Gap Conqueror',
      description: 'Successfully closed 5 flagged prerequisite gaps through targeted recovery.',
      icon: 'ShieldCheck',
      unlockedAt: 'Sep 20, 2025'
    },
    {
      id: 'ach-2',
      title: 'Analytical Precision',
      description: 'Maintained 95%+ confidence calibration accuracy for 3 consecutive days.',
      icon: 'Target',
      unlockedAt: 'Sep 22, 2025'
    },
    {
      id: 'ach-3',
      title: 'Deep Focus Streak',
      description: 'Maintained a 12-day active practice streak on TeachLens.',
      icon: 'Flame',
      unlockedAt: 'Today'
    }
  ]
};

export const mockTeacherStudents: TeacherStudentView[] = [
  {
    id: 's-1',
    name: 'Marcus Vance',
    email: 'm.vance@academy.edu',
    overallMastery: 48,
    status: 'needs_attention',
    weakestConcept: 'Differentiation',
    weakestConceptScore: 32,
    trend: 'down',
    lastActive: '12 mins ago',
    conceptScores: { algebra: 82, functions: 74, limits: 55, differentiation: 32, matrices: 60, probability: 70 }
  },
  {
    id: 's-2',
    name: 'Sophia Chen',
    email: 's.chen@academy.edu',
    overallMastery: 91,
    status: 'improving',
    weakestConcept: 'Matrices',
    weakestConceptScore: 78,
    trend: 'up',
    lastActive: '2 hours ago',
    conceptScores: { algebra: 98, functions: 96, limits: 90, differentiation: 88, matrices: 78, probability: 94 }
  },
  {
    id: 's-3',
    name: 'Liam Gallagher',
    email: 'l.gallagher@academy.edu',
    overallMastery: 62,
    status: 'needs_attention',
    weakestConcept: 'Limits & Continuity',
    weakestConceptScore: 41,
    trend: 'down',
    lastActive: '1 day ago',
    conceptScores: { algebra: 78, functions: 68, limits: 41, differentiation: 52, matrices: 64, probability: 72 }
  },
  {
    id: 's-4',
    name: 'Emma Watson',
    email: 'e.watson@academy.edu',
    overallMastery: 84,
    status: 'improving',
    weakestConcept: 'Differentiation',
    weakestConceptScore: 68,
    trend: 'up',
    lastActive: '3 hours ago',
    conceptScores: { algebra: 92, functions: 90, limits: 82, differentiation: 68, matrices: 85, probability: 89 }
  },
  {
    id: 's-5',
    name: 'Devin Patel',
    email: 'd.patel@academy.edu',
    overallMastery: 76,
    status: 'steady',
    weakestConcept: 'Matrices',
    weakestConceptScore: 59,
    trend: 'neutral',
    lastActive: '5 hours ago',
    conceptScores: { algebra: 88, functions: 80, limits: 72, differentiation: 74, matrices: 59, probability: 82 }
  },
  {
    id: 's-6',
    name: 'Zoe Kravitz',
    email: 'z.kravitz@academy.edu',
    overallMastery: 58,
    status: 'needs_attention',
    weakestConcept: 'Differentiation',
    weakestConceptScore: 38,
    trend: 'down',
    lastActive: 'Yesterday',
    conceptScores: { algebra: 74, functions: 66, limits: 58, differentiation: 38, matrices: 54, probability: 60 }
  }
];

export const mockEarlyWarnings: EarlyWarningSignal[] = [
  {
    id: 'ew-1',
    studentId: 's-1',
    studentName: 'Marcus Vance',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    historicalTrend: [68, 51, 39],
    severity: 'critical',
    detectedAt: 'Today, 08:45 AM',
    evidence: 'Differentiation mastery steadily dropped across last 3 diagnostics (68% → 51% → 39%). 7 out of 9 errors involve negative exponent handling in derivative fractions.',
    recommendation: 'Targeted intervention on prerequisite Algebra: Exponent Laws (x⁻ⁿ transformations) before re-administering quotient rule exercises.'
  },
  {
    id: 'ew-2',
    studentId: 's-3',
    studentName: 'Liam Gallagher',
    conceptId: 'limits',
    conceptName: 'Limits & Continuity',
    historicalTrend: [72, 58, 41],
    severity: 'critical',
    detectedAt: 'Yesterday, 03:20 PM',
    evidence: 'Failed 4 consecutive one-sided limit evaluation items with high reported confidence. Systematic confusion between f(c) value and lim x→c f(x).',
    recommendation: 'Assign visual interactive discontinuity recovery module: Piecewise Graph Interpretation.'
  },
  {
    id: 'ew-3',
    studentId: 's-6',
    studentName: 'Zoe Kravitz',
    conceptId: 'differentiation',
    conceptName: 'Differentiation',
    historicalTrend: [64, 52, 38],
    severity: 'moderate',
    detectedAt: '2 days ago',
    evidence: 'Drop in speed and accuracy during chain rule composition questions. Evidence points to difficulty decomposing f(g(x)) outer/inner layers.',
    recommendation: 'Assign 10-minute guided function composition walkthrough before next graded midterm.'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Recovery Plan Ready',
    message: 'Your personalized 15-minute Differentiation Power Rule recovery path is ready to start.',
    timestamp: '10m ago',
    type: 'recovery',
    read: false,
    actionUrl: 'recovery'
  },
  {
    id: 'notif-2',
    title: 'Mastery Increased by 18%',
    message: 'Congratulations! Your Limits & Continuity score improved from 46% to 64% after completing your recovery path.',
    timestamp: 'Yesterday',
    type: 'mastery',
    read: false,
    actionUrl: 'mastery'
  },
  {
    id: 'notif-3',
    title: 'New Adaptive Assessment Available',
    message: 'AI diagnostic refreshed for Matrices & Linear Systems based on recent class coverage.',
    timestamp: '2 days ago',
    type: 'assessment',
    read: true,
    actionUrl: 'quiz'
  },
  {
    id: 'notif-4',
    title: 'Time to Reassess Limits',
    message: 'Spaced repetition schedule recommends a 3-question quick check to lock in your long-term retention.',
    timestamp: '3 days ago',
    type: 'system',
    read: true,
    actionUrl: 'quiz'
  }
];
