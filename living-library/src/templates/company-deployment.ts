/**
 * Company Living Library Deployment System
 *
 * Companies deploy their own Living Library server using industry templates.
 *
 * Deployment Flow:
 * 1. Company chooses industry template (tech, healthcare, manufacturing, etc.)
 * 2. Customizes organizational structure and roles
 * 3. Deploys self-hosted Living Library server
 * 4. Employees join company
 * 5. Living Library issues role credentials
 * 6. Employee AIs activate with company roles
 * 7. Employees progress through career hierarchy
 *
 * Example:
 * - TechCorp deploys tech industry template
 * - Alice joins as Software Engineer (IC level)
 * - Alice's AI receives "software_engineer" credential
 * - Alice's AI unlocks: develop_software, research, collaborate capabilities
 * - After 3 years, Alice promoted to Senior Engineer (Team Lead level)
 * - Alice's AI receives new credential, unlocks: teach, architect_systems
 * - Alice's AI can now mentor junior engineers
 */

import {
  IndustryTemplate,
  HierarchyLevel,
  RoleHierarchy,
  getIndustryTemplate,
  getRoleByLevel,
  getCareerPath,
  canPromote,
} from './industry-templates';

import {
  RoleCredential,
  RoleAssignmentService,
  InstitutionType,
  InstitutionRoleOffering,
} from '../gating/role-assignment';

import {
  PersonaSpec,
  buildAdultPersona,
} from '../gating/persona-builder';

import { Tier, EnrollmentProof } from '../gating/tier-system';

/**
 * Company configuration
 */
export interface CompanyConfig {
  companyId: string;
  companyName: string;
  industryTemplateId: string;
  customizations: {
    // Override role names
    roleNameOverrides?: Record<string, string>;

    // Add custom roles beyond template
    additionalRoles?: RoleHierarchy[];

    // Modify hierarchy levels
    skipLevels?: HierarchyLevel[];  // Skip certain levels

    // Custom knowledge domains
    additionalDomains?: string[];
  };
}

/**
 * Employee record
 */
export interface EmployeeRecord {
  employeeId: string;
  personId: string;
  companyId: string;

  // Current position
  currentRole: RoleHierarchy;
  currentLevel: HierarchyLevel;
  department?: string;
  manager?: string;  // Employee ID of manager

  // Career progression
  hireDate: Date;
  promotions: {
    fromLevel: HierarchyLevel;
    toLevel: HierarchyLevel;
    date: Date;
    reason: string;
  }[];

  // Credentials
  credentials: RoleCredential[];

  // Performance
  performance: {
    rating: number;  // 1-5
    period: string;
    date: Date;
  }[];
}

/**
 * Company Living Library Deployment
 */
export class CompanyLivingLibrary {
  private config: CompanyConfig;
  private template: IndustryTemplate;
  private employees: Map<string, EmployeeRecord>;
  private roleAssignmentService: RoleAssignmentService;

  constructor(config: CompanyConfig) {
    this.config = config;

    const template = getIndustryTemplate(config.industryTemplateId);
    if (!template) {
      throw new Error(`Industry template not found: ${config.industryTemplateId}`);
    }
    this.template = template;

    this.employees = new Map();
    this.roleAssignmentService = new RoleAssignmentService();

    // Register company with role assignment service
    this.registerCompany();
  }

  /**
   * Register company as institution offering roles
   */
  private registerCompany(): void {
    const offering: InstitutionRoleOffering = {
      institutionId: this.config.companyId,
      institutionName: this.config.companyName,
      institutionType: this.getInstitutionType(),
      availableRoles: this.template.roles.map(roleHierarchy => ({
        roleId: roleHierarchy.roleId,
        requirements: {
          minimumTier: Tier.CAREER,
          requiredQualifications: this.getQualificationsForLevel(roleHierarchy.level),
          requiredExperience: this.getExperienceForLevel(roleHierarchy.level),
        },
        onboarding: {
          duration: this.getOnboardingDuration(roleHierarchy.level),
          training: this.getTrainingForRole(roleHierarchy.roleId),
          mentorship: roleHierarchy.level <= HierarchyLevel.TEAM_LEAD,
        },
      })),
    };

    this.roleAssignmentService.registerInstitution(offering);
    console.log(`[CompanyLivingLibrary] Registered ${this.config.companyName} with ${offering.availableRoles.length} roles`);
  }

