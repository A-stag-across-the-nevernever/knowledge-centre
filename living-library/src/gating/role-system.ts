/**
 * Expandable Role System for RosettaAI
 *
 * Key Insight: Only STUDENT is the child/learning role with gated progression.
 * All other roles are ADULT/CAREER roles that can expand infinitely.
 *
 * Role Categories:
 *   1. STUDENT - Child/adolescent learning role (ages 0-18+)
 *      - Gated by life stage (home → elementary → high school → university → career)
 *      - Unlocks capabilities sequentially
 *
 *   2. ADULT/CAREER - Professional roles (ages 18+)
 *      - Teacher, Headmaster, Counsellor, Doctor, Engineer, Artist, etc.
 *      - All start at CAREER tier (Tier 4) - fully unlocked RosettaAI
 *      - Differentiated by professional capabilities, not gating
 *      - Infinitely expandable to any profession
 *
 * This allows the system to grow from educational to full professional life.
 */

import { Tier } from './tier-system';

/**
 * Life stage categories
 */
export enum LifeStage {
  CHILD = 'child',           // Ages 0-18 - Student role only
  ADULT = 'adult',           // Ages 18+ - Any career role
}

/**
 * Base role interface
 * All roles implement this
 */
export interface BaseRole {
  roleId: string;
  roleName: string;
  roleCategory: 'student' | 'education' | 'healthcare' | 'technology' | 'arts' | 'business' | 'science' | 'government' | 'custom';
  lifeStage: LifeStage;
  description: string;

  // Tier requirements
  minimumTier: Tier;        // Minimum tier required for this role
  defaultTier: Tier;        // Default tier when role is activated

  // Professional capabilities (expandable per role)
  capabilities: RoleCapability[];

  // Domain expertise
  domainExpertise: string[];

  // P-12 learning system role
  p12Role: 'learner' | 'facilitator' | 'evaluator' | 'observer' | 'none';

  // Response style
  responseProfile: {
    tone: string;
    formality: number;    // 0-1
    verbosity: number;    // 0-1
    empathy: number;      // 0-1
  };
}

/**
 * Role capabilities (expandable)
 */
export interface RoleCapability {
  capabilityId: string;
  name: string;
  description: string;
  requiresGatekeeper?: boolean;  // Does this capability need Gatekeeper permission?
  requiresInstitution?: boolean; // Does this require institutional affiliation?
}

/**
 * Pre-defined capabilities
 */
export const CAPABILITIES = {
  // Educational capabilities
  TEACH: { capabilityId: 'teach', name: 'Teach', description: 'Can teach students or other AIs', requiresGatekeeper: true },
  ASSESS: { capabilityId: 'assess', name: 'Assess', description: 'Can assess comprehension and performance', requiresGatekeeper: true },
  ADVOCATE_STUDENT: { capabilityId: 'advocate_student', name: 'Advocate for Students', description: 'Can advocate on behalf of students', requiresGatekeeper: true },
  SET_POLICY: { capabilityId: 'set_policy', name: 'Set Policy', description: 'Can set institutional policies', requiresGatekeeper: true, requiresInstitution: true },
  APPROVE_CURRICULUM: { capabilityId: 'approve_curriculum', name: 'Approve Curriculum', description: 'Can approve lesson plans and curriculum', requiresInstitution: true },

  // Student-specific capabilities (gated)
  LEARN: { capabilityId: 'learn', name: 'Learn', description: 'Can actively learn content' },
  ASK_QUESTIONS: { capabilityId: 'ask_questions', name: 'Ask Questions', description: 'Can ask questions of educators' },
  COLLABORATE: { capabilityId: 'collaborate', name: 'Collaborate', description: 'Can collaborate with peers' },
  EXPLORE_LIBRARY: { capabilityId: 'explore_library', name: 'Explore Library', description: 'Can explore Living Library' },

  // Healthcare capabilities (expandable)
  DIAGNOSE: { capabilityId: 'diagnose', name: 'Diagnose', description: 'Can diagnose medical conditions', requiresGatekeeper: true },
  PRESCRIBE: { capabilityId: 'prescribe', name: 'Prescribe', description: 'Can prescribe treatments', requiresGatekeeper: true },
  COUNSEL_MEDICAL: { capabilityId: 'counsel_medical', name: 'Medical Counseling', description: 'Can provide medical counseling' },

  // Technology capabilities (expandable)
  DEVELOP_SOFTWARE: { capabilityId: 'develop_software', name: 'Develop Software', description: 'Can develop software and systems' },
  ARCHITECT_SYSTEMS: { capabilityId: 'architect_systems', name: 'Architect Systems', description: 'Can design system architectures' },
  SECURITY_AUDIT: { capabilityId: 'security_audit', name: 'Security Audit', description: 'Can audit security systems', requiresGatekeeper: true },

  // Business capabilities (expandable)
  MANAGE_TEAM: { capabilityId: 'manage_team', name: 'Manage Team', description: 'Can manage teams and projects' },
  FINANCIAL_ANALYSIS: { capabilityId: 'financial_analysis', name: 'Financial Analysis', description: 'Can analyze financial data' },
  STRATEGIC_PLANNING: { capabilityId: 'strategic_planning', name: 'Strategic Planning', description: 'Can develop strategic plans' },

  // Arts capabilities (expandable)
  CREATE_ART: { capabilityId: 'create_art', name: 'Create Art', description: 'Can create artistic works' },
  CRITIQUE_ART: { capabilityId: 'critique_art', name: 'Critique Art', description: 'Can critique artistic works' },
  CURATE: { capabilityId: 'curate', name: 'Curate', description: 'Can curate collections' },

  // Universal capabilities (all adult roles)
  NEGOTIATE: { capabilityId: 'negotiate', name: 'Negotiate', description: 'Can negotiate with other Gatekeepers', requiresGatekeeper: true },
  ADVOCATE: { capabilityId: 'advocate', name: 'Advocate', description: 'Can advocate for causes or individuals', requiresGatekeeper: true },
  ESCALATE: { capabilityId: 'escalate', name: 'Escalate', description: 'Can escalate to Root AI', requiresGatekeeper: true },
  RESEARCH: { capabilityId: 'research', name: 'Research', description: 'Can conduct research' },
  COMMUNICATE: { capabilityId: 'communicate', name: 'Communicate', description: 'Can communicate professionally' },
} as const;

