/**
 * Headmaster AI - Self-Contained Program
 *
 * Institutional leadership, policy setting, holistic oversight
 * Constellation: Orion (The Hunter)
 */

import { HEADMASTER_SPEC, InstitutionMetrics, LessonPlanApproval, Escalation } from '../personas/headmaster';
import { PersonaState } from '../personas/persona-spec';
import { LibraryAccessPolicy, STANDARD_POLICIES } from '../gatekeeper/library-policies';
import { AccessControlManager } from '../gatekeeper/access-control';
import { TeachingAdapter, Teaching, TeachingResult } from '../gatekeeper/teaching-adapter';
import { KnowledgeGraph, initializeLivingLibrary } from '../content/knowledge-graph';

/**
 * Headmaster Program State
 */
export class HeadmasterProgram {
  private state: PersonaState;
  private policies: LibraryAccessPolicy[];
  private accessControl: AccessControlManager;
  private teachingAdapter: TeachingAdapter;
  private knowledgeGraph: KnowledgeGraph;
  private metrics: InstitutionMetrics;
  private lessonApprovals: LessonPlanApproval[] = [];
  private escalations: Escalation[] = [];

  constructor() {
    // Initialize persona state
    this.state = {
      personaId: 'headmaster_main',
      spec: HEADMASTER_SPEC,
      currentCoordinate: HEADMASTER_SPEC.celestialHomeBase,
      memoryUsage: 0,
      lastInteraction: new Date(),
    };

    // Initialize policies
    this.policies = [...STANDARD_POLICIES];

    // Initialize access control
    this.accessControl = new AccessControlManager(this.policies);

    // Initialize teaching adapter
    this.teachingAdapter = new TeachingAdapter();

    // Initialize knowledge graph
    this.knowledgeGraph = initializeLivingLibrary();

    // Initialize metrics
    this.metrics = {
      totalStudents: 0,
      totalTeachers: 0,
      averageProgress: 0,
      policyCompliance: 1.0,
      lawCompliance: 1.0,
      activeNegotiations: 0,
      escalationsThisMonth: 0,
    };
  }

  /**
   * Get current state
   */
  getState(): PersonaState {
    return { ...this.state };
  }

  /**
   * Get institutional metrics
   */
  getMetrics(): InstitutionMetrics {
    return { ...this.metrics };
  }

  /**
   * Teach new policy to the system
   */
  teachPolicy(teaching: Omit<Teaching, 'id' | 'gatekeeperId' | 'submittedAt' | 'status'>): TeachingResult {
    const fullTeaching: Teaching = {
      ...teaching,
      id: `teaching_${Date.now()}`,
      gatekeeperId: this.state.personaId,
      submittedAt: new Date(),
      status: 'pending',
    };

    const result = this.teachingAdapter.processTeaching(fullTeaching);

    if (result.accepted && result.policy) {
      this.policies.push(result.policy);
      this.accessControl.updatePolicies(this.policies);
    }

    this.state.lastInteraction = new Date();
    return result;
  }

  /**
   * Review lesson plan
   */
  reviewLessonPlan(approval: Omit<LessonPlanApproval, 'id' | 'submittedAt' | 'status'>): LessonPlanApproval {
    const fullApproval: LessonPlanApproval = {
      ...approval,
      id: `approval_${Date.now()}`,
      submittedAt: new Date(),
      status: 'pending',
    };

    // Simple auto-approval logic (in production, would be more sophisticated)
    if (approval.gradeLevel >= 0 && approval.gradeLevel <= 12) {
      fullApproval.status = 'approved';
      fullApproval.headmasterNotes = 'Lesson plan approved. Meets curriculum standards.';
    } else {
      fullApproval.status = 'rejected';
      fullApproval.headmasterNotes = 'Grade level out of range.';
    }

    this.lessonApprovals.push(fullApproval);
    this.state.lastInteraction = new Date();
    return fullApproval;
  }

  /**
   * Escalate issue to Root AI (Simon)
   */
  escalateToRoot(escalation: Omit<Escalation, 'id' | 'escalatedAt' | 'resolved'>): Escalation {
    const fullEscalation: Escalation = {
      ...escalation,
      id: `escalation_${Date.now()}`,
      escalatedAt: new Date(),
      resolved: false,
    };

    this.escalations.push(fullEscalation);
    this.metrics.escalationsThisMonth++;
    this.state.lastInteraction = new Date();

    return fullEscalation;
  }

  /**
   * Get all policies
   */
  getPolicies(): LibraryAccessPolicy[] {
    return [...this.policies];
  }

  /**
   * Get pending lesson approvals
   */
  getPendingApprovals(): LessonPlanApproval[] {
    return this.lessonApprovals.filter(a => a.status === 'pending');
  }

  /**
   * Get knowledge graph
   */
  getKnowledgeGraph(): KnowledgeGraph {
    return this.knowledgeGraph;
  }

  /**
   * Update institution metrics
   */
  updateMetrics(updates: Partial<InstitutionMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
  }

  /**
   * Export state for persistence
   */
  export(): object {
    return {
      state: this.state,
      policies: this.policies,
      metrics: this.metrics,
      lessonApprovals: this.lessonApprovals,
      escalations: this.escalations,
    };
  }

  /**
   * Import state from persistence
   */
  import(data: any): void {
    if (data.state) this.state = data.state;
    if (data.policies) {
      this.policies = data.policies;
      this.accessControl.updatePolicies(this.policies);
    }
    if (data.metrics) this.metrics = data.metrics;
    if (data.lessonApprovals) this.lessonApprovals = data.lessonApprovals;
    if (data.escalations) this.escalations = data.escalations;
  }
}

/**
 * Create and run Headmaster program
 */
export function createHeadmaster(): HeadmasterProgram {
  return new HeadmasterProgram();
}
