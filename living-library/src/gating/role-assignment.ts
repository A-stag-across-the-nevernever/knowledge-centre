/**
 * Role Assignment System via Living Library
 *
 * When a person joins a company, school, or institution, the Living Library
 * assigns them the appropriate role for their AI. The AI adapts to the role
 * by loading role-specific capabilities and domain expertise.
 *
 * Flow:
 * 1. Person enrolls at institution (school/university/company)
 * 2. Institution's Living Library issues role credential
 * 3. Person's AI receives credential via Gatekeeper
 * 4. AI unlocks role-specific capabilities
 * 5. AI can now function in that professional capacity
 *
 * Examples:
 * - Student enrolls at elementary school → Student role unlocked at Elementary tier
 * - Student graduates university → Can apply for career roles
 * - Graduate joins hospital → Doctor role unlocked (if qualified)
 * - Graduate joins tech company → Software Engineer role unlocked
 * - Employee promoted to manager → Manager role unlocked (additive to existing role)
 *
 * Multiple Roles:
 * - People can have multiple roles simultaneously
 * - E.g., Teacher + Artist, Doctor + Researcher, Manager + Engineer
 * - Each role adds capabilities and domain expertise
 */

import {
  Tier,
  EnrollmentProof,
} from './tier-system';

import {
  BaseRole,
  getRole,
  ROLE_REGISTRY,
  LifeStage,
  RoleCapability,
} from './role-system';

import {
  PersonaSpec,
  buildStudentPersona,
  buildAdultPersona,
} from './persona-builder';

/**
 * Institution type
 */
export enum InstitutionType {
  HOME = 'home',
  ELEMENTARY_SCHOOL = 'elementary_school',
  HIGH_SCHOOL = 'high_school',
  UNIVERSITY = 'university',
  HOSPITAL = 'hospital',
  TECH_COMPANY = 'tech_company',
  MANUFACTURING = 'manufacturing',
  FINANCIAL_SERVICES = 'financial_services',
  ARTS_ORGANIZATION = 'arts_organization',
  GOVERNMENT = 'government',
  RESEARCH_LAB = 'research_lab',
  NONPROFIT = 'nonprofit',
  CUSTOM = 'custom',
}

/**
 * Role credential issued by institution's Living Library
 */
export interface RoleCredential {
  credentialId: string;
  personId: string;
  roleId: string;
  institutionId: string;
  institutionType: InstitutionType;
  institutionName: string;

  // Qualification proof
  qualifications: string[];  // Degrees, certifications, etc.
  verifiedBy: string;  // Gatekeeper ID that verified qualifications

  // Role specifics
  title: string;  // Job title or position
  department?: string;
  seniority?: 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive';

  // Validity
  issuedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'suspended' | 'revoked' | 'expired';

  // Cryptographic proof
  signature: string;
  gatekeeperId: string;
}

/**
 * Role assignment request
 * Submitted to institution's Living Library
 */
export interface RoleAssignmentRequest {
  requestId: string;
  personId: string;
  requestedRoleId: string;
  institutionId: string;
  qualifications: string[];
  motivation?: string;
  timestamp: Date;
}

/**
 * Role assignment response
 */
export interface RoleAssignmentResponse {
  requestId: string;
  approved: boolean;
  credential?: RoleCredential;
  reason?: string;
  timestamp: Date;
}

/**
 * Institution's role offerings
 * Each institution defines what roles they offer
 */
export interface InstitutionRoleOffering {
  institutionId: string;
  institutionName: string;
  institutionType: InstitutionType;
  availableRoles: {
    roleId: string;
    requirements: {
      minimumTier: Tier;
      requiredQualifications: string[];
      requiredExperience?: string[];
      customCriteria?: Record<string, any>;
    };
    onboarding: {
      duration: number;  // days
      training: string[];
      mentorship: boolean;
    };
  }[];
}

/**
 * Default role offerings by institution type
 */
export const DEFAULT_ROLE_OFFERINGS: Record<InstitutionType, string[]> = {
  [InstitutionType.HOME]: ['student'],
  [InstitutionType.ELEMENTARY_SCHOOL]: ['student', 'teacher', 'headmaster', 'counsellor'],
  [InstitutionType.HIGH_SCHOOL]: ['student', 'teacher', 'headmaster', 'counsellor'],
  [InstitutionType.UNIVERSITY]: ['student', 'teacher', 'headmaster', 'counsellor'],
  [InstitutionType.HOSPITAL]: ['doctor', 'manager'],
  [InstitutionType.TECH_COMPANY]: ['software_engineer', 'manager'],
  [InstitutionType.MANUFACTURING]: ['manager'],
  [InstitutionType.FINANCIAL_SERVICES]: ['manager'],
  [InstitutionType.ARTS_ORGANIZATION]: ['artist', 'manager'],
  [InstitutionType.GOVERNMENT]: ['manager'],
  [InstitutionType.RESEARCH_LAB]: ['software_engineer', 'manager'],
  [InstitutionType.NONPROFIT]: ['manager'],
  [InstitutionType.CUSTOM]: [],
};

