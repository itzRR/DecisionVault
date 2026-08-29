// ===========================================
// DecisionVault — Shared TypeScript Types
// ===========================================

// --- Decision Status ---
export type DecisionStatus =
  | 'DRAFT'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'DECISION_MADE'
  | 'AWAITING_OUTCOME'
  | 'OUTCOME_RECORDED'
  | 'REPLAY_READY'
  | 'COMPLETED'
  | 'FAILED';

// --- Decision Category ---
export type DecisionCategory =
  | 'Career'
  | 'Education'
  | 'Technology'
  | 'Money'
  | 'Business'
  | 'Travel'
  | 'Personal'
  | 'Other';

// --- Priority ---
export type Priority =
  | 'Cost'
  | 'Time'
  | 'Quality'
  | 'Risk'
  | 'Growth'
  | 'Convenience'
  | 'Long-term value'
  | 'Happiness'
  | 'Other';

// --- Expectation Match ---
export type ExpectationMatch =
  | 'Much better'
  | 'Better'
  | 'About the same'
  | 'Worse'
  | 'Much worse';

// --- AI Analysis Result ---
export interface DecisionAnalysis {
  summary: string;
  recommendation: string;
  confidence: number;
  keyFactors: string[];
  pros: string[];
  cons: string[];
  risks: string[];
  unknowns: string[];
  questionsToConsider: string[];
  bestCase: string;
  worstCase: string;
  reversibility: string;
  recommendedNextStep: string;
}

// --- Outcome ---
export interface DecisionOutcome {
  description: string;
  expectationMatch: ExpectationMatch;
  satisfaction: number; // 1-5
  surprises: string;
  wouldDoDifferently: string;
  notes?: string;
}

// --- Decision Replay ---
export interface DecisionReplay {
  gotRight: string[];
  misjudged: string[];
  whatChanged: string;
  reflection: string;
  decisionQuality: number; // 0-100
  qualityReasons: string[];
}

// --- Decision Option ---
export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
}

// --- Full Decision ---
export interface Decision {
  id: string;
  userId: string;
  title: string;
  category: DecisionCategory;
  question: string;
  options: DecisionOption[];
  priorities: Priority[];
  constraints: string;
  decisionDate: string;
  initialConfidence: number;
  notes: string;
  expectedOutcome: string;

  // AI Analysis
  analysis: DecisionAnalysis | null;

  // Decision Made
  selectedOption: string | null;
  finalConfidence: number | null;
  decisionRationale: string | null;
  decidedAt: string | null;

  // Outcome
  outcome: DecisionOutcome | null;
  outcomeRecordedAt: string | null;

  // Replay
  replay: DecisionReplay | null;
  replayGeneratedAt: string | null;

  // Meta
  status: DecisionStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Create Decision Input ---
export interface CreateDecisionInput {
  title: string;
  category: DecisionCategory;
  question: string;
  options: DecisionOption[];
  priorities: Priority[];
  constraints: string;
  decisionDate: string;
  initialConfidence: number;
  notes: string;
  expectedOutcome: string;
}

// --- Make Decision Input ---
export interface MakeDecisionInput {
  selectedOption: string;
  finalConfidence: number;
  decisionRationale: string;
}

// --- Record Outcome Input ---
export interface RecordOutcomeInput {
  description: string;
  expectationMatch: ExpectationMatch;
  satisfaction: number;
  surprises: string;
  wouldDoDifferently: string;
  notes?: string;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// --- User Preferences ---
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCategory: DecisionCategory;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalDecisions: number;
  pendingDecisions: number;
  completedDecisions: number;
  averageQuality: number | null;
}

// --- Personal Insight ---
export interface PersonalInsight {
  type: 'STRENGTH' | 'WEAKNESS' | 'PATTERN' | 'BIAS';
  title: string;
  description: string;
  actionableAdvice: string;
}

// --- API Response Wrapper ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
