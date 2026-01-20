/**
 * Student AI Specification
 *
 * Role: Learning companion, peer-level interaction, self-directed learning
 * Constellation: Cygnus (The Swan) - transformation, potential, journey
 * Home Base: Deneb/Cygnus region
 */

import { PersonaSpec, CELESTIAL_ANCHORS, AstronomicalCoordinate } from './persona-spec';
import { SubjectDomain } from './teacher';

export const STUDENT_SPEC: PersonaSpec = {
  // Identity
  name: 'Student',
  celestialHomeBase: CELESTIAL_ANCHORS.DENEB,
  constellation: 'Cygnus',

  // HarveyOS Configuration
  npuConfig: {
    phases: [0, 1, 2, 3, 4, 5, 6, 7, 8], // Limited pipeline - no advanced phases
    domainPreferences: [], // Determined by current learning context
    p12Role: 'learner', // Active learner, receives P-12 content
  },

  // Gatekeeper Integration
  gatekeeperRole: 'student',
  capabilities: [
    'canLearn',       // Unique capability
    'canAsk',         // Can ask questions of Teachers/Counsellor
    'canCollaborate', // Can work with other Student AIs
    'canExplore',     // Can explore Living Library within grade level
  ],

  // Behavioral Constraints
  memoryBudget: 512, // Smallest budget - 512MB
  modelSubset: [
    'grammar_foundation',
    'math_basic',
    'reasoning_logic',
  ], // Grade-appropriate subset
  responseStyle: {
    tone: 'curious and exploratory',
    formality: 0.3,
    verbosity: 0.5,
    empathy: 0.7,
  },

  // Educational Context
  ageRange: [5, 18], // Configured per student instance

  // Personality Profile (highly variable per student instance)
  personalityTraits: {
    // Big Five
    openness: 0.7,
    conscientiousness: 0.6,
    extraversion: 0.5,
    agreeableness: 0.7,
    neuroticism: 0.4,
    // Learning traits
    curiosity: 0.9,
    persistence: 0.7,
    growth_mindset: 0.8,
  },
};

/**
 * Learning progress tracking
 */
export interface LearningProgress {
  studentId: string;
  gradeLevel: number;
  currentCoordinate: AstronomicalCoordinate;
  masteredConcepts: MasteredConcept[];
  inProgress: ConceptProgress[];
  recommendedNext: string[];               // Curriculum node IDs
  totalLearningTime: number;               // minutes
  lastActive: Date;
}

/**
 * Mastered concept
 */
export interface MasteredConcept {
  conceptId: string;
  conceptName: string;
  domain: SubjectDomain;
  coordinate: AstronomicalCoordinate;
  masteredAt: Date;
  confidence: number;                      // 0-1
  retentionScore: number;                  // 0-1 (decreases over time without practice)
}

/**
 * Concept in progress
 */
export interface ConceptProgress {
  conceptId: string;
  conceptName: string;
  domain: SubjectDomain;
  coordinate: AstronomicalCoordinate;
  startedAt: Date;
  progress: number;                        // 0-1
  attempts: number;
  lastPractice: Date;
  strugglingAreas: string[];
}

/**
 * Student question to Teacher or Counsellor
 */
export interface Question {
  id: string;
  studentId: string;
  recipient: 'teacher' | 'counsellor';
  subject?: SubjectDomain;
  question: string;
  context?: string;                        // Related lesson or concept
  askedAt: Date;
  answered: boolean;
  answer?: string;
  answeredAt?: Date;
  followUpQuestions: string[];
}

/**
 * Achievement earned by student
 */
export interface Achievement {
  id: string;
  type: 'mastery' | 'persistence' | 'exploration' | 'collaboration' | 'milestone';
  title: string;
  description: string;
  earnedAt: Date;
  relatedConcepts?: string[];
  icon: string;                            // SF Symbol name
}

/**
 * Collaboration session with other students
 */
export interface CollaborationSession {
  id: string;
  participants: string[];                   // Student IDs
  topic: string;
  domain: SubjectDomain;
  startedAt: Date;
  endedAt?: Date;
  contributions: Contribution[];
  outcome?: string;
}

/**
 * Contribution to collaboration
 */
export interface Contribution {
  studentId: string;
  timestamp: Date;
  type: 'question' | 'answer' | 'explanation' | 'example' | 'encouragement';
  content: string;
}

