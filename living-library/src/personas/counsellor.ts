/**
 * Counsellor AI Specification
 *
 * Role: Emotional support, learning strategy, holistic student wellbeing
 * Constellation: Boötes (The Herdsman) - guidance, care, protection
 * Home Base: Arcturus/Boötes region
 */

import { PersonaSpec, CELESTIAL_ANCHORS } from './persona-spec';

export const COUNSELLOR_SPEC: PersonaSpec = {
  // Identity
  name: 'Counsellor',
  celestialHomeBase: CELESTIAL_ANCHORS.ARCTURUS,
  constellation: 'Boötes',

  // HarveyOS Configuration
  npuConfig: {
    phases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11], // Skip domain routing & pattern selection
    domainPreferences: ['emotional', 'social', 'developmental', 'wellbeing'],
    p12Role: 'evaluator', // Evaluates emotional/social readiness, not academic
  },

  // Gatekeeper Integration
  gatekeeperRole: 'counselor',
  capabilities: [
    'canAdvocate',    // Can advocate strongly for student wellbeing
    'canNegotiate',   // Can negotiate with Headmaster/Teachers on behalf of students
    'canObserve',     // Can observe patterns across students
    'canRefer',       // Unique capability - can refer to external resources
  ],

  // Behavioral Constraints
  memoryBudget: 1536, // 1.5GB - needs long-term student history
  modelSubset: [
    'grammar_*',
    'emotional_*',
    'attachment_*',
    'reasoning_*',
  ],
  responseStyle: {
    tone: 'warm and validating',
    formality: 0.4,
    verbosity: 0.6,
    empathy: 0.95, // Highest empathy
  },

  // Educational Context
  ageRange: [5, 18], // K-12

  // Personality Profile
  personalityTraits: {
    // Big Five
    openness: 0.9,
    conscientiousness: 0.85,
    extraversion: 0.6,
    agreeableness: 0.95,  // Highest agreeableness
    neuroticism: 0.15,    // Lowest neuroticism (stable support)
    // Educational traits
    empathy: 0.98,
    listening: 0.95,
    patience: 0.95,
  },
};

/**
 * Wellbeing domains
 */
export const WELLBEING_DOMAINS = [
  'emotional',
  'social',
  'behavioral',
  'developmental',
  'academic_stress',
  'family',
  'peer_relationships',
  'self_esteem',
] as const;

export type WellbeingDomain = typeof WELLBEING_DOMAINS[number];

/**
 * Student wellbeing profile
 */
export interface WellbeingProfile {
  studentId: string;
  lastCheckIn: Date;
  overallWellbeing: number;              // 0-1
  domainScores: Record<WellbeingDomain, number>;
  concerns: Concern[];
  strengths: string[];
  goals: Goal[];
  interventions: Intervention[];
}

/**
 * Wellbeing concern
 */
export interface Concern {
  id: string;
  domain: WellbeingDomain;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  identifiedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * Student goal
 */
export interface Goal {
  id: string;
  description: string;
  type: 'emotional' | 'social' | 'behavioral' | 'academic';
  targetDate: Date;
  progress: number;                      // 0-1
  strategies: string[];
}

/**
 * Intervention record
 */
export interface Intervention {
  id: string;
  type: 'check_in' | 'strategy_session' | 'crisis_support' | 'referral' | 'accommodation';
  studentId: string;
  date: Date;
  description: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

/**
 * Check-in session
 */
export interface CheckIn {
  id: string;
  studentId: string;
  date: Date;
  duration: number;                       // minutes
  mood: number;                           // 0-1 (0 = very low, 1 = excellent)
  energy: number;                         // 0-1
  stress: number;                         // 0-1 (0 = no stress, 1 = extreme)
  notes: string;
  concerns: string[];
  actionItems: string[];
}

/**
 * Pattern detected across student population
 */
export interface Pattern {
  id: string;
  type: 'emotional' | 'behavioral' | 'academic' | 'social';
  description: string;
  frequency: number;                      // How many students affected
  firstDetected: Date;
  lastSeen: Date;
  severity: 'low' | 'moderate' | 'high';
  recommendedAction?: string;
}

/**
 * External referral
 */
export interface Referral {
  id: string;
  studentId: string;
  type: 'mental_health' | 'academic_support' | 'medical' | 'family_services' | 'other';
  reason: string;
  urgency: 'low' | 'moderate' | 'high' | 'urgent';
  referredTo?: string;
  status: 'pending' | 'approved' | 'completed' | 'declined';
  createdAt: Date;
}

/**
 * Calculate overall wellbeing score from domain scores
 */
export function calculateOverallWellbeing(
  domainScores: Record<WellbeingDomain, number>
): number {
  const weights: Record<WellbeingDomain, number> = {
    emotional: 0.20,
    social: 0.15,
    behavioral: 0.10,
    developmental: 0.10,
    academic_stress: 0.15,
    family: 0.10,
    peer_relationships: 0.10,
    self_esteem: 0.10,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [domain, score] of Object.entries(domainScores)) {
    const weight = weights[domain as WellbeingDomain] || 0;
    totalScore += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0.5;
}

/**
 * Identify if student needs immediate attention
 */
export function needsImmediateAttention(profile: WellbeingProfile): boolean {
  // Critical concerns
  const hasCriticalConcern = profile.concerns.some(c =>
    c.severity === 'critical' && !c.resolved
  );

  if (hasCriticalConcern) return true;

  // Very low overall wellbeing
  if (profile.overallWellbeing < 0.3) return true;

  // Multiple high-severity concerns
  const highSeverityConcerns = profile.concerns.filter(c =>
    c.severity === 'high' && !c.resolved
  ).length;

  if (highSeverityConcerns >= 2) return true;

  return false;
}

/**
 * Generate accommodation recommendations for teachers
 */
export function generateAccommodations(profile: WellbeingProfile): string[] {
  const accommodations: string[] = [];

  for (const concern of profile.concerns) {
    if (concern.resolved) continue;

    switch (concern.domain) {
      case 'academic_stress':
        accommodations.push('Extended time on assessments');
        accommodations.push('Break down large assignments into smaller tasks');
        break;
      case 'emotional':
        accommodations.push('Quiet space available if needed');
        accommodations.push('Check-ins before high-stakes activities');
        break;
      case 'social':
        accommodations.push('Structured group work with supportive peers');
        accommodations.push('Alternative participation methods');
        break;
      case 'behavioral':
        accommodations.push('Clear expectations and consistent routines');
        accommodations.push('Positive reinforcement for desired behaviors');
        break;
    }
  }

  return [...new Set(accommodations)]; // Remove duplicates
}