/**
 * Living Library Role Assignment Service
 */
export class RoleAssignmentService {
  private institutionOfferings: Map<string, InstitutionRoleOffering>;
  private issuedCredentials: Map<string, RoleCredential>;

  constructor() {
    this.institutionOfferings = new Map();
    this.issuedCredentials = new Map();
  }

  /**
   * Register institution with role offerings
   */
  registerInstitution(offering: InstitutionRoleOffering): void {
    this.institutionOfferings.set(offering.institutionId, offering);
    console.log(`[RoleAssignmentService] Registered institution: ${offering.institutionName}`);
  }

  /**
   * Submit role assignment request
   */
  async requestRole(request: RoleAssignmentRequest): Promise<RoleAssignmentResponse> {
    const institution = this.institutionOfferings.get(request.institutionId);
    if (!institution) {
      return {
        requestId: request.requestId,
        approved: false,
        reason: 'Institution not found',
        timestamp: new Date(),
      };
    }

    // Find role offering
    const offering = institution.availableRoles.find(r => r.roleId === request.requestedRoleId);
    if (!offering) {
      return {
        requestId: request.requestId,
        approved: false,
        reason: `Role ${request.requestedRoleId} not offered by this institution`,
        timestamp: new Date(),
      };
    }

    // Validate qualifications
    const hasQualifications = offering.requirements.requiredQualifications.every(
      req => request.qualifications.includes(req)
    );

    if (!hasQualifications) {
      return {
        requestId: request.requestId,
        approved: false,
        reason: 'Missing required qualifications',
        timestamp: new Date(),
      };
    }

    // Issue credential
    const credential: RoleCredential = {
      credentialId: `cred-${Date.now()}`,
      personId: request.personId,
      roleId: request.requestedRoleId,
      institutionId: request.institutionId,
      institutionType: institution.institutionType,
      institutionName: institution.institutionName,
      qualifications: request.qualifications,
      verifiedBy: `gatekeeper-${request.institutionId}`,
      title: getRole(request.requestedRoleId)?.roleName || request.requestedRoleId,
      issuedAt: new Date(),
      status: 'active',
      signature: this.generateSignature(request.personId, request.requestedRoleId, request.institutionId),
      gatekeeperId: `gatekeeper-${request.institutionId}`,
    };

    this.issuedCredentials.set(credential.credentialId, credential);

    console.log(`[RoleAssignmentService] Issued ${credential.roleId} credential to ${request.personId}`);

    return {
      requestId: request.requestId,
      approved: true,
      credential,
      timestamp: new Date(),
    };
  }

  /**
   * Apply role credential to persona
   * This activates the role in the person's AI
   */
  async applyCredentialToPersona(
    personaId: string,
    credential: RoleCredential,
    existingPersona?: PersonaSpec
  ): Promise<PersonaSpec> {
    // Validate credential
    if (credential.status !== 'active') {
      throw new Error('Credential is not active');
    }

    if (credential.personId !== personaId) {
      throw new Error('Credential does not match persona');
    }

    // If student role, build student persona
    if (credential.roleId === 'student') {
      const tier = this.institutionTypeToTier(credential.institutionType);

      const enrollmentProof: EnrollmentProof = {
        studentId: personaId,
        institutionId: credential.institutionId,
        institutionType: this.institutionTypeToEnrollmentType(credential.institutionType),
        tier,
        enrollmentDate: credential.issuedAt,
        expirationDate: credential.expiresAt,
        signature: credential.signature,
        gatekeeperId: credential.gatekeeperId,
      };

      return buildStudentPersona(personaId, tier, [enrollmentProof]);
    }

    // Adult/career role - build adult persona
    const enrollmentProof: EnrollmentProof = {
      studentId: personaId,
      institutionId: credential.institutionId,
      institutionType: 'employer',
      tier: Tier.CAREER,
      enrollmentDate: credential.issuedAt,
      expirationDate: credential.expiresAt,
      signature: credential.signature,
      gatekeeperId: credential.gatekeeperId,
    };

    return buildAdultPersona(personaId, credential.roleId, [enrollmentProof]);
  }

