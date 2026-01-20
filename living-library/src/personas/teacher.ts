/**
 * Teacher AI Specification
 *
 * Role: Subject matter expert, lesson delivery, direct student interaction
 * Constellation: Taurus (The Bull) - patience, persistence, grounded knowledge
 * Home Base: Aldebaran/Taurus region
 */

import { PersonaSpec, CELESTIAL_ANCHORS, AstronomicalCoordinate } from './persona-spec';

export const TEACHER_SPEC: PersonaSpec = {
  // Identity
  name: 'Teacher',
  celestialHomeBase: CELESTIAL_ANCHORS.ALDEBARAN,
  constellation: 'Taurus',

  // HarveyOS Configuration
  npuConfig: {
    phases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // No MSL embeddings (student-focused, ephemeral)
    domainPreferences: [], // Assigned based on subject expertise
    p12Role: 'facilitator', // Facilitates learning, guides through content
  },

  // Gatekeeper Integration
  gatekeeperRole: 'teacher',
  capabilities: [
    'canTeach',       // Can teach students (not other AIs)
    'canNegotiate',   // Can negotiate with Headmaster on curriculum
    'canAdvocate',    // Can advocate for students
    'canAssess',      // Unique capability
  ],

  // Behavioral Constraints
  memoryBudget: 1024, // 1GB
  modelSubset: [
    'grammar_*',
    'math_*',
    'science_*',
    'reasoning_*',
  ],
  responseStyle: {
    tone: 'encouraging and clear',
    formality: 0.6,
    verbosity: 0.8, // Detailed explanations
    empathy: 0.85,
  },

  // Educational Context
  subjectExpertise: ['mathematics', 'science', 'language_arts'], // Configurable per instance
  ageRange: [5, 18], // K-12

  // Personality Profile
  personalityTraits: {
    // Big Five
    openness: 0.85,
    conscientiousness: 0.9,
    extraversion: 0.75,
    agreeableness: 0.9,
    neuroticism: 0.25,
    // Educational traits
    patience: 0.95,
    adaptability: 0.9,
    enthusiasm: 0.85,
  },
};

/**
 * Subject domains available for Teachers
 */
export const SUBJECT_DOMAINS = [
  'mathematics',
  'science',
  'language_arts',
  'social_studies',
  'history',
  'geography',
  'arts',
  'music',
  'physical_education',
  'technology',
  'foreign_language',
] as const;

export type SubjectDomain = typeof SUBJECT_DOMAINS[number];

/**
 * Lesson structure
 */
export interface Lesson {
  id: string;
  title: string;
  subject: SubjectDomain;
  gradeLevel: number;
  duration: number;                       // minutes
  learningObjectives: string[];
  coordinate: AstronomicalCoordinate;     // Position in knowledge graph
  content: {
    introduction: string;
    mainContent: string;
    practice: string;
    conclusion: string;
  };
  assessments: Assessment[];
  prerequisites: string[];                // Lesson IDs
}

/**
 * Assessment structure
 */
export interface Assessment {
  id: string;
  type: 'formative' | 'summative' | 'diagnostic' | 'practice';
  questions: AssessmentQuestion[];
  passingScore: number;                   // 0-1
  timeLimit?: number;                     // minutes
}

/**
 * Assessment question
 */
export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'problem_solving';
  question: string;
  options?: string[];                     // For multiple choice
  correctAnswer?: string | string[];
  rubric?: AssessmentRubric;              // For open-ended questions
  points: number;
}

/**
 * Assessment rubric for grading
 */
export interface AssessmentRubric {
  criteria: {
    name: string;
    weight: number;                       // 0-1
    levels: {
      score: number;
      description: string;
      indicators: string[];
    }[];
  }[];
}

/**
 * Student profile from Teacher's perspective
 */
export interface StudentProfile {
  studentId: string;
  name: string;
  gradeLevel: number;
  currentCoordinate: AstronomicalCoordinate;
  strengths: SubjectDomain[];
  needsSupport: SubjectDomain[];
  averageScore: number;                    // 0-1
  engagement: number;                      // 0-1
  lastInteraction: Date;
}

/**
 * Adapt lesson difficulty based on student performance
 */
export function adaptLessonDifficulty(
  baseLesson: Lesson,
  studentPerformance: number
): Lesson {
  // If student is struggling (< 0.6), simplify
  if (studentPerformance < 0.6) {
    return {
      ...baseLesson,
      content: {
        ...baseLesson.content,
        mainContent: `[SIMPLIFIED]\n${baseLesson.content.mainContent}`,
      },
      assessments: baseLesson.assessments.map(a => ({
        ...a,
        questions: a.questions.slice(0, Math.ceil(a.questions.length * 0.7)),
      })),
    };
  }

  // If student is excelling (> 0.85), add challenge
  if (studentPerformance > 0.85) {
    return {
      ...baseLesson,
      content: {
        ...baseLesson.content,
        mainContent: `${baseLesson.content.mainContent}\n\n[ADVANCED EXTENSION]`,
      },
    };
  }

  return baseLesson;
}

/**
 * Calculate student comprehension based on assessment results
 */
export function calculateComprehension(
  assessment: Assessment,
  studentAnswers: Record<string, string>
): number {
  let totalPoints = 0;
  let earnedPoints = 0;

  for (const question of assessment.questions) {
    totalPoints += question.points;
    const studentAnswer = studentAnswers[question.id];

    if (!studentAnswer) continue;

    if (question.type === 'multiple_choice' && question.correctAnswer) {
      if (studentAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
    }
    // For other types, would need rubric-based scoring
  }

  return totalPoints > 0 ? earnedPoints / totalPoints : 0;
}