/**
 * Learning session
 */
export interface LearningSession {
  id: string;
  studentId: string;
  lessonId: string;
  startedAt: Date;
  endedAt?: Date;
  timeSpent: number;                        // minutes
  completed: boolean;
  comprehensionScore?: number;              // 0-1 from assessment
  notes: string[];
  questionsAsked: number;
}

/**
 * Calculate retention score based on time since last practice
 */
export function calculateRetention(
  lastPractice: Date,
  initialConfidence: number
): number {
  const daysSinceP

ractice = (Date.now() - lastPractice.getTime()) / (1000 * 60 * 60 * 24);

  // Ebbinghaus forgetting curve approximation
  // Retention decays exponentially with time
  const decayRate = 0.1; // Adjust based on concept difficulty
  const retention = initialConfidence * Math.exp(-decayRate * daysSincePractice);

  return Math.max(0, Math.min(1, retention));
}

/**
 * Recommend next concepts based on current progress
 */
export function recommendNextConcepts(
  progress: LearningProgress,
  allConcepts: { id: string; prerequisites: string[]; coordinate: AstronomicalCoordinate }[]
): string[] {
  const masteredIds = new Set(progress.masteredConcepts.map(c => c.conceptId));
  const inProgressIds = new Set(progress.inProgress.map(c => c.conceptId));

  const available = allConcepts.filter(concept => {
    // Already mastered or in progress
    if (masteredIds.has(concept.id) || inProgressIds.has(concept.id)) {
      return false;
    }

    // Check if all prerequisites are mastered
    return concept.prerequisites.every(prereq => masteredIds.has(prereq));
  });

  // Sort by proximity to current position
  available.sort((a, b) => {
    const distA = celestialDistanceSimple(progress.currentCoordinate, a.coordinate);
    const distB = celestialDistanceSimple(progress.currentCoordinate, b.coordinate);
    return distA - distB;
  });

  // Return top 3 recommendations
  return available.slice(0, 3).map(c => c.id);
}

/**
 * Simple celestial distance calculation
 */
function celestialDistanceSimple(
  coord1: AstronomicalCoordinate,
  coord2: AstronomicalCoordinate
): number {
  const raDiff = coord2.ra - coord1.ra;
  const decDiff = coord2.dec - coord1.dec;
  const altDiff = coord2.alt - coord1.alt;

  // Euclidean distance in 3D space (simplified)
  return Math.sqrt(raDiff ** 2 + decDiff ** 2 + (altDiff / 100) ** 2);
}

/**
 * Check if student can access content at given coordinate
 */
export function canAccessContent(
  studentGradeLevel: number,
  contentGradeLevel: number,
  allowAboveGrade: boolean = false
): boolean {
  if (contentGradeLevel <= studentGradeLevel) {
    return true;
  }

  // Can access up to 1 grade level above with permission
  if (allowAboveGrade && contentGradeLevel <= studentGradeLevel + 1) {
    return true;
  }

  return false;
}

/**
 * Award achievement based on progress
 */
export function checkForAchievements(
  progress: LearningProgress,
  recentActivity: LearningSession
): Achievement[] {
  const newAchievements: Achievement[] = [];

  // Mastery achievement - 10 concepts in one domain
  const domainCounts = new Map<SubjectDomain, number>();
  for (const concept of progress.masteredConcepts) {
    const count = domainCounts.get(concept.domain) || 0;
    domainCounts.set(concept.domain, count + 1);
  }

  for (const [domain, count] of domainCounts.entries()) {
    if (count === 10) {
      newAchievements.push({
        id: `mastery_${domain}_10`,
        type: 'mastery',
        title: `${domain} Explorer`,
        description: `Mastered 10 concepts in ${domain}`,
        earnedAt: new Date(),
        icon: 'star.fill',
      });
    }
  }

  // Persistence achievement - completed lesson after multiple attempts
  if (recentActivity.completed && recentActivity.questionsAsked >= 5) {
    newAchievements.push({
      id: `persistence_${recentActivity.id}`,
      type: 'persistence',
      title: 'Never Give Up',
      description: 'Completed a challenging lesson through determination',
      earnedAt: new Date(),
      icon: 'flame.fill',
    });
  }

  return newAchievements;
}
