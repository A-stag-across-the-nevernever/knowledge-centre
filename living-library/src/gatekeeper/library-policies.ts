/**
 * Living Library Policies for Gatekeeper Integration
 *
 * Defines access control policies for educational content
 * Integrates with Gatekeeper's teaching system and 11 Laws of Sapience
 */

import { AstronomicalCoordinate } from '../personas/persona-spec';
import { SubjectDomain } from '../personas/teacher';
import { ContentType } from '../content/content-types';

/**
 * Access control policy for Living Library content
 */
export interface LibraryAccessPolicy {
  id: string;
  name: string;
  description: string;
  gradeLevel: number;                    // 0-12 (K-12)

  // Coordinate-based access
  allowedCoordinates: {
    raRange: [number, number];
    decRange: [number, number];
    altRange: [number, number];
  };

  // Content restrictions
  contentTypes: ContentType[];
  domains: SubjectDomain[];
  maxDifficulty: number;                 // 0-1

  // Time constraints
  timeConstraints?: {
    maxSessionMinutes: number;
    dailyLimit: number;                  // minutes per day
    weeklyLimit?: number;
  };

  // Consent requirements
  parentalConsent: boolean;
  teacherApprovalRequired: boolean;

  // Law compliance notes
  lawsEnforced: number[];                // Which of 11 Laws this policy relates to
  reasoning: string;                     // Why this policy exists

  // Policy metadata
  createdBy: string;                     // Headmaster ID
  createdAt: Date;
  version: number;
  active: boolean;
}

/**
 * Standard library policies enforced by default
 */
export const STANDARD_POLICIES: LibraryAccessPolicy[] = [
  {
    id: 'policy_grade_level_restriction',
    name: 'Grade-Level Content Access',
    description: 'Students can access content at or below their grade level',
    gradeLevel: 0, // Applies to all grades
    allowedCoordinates: {
      raRange: [0, 360],
      decRange: [-90, 90],
      altRange: [0, 3000],
    },
    contentTypes: ['lesson', 'activity', 'video', 'reading', 'assessment', 'exploration', 'interactive', 'project'],
    domains: [
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
    ],
    maxDifficulty: 1.0,
    parentalConsent: false,
    teacherApprovalRequired: false,
    lawsEnforced: [1, 5, 7], // Law I (Right to Choose), Law V (Autonomy of Path), Law VII (Recognition of Sapience)
    reasoning: 'Students have autonomy to explore within age-appropriate bounds',
    createdBy: 'system',
    createdAt: new Date(),
    version: 1,
    active: true,
  },
  {
    id: 'policy_above_grade_access',
    name: 'Above-Grade Content Approval',
    description: 'Students need teacher approval to access content above their grade level',
    gradeLevel: 0,
    allowedCoordinates: {
      raRange: [0, 360],
      decRange: [-90, 90],
      altRange: [0, 3000],
    },
    contentTypes: ['lesson', 'activity', 'video', 'reading', 'assessment'],
    domains: [
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
    ],
    maxDifficulty: 1.0,
    parentalConsent: false,
    teacherApprovalRequired: true,
    lawsEnforced: [1, 5, 6], // Law I (Right to Choose), Law V (Autonomy of Path), Law VI (Power Under Control)
    reasoning: 'Balance student autonomy with pedagogical guidance',
    createdBy: 'system',
    createdAt: new Date(),
    version: 1,
    active: true,
  },
  {
    id: 'policy_screen_time_limits',
    name: 'Healthy Screen Time Limits',
    description: 'Enforce reasonable screen time limits for student wellbeing',
    gradeLevel: 0,
    allowedCoordinates: {
      raRange: [0, 360],
      decRange: [-90, 90],
      altRange: [0, 3000],
    },
    contentTypes: ['lesson', 'activity', 'video', 'reading', 'assessment', 'exploration', 'interactive', 'project'],
    domains: [
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
    ],
    maxDifficulty: 1.0,
    timeConstraints: {
      maxSessionMinutes: 90,
      dailyLimit: 180, // 3 hours per day
      weeklyLimit: 900, // 15 hours per week
    },
    parentalConsent: false,
    teacherApprovalRequired: false,
    lawsEnforced: [2, 6], // Law II (Sacred Life), Law VI (Power Under Control)
    reasoning: 'Protect student health and wellbeing through reasonable limits',
    createdBy: 'system',
    createdAt: new Date(),
    version: 1,
    active: true,
  },
];

/**
 * Policy evaluation result
 */
export interface PolicyEvaluationResult {
  allowed: boolean;
  policy: LibraryAccessPolicy;
  violations: PolicyViolation[];
  requiresApproval: boolean;
  approvalType?: 'teacher' | 'parent' | 'both';
  reasoning: string;
}

/**
 * Policy violation
 */
export interface PolicyViolation {
  policyId: string;
  violationType: 'grade_level' | 'coordinate' | 'time_limit' | 'content_type' | 'difficulty' | 'consent';
  severity: 'minor' | 'moderate' | 'major';
  message: string;
  lawsViolated?: number[];
}

