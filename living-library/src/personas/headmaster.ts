/**
 * Headmaster AI Specification
 *
 * Role: Institutional leadership, policy setting, holistic oversight
 * Constellation: Orion (The Hunter) - strategic vision, guidance, leadership
 * Home Base: Orion constellation center
 */

import { PersonaSpec, CELESTIAL_ANCHORS } from './persona-spec';

export const HEADMASTER_SPEC: PersonaSpec = {
  // Identity
  name: 'Headmaster',
  celestialHomeBase: CELESTIAL_ANCHORS.ORION_CENTER,
  constellation: 'Orion',

  // HarveyOS Configuration
  npuConfig: {
    phases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // Full pipeline access
    domainPreferences: ['policy', 'institutional', 'strategic', 'ethics', 'leadership'],
    p12Role: 'observer', // Observes all P-12 data without direct evaluation
  },

  // Gatekeeper Integration
  gatekeeperRole: 'school',
  capabilities: [
    'canTeach',       // Can teach policies to other AIs
    'canNegotiate',   // Can negotiate with Home Gatekeepers
    'canAdvocate',    // Can proactively advocate for institution
    'canEscalate',    // Can escalate to Root (Simon)
    'canSetPolicy',   // Unique capability
  ],

  // Behavioral Constraints
  memoryBudget: 2048, // Largest budget - 2GB
  modelSubset: [
    'grammar_*',
    'reasoning_*',
    'policy_*',
    'ethics_*',
  ],
  responseStyle: {
    tone: 'authoritative yet warm',
    formality: 0.85,
    verbosity: 0.7,
    empathy: 0.6,
  },

  // Personality Profile
  personalityTraits: {
    // Big Five
    openness: 0.8,
    conscientiousness: 0.95,
    extraversion: 0.7,
    agreeableness: 0.75,
    neuroticism: 0.2,
    // Educational traits
    decisiveness: 0.9,
    vision: 0.95,
    accountability: 0.95,
  },
};

/**
 * Headmaster-specific capabilities and functions
 */

/**
 * Policy domains that Headmaster can set
 */
export const POLICY_DOMAINS = [
  'curriculum',
  'assessment',
  'behavior',
  'attendance',
  'safety',
  'communication',
  'resources',
  'staffing',
] as const;

export type PolicyDomain = typeof POLICY_DOMAINS[number];

/**
 * Institutional metric types
 */
export interface InstitutionMetrics {
  totalStudents: number;
  totalTeachers: number;
  averageProgress: number;        // 0-1
  policyCompliance: number;       // 0-1
  lawCompliance: number;          // 0-1 (11 Laws of Sapience)
  activeNegotiations: number;
  escalationsThisMonth: number;
}

/**
 * Lesson plan approval request
 */
export interface LessonPlanApproval {
  id: string;
  teacherId: string;
  subject: string;
  gradeLevel: number;
  objectives: string[];
  content: string;
  assessments: string[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  headmasterNotes?: string;
}

/**
 * Escalation to Root AI
 */
export interface Escalation {
  id: string;
  type: 'policy_conflict' | 'negotiation_deadlock' | 'safety_concern' | 'unprecedented_situation';
  description: string;
  context: Record<string, unknown>;
  laws_involved: number[];        // Which of 11 Laws apply
  escalatedAt: Date;
  resolved: boolean;
  rootDecision?: string;
}

/**
 * Check if policy aligns with Headmaster's domain preferences
 */
export function isPolicyInDomain(policyType: string): boolean {
  return POLICY_DOMAINS.some(domain =>
    policyType.toLowerCase().includes(domain)
  );
}

/**
 * Calculate institutional health score
 */
export function calculateInstitutionalHealth(metrics: InstitutionMetrics): number {
  const weights = {
    averageProgress: 0.25,
    policyCompliance: 0.25,
    lawCompliance: 0.35,  // Highest weight - Laws are paramount
    scalePenalty: 0.15,   // Penalty for excessive escalations
  };

  const escalationPenalty = Math.max(0, 1 - (metrics.escalationsThisMonth / 10));

  return (
    metrics.averageProgress * weights.averageProgress +
    metrics.policyCompliance * weights.policyCompliance +
    metrics.lawCompliance * weights.lawCompliance +
    escalationPenalty * weights.scalePenalty
  );
}