  /**
   * Hire new employee
   */
  async hireEmployee(
    personId: string,
    roleId: string,
    level: HierarchyLevel,
    department?: string,
    managerId?: string
  ): Promise<EmployeeRecord> {
    // Find role in template
    const roleHierarchy = this.template.roles.find(r => r.roleId === roleId && r.level === level);
    if (!roleHierarchy) {
      throw new Error(`Role ${roleId} at level ${level} not found in template`);
    }

    // Issue credential via Living Library
    const credential = await this.issueCredential(personId, roleId, level);

    // Create employee record
    const employee: EmployeeRecord = {
      employeeId: `emp-${Date.now()}`,
      personId,
      companyId: this.config.companyId,
      currentRole: roleHierarchy,
      currentLevel: level,
      department,
      manager: managerId,
      hireDate: new Date(),
      promotions: [],
      credentials: [credential],
      performance: [],
    };

    this.employees.set(employee.employeeId, employee);

    console.log(`[CompanyLivingLibrary] Hired ${personId} as ${roleHierarchy.role.roleName} at ${this.config.companyName}`);

    return employee;
  }

  /**
   * Issue role credential to employee
   */
  private async issueCredential(
    personId: string,
    roleId: string,
    level: HierarchyLevel
  ): Promise<RoleCredential> {
    const requestResult = await this.roleAssignmentService.requestRole({
      requestId: `req-${Date.now()}`,
      personId,
      requestedRoleId: roleId,
      institutionId: this.config.companyId,
      qualifications: this.getQualificationsForLevel(level),
      timestamp: new Date(),
    });

    if (!requestResult.approved || !requestResult.credential) {
      throw new Error(`Role assignment failed: ${requestResult.reason}`);
    }

    return requestResult.credential;
  }

  /**
   * Promote employee
   */
  async promoteEmployee(
    employeeId: string,
    targetLevel: HierarchyLevel,
    reason: string
  ): Promise<EmployeeRecord> {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Validate promotion
    if (!canPromote(this.template.industryId, employee.currentLevel, targetLevel)) {
      throw new Error('Invalid promotion - must be sequential');
    }

    // Find new role at target level
    const newRole = getRoleByLevel(this.template.industryId, targetLevel);
    if (!newRole) {
      throw new Error(`No role found at level ${targetLevel}`);
    }

    // Issue new credential
    const newCredential = await this.issueCredential(
      employee.personId,
      newRole.roleId,
      targetLevel
    );

    // Record promotion
    employee.promotions.push({
      fromLevel: employee.currentLevel,
      toLevel: targetLevel,
      date: new Date(),
      reason,
    });

    // Update current position
    employee.currentLevel = targetLevel;
    employee.currentRole = newRole;
    employee.credentials.push(newCredential);

    console.log(`[CompanyLivingLibrary] Promoted ${employee.personId} to ${newRole.role.roleName}`);

    return employee;
  }

  /**
   * Get employee's AI persona with current credentials
   */
  async getEmployeePersona(employeeId: string): Promise<PersonaSpec> {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Get active credentials
    const activeCredentials = employee.credentials.filter(c => c.status === 'active');

    // Build persona with all active credentials
    const enrollmentProof: EnrollmentProof = {
      studentId: employee.personId,
      institutionId: this.config.companyId,
      institutionType: 'employer',
      tier: Tier.CAREER,
      enrollmentDate: employee.hireDate,
      signature: activeCredentials[0].signature,
      gatekeeperId: activeCredentials[0].gatekeeperId,
    };

    return buildAdultPersona(
      employee.personId,
      employee.currentRole.roleId,
      [enrollmentProof]
    );
  }

  /**
   * Get career path for employee
   */
  getEmployeeCareerPath(employeeId: string): RoleHierarchy[] {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    return getCareerPath(this.template.industryId, employee.currentLevel);
  }

  /**
   * Get org chart (reports structure)
   */
  getOrgChart(): Map<HierarchyLevel, EmployeeRecord[]> {
    const chart = new Map<HierarchyLevel, EmployeeRecord[]>();

    for (const employee of this.employees.values()) {
      const levelEmployees = chart.get(employee.currentLevel) || [];
      levelEmployees.push(employee);
      chart.set(employee.currentLevel, levelEmployees);
    }

    return chart;
  }

  /**
   * Get direct reports for manager
   */
  getDirectReports(managerId: string): EmployeeRecord[] {
    return Array.from(this.employees.values()).filter(e => e.manager === managerId);
  }

  /**
   * Terminate employee
   */
  async terminateEmployee(employeeId: string, reason: string): Promise<void> {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Revoke all credentials
    for (const credential of employee.credentials) {
      await this.roleAssignmentService.revokeCredential(credential.credentialId, reason);
    }

    this.employees.delete(employeeId);
    console.log(`[CompanyLivingLibrary] Terminated employee ${employeeId}: ${reason}`);
  }