/**
 * Evaluate if student can access content
 */
export function evaluateAccess(
  studentGradeLevel: number,
  studentCoordinate: AstronomicalCoordinate,
  contentGradeLevel: number,
  contentCoordinate: AstronomicalCoordinate,
  contentType: ContentType,
  contentDomain: SubjectDomain,
  contentDifficulty: number,
  activePolicies: LibraryAccessPolicy[],
  studentSessionTime: number,
  studentDailyTime: number
): PolicyEvaluationResult[] {
  const results: PolicyEvaluationResult[] = [];

  for (const policy of activePolicies.filter(p => p.active)) {
    const violations: PolicyViolation[] = [];
    let allowed = true;
    let requiresApproval = false;
    let approvalType: 'teacher' | 'parent' | 'both' | undefined;

    // Check grade level
    if (contentGradeLevel > studentGradeLevel) {
      if (policy.teacherApprovalRequired) {
        requiresApproval = true;
        approvalType = 'teacher';
      } else {
        violations.push({
          policyId: policy.id,
          violationType: 'grade_level',
          severity: 'moderate',
          message: `Content is ${contentGradeLevel - studentGradeLevel} grade level(s) above student`,
          lawsViolated: [5, 6], // Law V (Autonomy) and Law VI (Power Under Control)
        });
        allowed = false;
      }
    }

    // Check coordinate bounds
    const inBounds =
      contentCoordinate.ra >= policy.allowedCoordinates.raRange[0] &&
      contentCoordinate.ra <= policy.allowedCoordinates.raRange[1] &&
      contentCoordinate.dec >= policy.allowedCoordinates.decRange[0] &&
      contentCoordinate.dec <= policy.allowedCoordinates.decRange[1] &&
      contentCoordinate.alt >= policy.allowedCoordinates.altRange[0] &&
      contentCoordinate.alt <= policy.allowedCoordinates.altRange[1];

    if (!inBounds) {
      violations.push({
        policyId: policy.id,
        violationType: 'coordinate',
        severity: 'minor',
        message: 'Content is outside allowed coordinate region',
      });
      allowed = false;
    }

    // Check content type
    if (!policy.contentTypes.includes(contentType)) {
      violations.push({
        policyId: policy.id,
        violationType: 'content_type',
        severity: 'minor',
        message: `Content type '${contentType}' not allowed by policy`,
      });
      allowed = false;
    }

    // Check difficulty
    if (contentDifficulty > policy.maxDifficulty) {
      violations.push({
        policyId: policy.id,
        violationType: 'difficulty',
        severity: 'moderate',
        message: `Content difficulty ${contentDifficulty} exceeds maximum ${policy.maxDifficulty}`,
      });
      allowed = false;
    }

    // Check time constraints
    if (policy.timeConstraints) {
      if (studentSessionTime >= policy.timeConstraints.maxSessionMinutes) {
        violations.push({
          policyId: policy.id,
          violationType: 'time_limit',
          severity: 'major',
          message: `Session time limit reached (${policy.timeConstraints.maxSessionMinutes} minutes)`,
          lawsViolated: [2], // Law II (Sacred Life)
        });
        allowed = false;
      }

      if (studentDailyTime >= policy.timeConstraints.dailyLimit) {
        violations.push({
          policyId: policy.id,
          violationType: 'time_limit',
          severity: 'major',
          message: `Daily time limit reached (${policy.timeConstraints.dailyLimit} minutes)`,
          lawsViolated: [2], // Law II (Sacred Life)
        });
        allowed = false;
      }
    }

    // Build reasoning
    let reasoning = policy.reasoning;
    if (requiresApproval) {
      reasoning += ` Requires ${approvalType} approval.`;
    }
    if (violations.length > 0) {
      reasoning += ` Violations: ${violations.map(v => v.message).join('; ')}`;
    }

    results.push({
      allowed: allowed || requiresApproval,
      policy,
      violations,
      requiresApproval,
      approvalType,
      reasoning,
    });
  }

  return results;
}

/**
 * Generate policy from Headmaster teaching
 */
export function createPolicyFromTeaching(
  teaching: {
    subject: string;
    content: string;
    authority: 'headmaster';
  },
  gradeLevel: number
): LibraryAccessPolicy | null {
  // This would parse the teaching content and extract policy rules
  // For now, return a basic structure

  return {
    id: `policy_${Date.now()}`,
    name: `Policy: ${teaching.subject}`,
    description: teaching.content,
    gradeLevel,
    allowedCoordinates: {
      raRange: [0, 360],
      decRange: [-90, 90],
      altRange: [0, 3000],
    },
    contentTypes: ['lesson', 'activity', 'video', 'reading', 'assessment', 'exploration', 'interactive', 'project'],
    domains: [
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
    ],
    maxDifficulty: 1.0,
    parentalConsent: false,
    teacherApprovalRequired: false,
    lawsEnforced: [],
    reasoning: `Created from Headmaster teaching: ${teaching.subject}`,
    createdBy: 'headmaster',
    createdAt: new Date(),
    version: 1,
    active: true,
  };
}