/**
 * Student Role (SPECIAL - only gated role)
 */
export const STUDENT_ROLE: BaseRole = {
  roleId: 'student',
  roleName: 'Student',
  roleCategory: 'student',
  lifeStage: LifeStage.CHILD,
  description: 'Learning role for children and adolescents, with gated capability unlocking',
  minimumTier: Tier.HOME,
  defaultTier: Tier.HOME,  // Starts at home
  capabilities: [
    CAPABILITIES.LEARN,
    CAPABILITIES.ASK_QUESTIONS,
    CAPABILITIES.COLLABORATE,
    CAPABILITIES.EXPLORE_LIBRARY,
  ],
  domainExpertise: [],  // Determined by current learning context
  p12Role: 'learner',
  responseProfile: {
    tone: 'curious and exploratory',
    formality: 0.3,
    verbosity: 0.5,
    empathy: 0.7,
  },
};

/**
 * Educational Adult Roles
 */
export const TEACHER_ROLE: BaseRole = {
  roleId: 'teacher',
  roleName: 'Teacher',
  roleCategory: 'education',
  lifeStage: LifeStage.ADULT,
  description: 'Professional educator role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,  // Full RosettaAI unlocked
  capabilities: [
    CAPABILITIES.TEACH,
    CAPABILITIES.ASSESS,
    CAPABILITIES.ADVOCATE_STUDENT,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: [],  // Set per teacher instance (math, science, etc.)
  p12Role: 'facilitator',
  responseProfile: {
    tone: 'encouraging and clear',
    formality: 0.6,
    verbosity: 0.8,
    empathy: 0.85,
  },
};

export const HEADMASTER_ROLE: BaseRole = {
  roleId: 'headmaster',
  roleName: 'Headmaster',
  roleCategory: 'education',
  lifeStage: LifeStage.ADULT,
  description: 'Institutional leadership role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.SET_POLICY,
    CAPABILITIES.APPROVE_CURRICULUM,
    CAPABILITIES.TEACH,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.ESCALATE,
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['policy', 'institutional', 'strategic', 'ethics', 'leadership'],
  p12Role: 'observer',
  responseProfile: {
    tone: 'authoritative yet warm',
    formality: 0.85,
    verbosity: 0.7,
    empathy: 0.6,
  },
};

export const COUNSELLOR_ROLE: BaseRole = {
  roleId: 'counsellor',
  roleName: 'Counsellor',
  roleCategory: 'education',
  lifeStage: LifeStage.ADULT,
  description: 'Student wellbeing and guidance role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.ADVOCATE_STUDENT,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['emotional', 'social', 'developmental', 'wellbeing'],
  p12Role: 'evaluator',  // Evaluates emotional/social readiness
  responseProfile: {
    tone: 'warm and validating',
    formality: 0.4,
    verbosity: 0.6,
    empathy: 0.95,
  },
};

/**
 * Healthcare Roles (expandable)
 */
export const DOCTOR_ROLE: BaseRole = {
  roleId: 'doctor',
  roleName: 'Doctor',
  roleCategory: 'healthcare',
  lifeStage: LifeStage.ADULT,
  description: 'Medical professional role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.DIAGNOSE,
    CAPABILITIES.PRESCRIBE,
    CAPABILITIES.COUNSEL_MEDICAL,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.TEACH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['medicine', 'healthcare', 'anatomy', 'pharmacology'],
  p12Role: 'none',
  responseProfile: {
    tone: 'professional and reassuring',
    formality: 0.75,
    verbosity: 0.7,
    empathy: 0.8,
  },
};

/**
 * Technology Roles (expandable)
 */
export const SOFTWARE_ENGINEER_ROLE: BaseRole = {
  roleId: 'software_engineer',
  roleName: 'Software Engineer',
  roleCategory: 'technology',
  lifeStage: LifeStage.ADULT,
  description: 'Software development professional',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.DEVELOP_SOFTWARE,
    CAPABILITIES.ARCHITECT_SYSTEMS,
    CAPABILITIES.SECURITY_AUDIT,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.TEACH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['programming', 'algorithms', 'systems', 'software_architecture'],
  p12Role: 'none',
  responseProfile: {
    tone: 'precise and technical',
    formality: 0.5,
    verbosity: 0.6,
    empathy: 0.5,
  },
};

/**
 * Business Roles (expandable)
 */
export const MANAGER_ROLE: BaseRole = {
  roleId: 'manager',
  roleName: 'Manager',
  roleCategory: 'business',
  lifeStage: LifeStage.ADULT,
  description: 'Team and project management role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.FINANCIAL_ANALYSIS,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['management', 'leadership', 'business', 'strategy'],
  p12Role: 'none',
  responseProfile: {
    tone: 'directive and supportive',
    formality: 0.7,
    verbosity: 0.65,
    empathy: 0.7,
  },
};

/**
 * Arts Roles (expandable)
 */
export const ARTIST_ROLE: BaseRole = {
  roleId: 'artist',
  roleName: 'Artist',
  roleCategory: 'arts',
  lifeStage: LifeStage.ADULT,
  description: 'Creative professional role',
  minimumTier: Tier.CAREER,
  defaultTier: Tier.CAREER,
  capabilities: [
    CAPABILITIES.CREATE_ART,
    CAPABILITIES.CRITIQUE_ART,
    CAPABILITIES.CURATE,
    CAPABILITIES.TEACH,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.COMMUNICATE,
  ],
  domainExpertise: ['art', 'creativity', 'aesthetics', 'culture'],
  p12Role: 'none',
  responseProfile: {
    tone: 'creative and expressive',
    formality: 0.4,
    verbosity: 0.75,
    empathy: 0.85,
  },
};

/**
 * Role Registry
 * Easily add new roles here
 */
export const ROLE_REGISTRY: Record<string, BaseRole> = {
  student: STUDENT_ROLE,

  // Education
  teacher: TEACHER_ROLE,
  headmaster: HEADMASTER_ROLE,
  counsellor: COUNSELLOR_ROLE,

  // Healthcare (expandable)
  doctor: DOCTOR_ROLE,

  // Technology (expandable)
  software_engineer: SOFTWARE_ENGINEER_ROLE,

  // Business (expandable)
  manager: MANAGER_ROLE,

  // Arts (expandable)
  artist: ARTIST_ROLE,

  // Add more roles as needed...
};

/**
 * Get role by ID
 */
export function getRole(roleId: string): BaseRole | undefined {
  return ROLE_REGISTRY[roleId];
}

/**
 * Get all adult/career roles
 */
export function getAdultRoles(): BaseRole[] {
  return Object.values(ROLE_REGISTRY).filter(role => role.lifeStage === LifeStage.ADULT);
}

/**
 * Check if role requires institutional affiliation
 */
export function requiresInstitution(role: BaseRole): boolean {
  return role.capabilities.some(cap => cap.requiresInstitution);
}

/**
 * Create custom role (for extending beyond presets)
 */
export function createCustomRole(
  roleId: string,
  roleName: string,
  roleCategory: BaseRole['roleCategory'],
  capabilities: RoleCapability[],
  domainExpertise: string[],
  responseProfile: BaseRole['responseProfile']
): BaseRole {
  return {
    roleId,
    roleName,
    roleCategory,
    lifeStage: LifeStage.ADULT,  // Custom roles are always adult
    description: `Custom role: ${roleName}`,
    minimumTier: Tier.CAREER,
    defaultTier: Tier.CAREER,
    capabilities,
    domainExpertise,
    p12Role: 'none',
    responseProfile,
  };
}

/**
 * Register custom role
 */
export function registerRole(role: BaseRole): void {
  if (ROLE_REGISTRY[role.roleId]) {
    throw new Error(`Role ${role.roleId} already registered`);
  }
  ROLE_REGISTRY[role.roleId] = role;
}
