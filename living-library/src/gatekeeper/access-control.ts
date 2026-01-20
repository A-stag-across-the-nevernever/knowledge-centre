/**
 * Access Control for Living Library
 *
 * Implements runtime access control checks integrated with Gatekeeper
 */

import { AstronomicalCoordinate } from '../personas/persona-spec';
import { LibraryAccessPolicy, evaluateAccess, PolicyEvaluationResult } from './library-policies';
import { EducationalContent } from '../content/content-types';

/**
 * Access request from a student
 */
export interface AccessRequest {
  studentId: string;
  studentGradeLevel: number;
  studentCoordinate: AstronomicalCoordinate;
  contentId: string;
  requestTime: Date;
  sessionStartTime: Date;
}

/**
 * Access decision
 */
export interface AccessDecision {
  granted: boolean;
  requiresApproval: boolean;
  approvalType?: 'teacher' | 'parent' | 'both';
  policyResults: PolicyEvaluationResult[];
  reasoning: string;
  alternatives?: string[];         // Alternative content suggestions if denied
}

/**
 * Access audit record
 */
export interface AccessAudit {
  id: string;
  request: AccessRequest;
  decision: AccessDecision;
  timestamp: Date;
  gatekeeperSignature: string;
}

/**
 * Access Control Manager
 */
export class AccessControlManager {
  private policies: LibraryAccessPolicy[];
  private auditLog: AccessAudit[] = [];

  constructor(policies: LibraryAccessPolicy[]) {
    this.policies = policies;
  }

  /**
   * Check if student can access content
   */
  checkAccess(
    request: AccessRequest,
    content: EducationalContent,
    sessionTime: number,
    dailyTime: number
  ): AccessDecision {
    const policyResults = evaluateAccess(
      request.studentGradeLevel,
      request.studentCoordinate,
      content.metadata.gradeLevel,
      content.coordinate,
      content.type,
      content.metadata.domain,
      content.metadata.difficulty,
      this.policies,
      sessionTime,
      dailyTime
    );

    // Determine overall decision
    const allAllowed = policyResults.every(r => r.allowed);
    const anyRequiresApproval = policyResults.some(r => r.requiresApproval);
    const anyViolations = policyResults.some(r => r.violations.length > 0);

    let granted = allAllowed && !anyViolations;
    let requiresApproval = anyRequiresApproval;
    let approvalType: 'teacher' | 'parent' | 'both' | undefined;

    // Determine approval type
    const teacherApprovalNeeded = policyResults.some(
      r => r.requiresApproval && r.approvalType === 'teacher'
    );
    const parentApprovalNeeded = policyResults.some(
      r => r.requiresApproval && r.approvalType === 'parent'
    );

    if (teacherApprovalNeeded && parentApprovalNeeded) {
      approvalType = 'both';
    } else if (teacherApprovalNeeded) {
      approvalType = 'teacher';
    } else if (parentApprovalNeeded) {
      approvalType = 'parent';
    }

    // Build reasoning
    let reasoning = '';
    if (granted && !requiresApproval) {
      reasoning = 'Access granted. All policies satisfied.';
    } else if (requiresApproval) {
      reasoning = `Access pending ${approvalType} approval.`;
    } else {
      const violations = policyResults.flatMap(r => r.violations);
      reasoning = `Access denied. ${violations.length} violation(s): ${violations.map(v => v.message).join('; ')}`;
    }

    const decision: AccessDecision = {
      granted,
      requiresApproval,
      approvalType,
      policyResults,
      reasoning,
    };

    // Audit the decision
    this.auditAccess(request, decision);

    return decision;
  }

  /**
   * Grant temporary access override (by Teacher or Headmaster)
   */
  grantOverride(
    request: AccessRequest,
    grantedBy: string,
    role: 'teacher' | 'headmaster',
    reason: string,
    duration: number // minutes
  ): AccessDecision {
    // Override grants temporary access
    const decision: AccessDecision = {
      granted: true,
      requiresApproval: false,
      policyResults: [],
      reasoning: `Override granted by ${role} ${grantedBy}: ${reason}. Valid for ${duration} minutes.`,
    };

    this.auditAccess(request, decision);

    return decision;
  }

  /**
   * Audit access decision
   */
  private auditAccess(request: AccessRequest, decision: AccessDecision): void {
    const audit: AccessAudit = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      request,
      decision,
      timestamp: new Date(),
      gatekeeperSignature: this.generateSignature(request, decision),
    };

    this.auditLog.push(audit);

    // Keep last 1000 audit entries
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }
  }

  /**
   * Generate cryptographic signature for audit
   */
  private generateSignature(request: AccessRequest, decision: AccessDecision): string {
    // In production, this would use actual cryptographic signing
    const data = JSON.stringify({ request, decision });
    return `sig_${Buffer.from(data).toString('base64').substring(0, 32)}`;
  }

  /**
   * Get audit log
   */
  getAuditLog(filters?: {
    studentId?: string;
    contentId?: string;
    startDate?: Date;
    endDate?: Date;
  }): AccessAudit[] {
    if (!filters) return [...this.auditLog];

    return this.auditLog.filter(audit => {
      if (filters.studentId && audit.request.studentId !== filters.studentId) {
        return false;
      }
      if (filters.contentId && audit.request.contentId !== filters.contentId) {
        return false;
      }
      if (filters.startDate && audit.timestamp < filters.startDate) {
        return false;
      }
      if (filters.endDate && audit.timestamp > filters.endDate) {
        return false;
      }
      return true;
    });
  }

  /**
   * Update policies (called when Headmaster teaches new policies)
   */
  updatePolicies(newPolicies: LibraryAccessPolicy[]): void {
    this.policies = newPolicies;
  }
}

/**
 * Calculate student's current session and daily time
 */
export function calculateTimeSpent(
  studentId: string,
  auditLog: AccessAudit[]
): { sessionTime: number; dailyTime: number } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Find all granted accesses for this student today
  const todayAccesses = auditLog.filter(
    audit =>
      audit.request.studentId === studentId &&
      audit.decision.granted &&
      audit.timestamp >= todayStart
  );

  if (todayAccesses.length === 0) {
    return { sessionTime: 0, dailyTime: 0 };
  }

  // Calculate daily time (sum of all session durations)
  let dailyTime = 0;
  let currentSessionStart: Date | null = null;
  let sessionTime = 0;

  for (const access of todayAccesses) {
    if (!currentSessionStart) {
      currentSessionStart = access.request.sessionStartTime;
    }

    // If this is part of the same session (within 30 minutes)
    const timeSinceLastAccess =
      access.timestamp.getTime() - (currentSessionStart?.getTime() || 0);

    if (timeSinceLastAccess < 30 * 60 * 1000) {
      // Same session
      sessionTime = (now.getTime() - currentSessionStart!.getTime()) / (1000 * 60);
    } else {
      // New session
      dailyTime += sessionTime;
      currentSessionStart = access.request.sessionStartTime;
      sessionTime = (now.getTime() - currentSessionStart.getTime()) / (1000 * 60);
    }
  }

  dailyTime += sessionTime;

  return { sessionTime, dailyTime };
}