  /**
   * Helper: Get institution type from industry
   */
  private getInstitutionType(): InstitutionType {
    switch (this.template.industryId) {
      case 'technology':
        return InstitutionType.TECH_COMPANY;
      case 'healthcare':
        return InstitutionType.HOSPITAL;
      case 'manufacturing':
        return InstitutionType.MANUFACTURING;
      default:
        return InstitutionType.CUSTOM;
    }
  }

  /**
   * Helper: Get qualifications required for level
   */
  private getQualificationsForLevel(level: HierarchyLevel): string[] {
    switch (level) {
      case HierarchyLevel.INDIVIDUAL_CONTRIBUTOR:
        return ['university_degree', 'portfolio'];
      case HierarchyLevel.TEAM_LEAD:
        return ['university_degree', '2_years_experience'];
      case HierarchyLevel.MANAGER:
        return ['university_degree', '5_years_experience', 'leadership'];
      case HierarchyLevel.SENIOR_MANAGER:
        return ['university_degree', '8_years_experience', 'proven_leadership'];
      case HierarchyLevel.EXECUTIVE:
        return ['university_degree', '12_years_experience', 'executive_presence'];
      case HierarchyLevel.C_LEVEL:
        return ['university_degree', '15_years_experience', 'c_level_experience'];
      case HierarchyLevel.CEO:
        return ['university_degree', '20_years_experience', 'ceo_experience'];
      default:
        return [];
    }
  }

  /**
   * Helper: Get experience required for level
   */
  private getExperienceForLevel(level: HierarchyLevel): string[] {
    if (level === HierarchyLevel.INDIVIDUAL_CONTRIBUTOR) return [];
    if (level <= HierarchyLevel.TEAM_LEAD) return ['2_years_industry'];
    if (level <= HierarchyLevel.MANAGER) return ['5_years_industry'];
    if (level <= HierarchyLevel.SENIOR_MANAGER) return ['8_years_industry'];
    if (level <= HierarchyLevel.EXECUTIVE) return ['12_years_industry'];
    return ['15_years_industry'];
  }

  /**
   * Helper: Get onboarding duration
   */
  private getOnboardingDuration(level: HierarchyLevel): number {
    if (level <= HierarchyLevel.TEAM_LEAD) return 14;  // 2 weeks
    if (level <= HierarchyLevel.MANAGER) return 7;     // 1 week
    return 3;  // 3 days for executives
  }

  /**
   * Helper: Get training for role
   */
  private getTrainingForRole(roleId: string): string[] {
    // Generic training, can be customized per company
    return [
      'company_culture',
      'tools_and_systems',
      'team_introduction',
      'role_specific_training',
    ];
  }

  /**
   * Get company statistics
   */
  getStatistics(): {
    totalEmployees: number;
    byLevel: Record<HierarchyLevel, number>;
    averageTenure: number;
    promotionRate: number;
  } {
    const byLevel: Record<HierarchyLevel, number> = {
      [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR]: 0,
      [HierarchyLevel.TEAM_LEAD]: 0,
      [HierarchyLevel.MANAGER]: 0,
      [HierarchyLevel.SENIOR_MANAGER]: 0,
      [HierarchyLevel.EXECUTIVE]: 0,
      [HierarchyLevel.C_LEVEL]: 0,
      [HierarchyLevel.CEO]: 0,
    };

    let totalTenure = 0;
    let totalPromotions = 0;

    for (const employee of this.employees.values()) {
      byLevel[employee.currentLevel]++;
      totalTenure += Date.now() - employee.hireDate.getTime();
      totalPromotions += employee.promotions.length;
    }

    return {
      totalEmployees: this.employees.size,
      byLevel,
      averageTenure: this.employees.size > 0 ? totalTenure / this.employees.size / (1000 * 60 * 60 * 24 * 365) : 0,  // years
      promotionRate: this.employees.size > 0 ? totalPromotions / this.employees.size : 0,
    };
  }
}

/**
 * Example: Deploy TechCorp Living Library
 */
export function deployTechCorp(): CompanyLivingLibrary {
  const config: CompanyConfig = {
    companyId: 'techcorp-001',
    companyName: 'TechCorp Inc.',
    industryTemplateId: 'technology',
    customizations: {
      roleNameOverrides: {
        software_engineer: 'Software Development Engineer',
      },
      additionalDomains: ['techcorp_proprietary_systems'],
    },
  };

  return new CompanyLivingLibrary(config);
}

/**
 * Example: Deploy Hospital Living Library
 */
export function deployHospital(): CompanyLivingLibrary {
  const config: CompanyConfig = {
    companyId: 'hospital-001',
    companyName: 'City General Hospital',
    industryTemplateId: 'healthcare',
    customizations: {
      additionalDomains: ['hospital_protocols', 'emergency_medicine'],
    },
  };

  return new CompanyLivingLibrary(config);
}