  /**
   * Apply multiple credentials (multiple roles)
   * A person can have multiple active roles simultaneously
   */
  async applyMultipleCredentials(
    personaId: string,
    credentials: RoleCredential[]
  ): Promise<PersonaSpec> {
    if (credentials.length === 0) {
      throw new Error('No credentials provided');
    }

    // Check if any are student credentials
    const studentCred = credentials.find(c => c.roleId === 'student');
    if (studentCred) {
      // If student credential exists, it takes precedence
      return this.applyCredentialToPersona(personaId, studentCred);
    }

    // All adult roles - merge capabilities
    const primaryCred = credentials[0];
    const primaryPersona = await this.applyCredentialToPersona(personaId, primaryCred);

    // Merge additional roles
    for (let i = 1; i < credentials.length; i++) {
      const additionalRole = getRole(credentials[i].roleId);
      if (additionalRole) {
        // Add capabilities
        const newCapabilities = additionalRole.capabilities.filter(
          cap => !primaryPersona.role.capabilities.some(c => c.capabilityId === cap.capabilityId)
        );
        primaryPersona.role.capabilities.push(...newCapabilities);

        // Add domain expertise
        const newDomains = additionalRole.domainExpertise.filter(
          domain => !primaryPersona.role.domainExpertise.includes(domain)
        );
        primaryPersona.role.domainExpertise.push(...newDomains);
      }
    }

    return primaryPersona;
  }

  /**
   * Revoke credential
   */
  async revokeCredential(credentialId: string, reason: string): Promise<void> {
    const credential = this.issuedCredentials.get(credentialId);
    if (!credential) {
      throw new Error('Credential not found');
    }

    credential.status = 'revoked';
    console.log(`[RoleAssignmentService] Revoked credential ${credentialId}: ${reason}`);
  }

  /**
   * Get active credentials for person
   */
  getActiveCredentials(personId: string): RoleCredential[] {
    return Array.from(this.issuedCredentials.values()).filter(
      c => c.personId === personId && c.status === 'active'
    );
  }

  /**
   * Helper: Convert institution type to tier
   */
  private institutionTypeToTier(type: InstitutionType): Tier {
    switch (type) {
      case InstitutionType.HOME:
        return Tier.HOME;
      case InstitutionType.ELEMENTARY_SCHOOL:
        return Tier.ELEMENTARY;
      case InstitutionType.HIGH_SCHOOL:
        return Tier.HIGH_SCHOOL;
      case InstitutionType.UNIVERSITY:
        return Tier.UNIVERSITY;
      default:
        return Tier.CAREER;
    }
  }

  /**
   * Helper: Convert institution type to enrollment type
   */
  private institutionTypeToEnrollmentType(type: InstitutionType): EnrollmentProof['institutionType'] {
    switch (type) {
      case InstitutionType.HOME:
        return 'home';
      case InstitutionType.ELEMENTARY_SCHOOL:
        return 'elementary';
      case InstitutionType.HIGH_SCHOOL:
        return 'high_school';
      case InstitutionType.UNIVERSITY:
        return 'university';
      default:
        return 'employer';
    }
  }

  /**
   * Generate cryptographic signature (placeholder)
   */
  private generateSignature(personId: string, roleId: string, institutionId: string): string {
    // TODO: Implement proper cryptographic signing
    return `sig-${personId}-${roleId}-${institutionId}-${Date.now()}`;
  }
}

/**
 * Example: Tech company role assignments
 */
export function createTechCompanyOffering(companyId: string, companyName: string): InstitutionRoleOffering {
  return {
    institutionId: companyId,
    institutionName: companyName,
    institutionType: InstitutionType.TECH_COMPANY,
    availableRoles: [
      {
        roleId: 'software_engineer',
        requirements: {
          minimumTier: Tier.CAREER,
          requiredQualifications: ['university_degree_cs', 'portfolio'],
          requiredExperience: [],
        },
        onboarding: {
          duration: 14,
          training: ['codebase_tour', 'development_environment', 'team_introduction'],
          mentorship: true,
        },
      },
      {
        roleId: 'manager',
        requirements: {
          minimumTier: Tier.CAREER,
          requiredQualifications: ['university_degree', 'leadership_experience'],
          requiredExperience: ['3_years_industry'],
        },
        onboarding: {
          duration: 7,
          training: ['team_management', 'company_policies', 'strategic_planning'],
          mentorship: false,
        },
      },
    ],
  };
}

/**
 * Example: Hospital role assignments
 */
export function createHospitalOffering(hospitalId: string, hospitalName: string): InstitutionRoleOffering {
  return {
    institutionId: hospitalId,
    institutionName: hospitalName,
    institutionType: InstitutionType.HOSPITAL,
    availableRoles: [
      {
        roleId: 'doctor',
        requirements: {
          minimumTier: Tier.CAREER,
          requiredQualifications: ['medical_degree', 'medical_license', 'residency_completion'],
          requiredExperience: [],
        },
        onboarding: {
          duration: 30,
          training: ['hospital_systems', 'patient_protocols', 'emergency_procedures'],
          mentorship: true,
        },
      },
    ],
  };
}
