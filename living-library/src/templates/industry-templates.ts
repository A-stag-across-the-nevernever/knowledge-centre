/**
 * Industry-Specific Living Library Templates
 *
 * Each industry (tech, healthcare, education, manufacturing, finance, etc.)
 * has a templated Living Library structure with:
 * - Hierarchical role structures (employee → manager → director → VP → CEO)
 * - Industry-specific capabilities and knowledge domains
 * - Career progression paths
 * - Organizational knowledge graphs
 *
 * When a company deploys a Living Library, they:
 * 1. Choose industry template
 * 2. Customize roles and hierarchy
 * 3. Deploy Living Library server
 * 4. Issue role credentials to employees
 * 5. Employee AIs activate with company roles
 */

import {
  BaseRole,
  RoleCapability,
  CAPABILITIES,
  LifeStage,
} from '../gating/role-system';

import { Tier } from '../gating/tier-system';

/**
 * Organizational hierarchy levels
 * Universal across all industries
 */
export enum HierarchyLevel {
  INDIVIDUAL_CONTRIBUTOR = 0,  // IC, Staff, Specialist
  TEAM_LEAD = 1,               // Team Lead, Senior Staff
  MANAGER = 2,                 // Manager, Principal
  SENIOR_MANAGER = 3,          // Senior Manager, Director
  EXECUTIVE = 4,               // VP, SVP
  C_LEVEL = 5,                 // CTO, CFO, COO
  CEO = 6,                     // CEO, President
}

/**
 * Role hierarchy
 * Defines progression paths within an organization
 */
export interface RoleHierarchy {
  level: HierarchyLevel;
  roleId: string;
  role: BaseRole;
  reportsTo?: HierarchyLevel;  // Which level does this report to?
  manages?: HierarchyLevel[];  // Which levels does this manage?
}

/**
 * Industry template
 * Complete organizational structure for an industry
 */
export interface IndustryTemplate {
  industryId: string;
  industryName: string;
  description: string;

  // Role hierarchy
  roles: RoleHierarchy[];

  // Industry-specific knowledge domains
  knowledgeDomains: string[];

  // Living Library celestial structure
  celestialMapping: {
    domain: string;
    raRange: [number, number];
    decRange: [number, number];
    altRange: [number, number];
  }[];

  // Default capabilities by level
  capabilitiesByLevel: Record<HierarchyLevel, RoleCapability[]>;
}

/**
 * ===================
 * TECHNOLOGY INDUSTRY
 * ===================
 */

const TECH_CAPABILITIES_BY_LEVEL: Record<HierarchyLevel, RoleCapability[]> = {
  [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR]: [
    CAPABILITIES.DEVELOP_SOFTWARE,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.COMMUNICATE,
    CAPABILITIES.COLLABORATE,
  ],
  [HierarchyLevel.TEAM_LEAD]: [
    CAPABILITIES.DEVELOP_SOFTWARE,
    CAPABILITIES.ARCHITECT_SYSTEMS,
    CAPABILITIES.RESEARCH,
    CAPABILITIES.TEACH,
    CAPABILITIES.COMMUNICATE,
    CAPABILITIES.COLLABORATE,
  ],
  [HierarchyLevel.MANAGER]: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.ARCHITECT_SYSTEMS,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.COMMUNICATE,
  ],
  [HierarchyLevel.SENIOR_MANAGER]: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.FINANCIAL_ANALYSIS,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.COMMUNICATE,
  ],
  [HierarchyLevel.EXECUTIVE]: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.FINANCIAL_ANALYSIS,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.ESCALATE,
    CAPABILITIES.COMMUNICATE,
  ],
  [HierarchyLevel.C_LEVEL]: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.FINANCIAL_ANALYSIS,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.ESCALATE,
    CAPABILITIES.SET_POLICY,
    CAPABILITIES.COMMUNICATE,
  ],
  [HierarchyLevel.CEO]: [
    CAPABILITIES.MANAGE_TEAM,
    CAPABILITIES.STRATEGIC_PLANNING,
    CAPABILITIES.FINANCIAL_ANALYSIS,
    CAPABILITIES.NEGOTIATE,
    CAPABILITIES.ADVOCATE,
    CAPABILITIES.ESCALATE,
    CAPABILITIES.SET_POLICY,
    CAPABILITIES.COMMUNICATE,
  ],
};

export const TECH_INDUSTRY_TEMPLATE: IndustryTemplate = {
  industryId: 'technology',
  industryName: 'Technology',
  description: 'Software, hardware, and technology services',

  knowledgeDomains: [
    'programming',
    'algorithms',
    'systems',
    'databases',
    'networking',
    'security',
    'ai_ml',
    'cloud',
    'devops',
    'product_management',
  ],

  celestialMapping: [
    { domain: 'programming', raRange: [270, 280], decRange: [30, 45], altRange: [0, 50] },
    { domain: 'algorithms', raRange: [280, 290], decRange: [30, 45], altRange: [0, 50] },
    { domain: 'systems', raRange: [290, 300], decRange: [30, 45], altRange: [0, 50] },
    { domain: 'ai_ml', raRange: [300, 310], decRange: [30, 45], altRange: [50, 100] },
  ],

  capabilitiesByLevel: TECH_CAPABILITIES_BY_LEVEL,

  roles: [
    {
      level: HierarchyLevel.INDIVIDUAL_CONTRIBUTOR,
      roleId: 'software_engineer',
      role: {
        roleId: 'software_engineer',
        roleName: 'Software Engineer',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Individual contributor software engineer',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.INDIVIDUAL_CONTRIBUTOR],
        domainExpertise: ['programming', 'algorithms'],
        p12Role: 'none',
        responseProfile: {
          tone: 'precise and technical',
          formality: 0.5,
          verbosity: 0.6,
          empathy: 0.5,
        },
      },
      reportsTo: HierarchyLevel.MANAGER,
    },
    {
      level: HierarchyLevel.TEAM_LEAD,
      roleId: 'senior_engineer',
      role: {
        roleId: 'senior_engineer',
        roleName: 'Senior Software Engineer',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Technical lead and mentor',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.TEAM_LEAD],
        domainExpertise: ['programming', 'algorithms', 'systems', 'architecture'],
        p12Role: 'none',
        responseProfile: {
          tone: 'authoritative and technical',
          formality: 0.6,
          verbosity: 0.7,
          empathy: 0.6,
        },
      },
      reportsTo: HierarchyLevel.MANAGER,
      manages: [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR],
    },
    {
      level: HierarchyLevel.MANAGER,
      roleId: 'engineering_manager',
      role: {
        roleId: 'engineering_manager',
        roleName: 'Engineering Manager',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Manages engineering team',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.MANAGER],
        domainExpertise: ['management', 'systems', 'product'],
        p12Role: 'none',
        responseProfile: {
          tone: 'directive and supportive',
          formality: 0.7,
          verbosity: 0.7,
          empathy: 0.7,
        },
      },
      reportsTo: HierarchyLevel.SENIOR_MANAGER,
      manages: [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR, HierarchyLevel.TEAM_LEAD],
    },
    {
      level: HierarchyLevel.SENIOR_MANAGER,
      roleId: 'director_engineering',
      role: {
        roleId: 'director_engineering',
        roleName: 'Director of Engineering',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Leads multiple engineering teams',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.SENIOR_MANAGER],
        domainExpertise: ['management', 'strategy', 'product', 'business'],
        p12Role: 'none',
        responseProfile: {
          tone: 'strategic and decisive',
          formality: 0.75,
          verbosity: 0.65,
          empathy: 0.6,
        },
      },
      reportsTo: HierarchyLevel.EXECUTIVE,
      manages: [HierarchyLevel.MANAGER],
    },
    {
      level: HierarchyLevel.EXECUTIVE,
      roleId: 'vp_engineering',
      role: {
        roleId: 'vp_engineering',
        roleName: 'VP of Engineering',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Leads entire engineering organization',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.EXECUTIVE],
        domainExpertise: ['management', 'strategy', 'business', 'finance'],
        p12Role: 'none',
        responseProfile: {
          tone: 'strategic and authoritative',
          formality: 0.8,
          verbosity: 0.6,
          empathy: 0.55,
        },
      },
      reportsTo: HierarchyLevel.C_LEVEL,
      manages: [HierarchyLevel.SENIOR_MANAGER],
    },
    {
      level: HierarchyLevel.C_LEVEL,
      roleId: 'cto',
      role: {
        roleId: 'cto',
        roleName: 'Chief Technology Officer',
        roleCategory: 'technology',
        lifeStage: LifeStage.ADULT,
        description: 'Executive technology leadership',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.C_LEVEL],
        domainExpertise: ['technology', 'strategy', 'business', 'finance', 'innovation'],
        p12Role: 'none',
        responseProfile: {
          tone: 'visionary and decisive',
          formality: 0.85,
          verbosity: 0.65,
          empathy: 0.5,
        },
      },
      reportsTo: HierarchyLevel.CEO,
      manages: [HierarchyLevel.EXECUTIVE],
    },
    {
      level: HierarchyLevel.CEO,
      roleId: 'ceo',
      role: {
        roleId: 'ceo',
        roleName: 'Chief Executive Officer',
        roleCategory: 'business',
        lifeStage: LifeStage.ADULT,
        description: 'Company leadership',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: TECH_CAPABILITIES_BY_LEVEL[HierarchyLevel.CEO],
        domainExpertise: ['leadership', 'strategy', 'business', 'finance', 'vision'],
        p12Role: 'none',
        responseProfile: {
          tone: 'visionary and commanding',
          formality: 0.9,
          verbosity: 0.6,
          empathy: 0.5,
        },
      },
      manages: [HierarchyLevel.C_LEVEL],
    },
  ],
};

/**
 * ===================
 * HEALTHCARE INDUSTRY
 * ===================
 */

export const HEALTHCARE_INDUSTRY_TEMPLATE: IndustryTemplate = {
  industryId: 'healthcare',
  industryName: 'Healthcare',
  description: 'Medical services and healthcare delivery',

  knowledgeDomains: [
    'medicine',
    'anatomy',
    'pharmacology',
    'surgery',
    'diagnostics',
    'patient_care',
    'medical_ethics',
    'healthcare_management',
  ],

  celestialMapping: [
    { domain: 'medicine', raRange: [190, 210], decRange: [-20, 0], altRange: [0, 100] },
    { domain: 'surgery', raRange: [210, 220], decRange: [-20, 0], altRange: [0, 100] },
    { domain: 'patient_care', raRange: [220, 230], decRange: [-20, 0], altRange: [0, 50] },
  ],

  capabilitiesByLevel: {
    [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR]: [
      CAPABILITIES.DIAGNOSE,
      CAPABILITIES.PRESCRIBE,
      CAPABILITIES.COUNSEL_MEDICAL,
      CAPABILITIES.RESEARCH,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.TEAM_LEAD]: [
      CAPABILITIES.DIAGNOSE,
      CAPABILITIES.PRESCRIBE,
      CAPABILITIES.COUNSEL_MEDICAL,
      CAPABILITIES.TEACH,
      CAPABILITIES.RESEARCH,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.MANAGER]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.DIAGNOSE,
      CAPABILITIES.TEACH,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.SENIOR_MANAGER]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.EXECUTIVE]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.ADVOCATE,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.C_LEVEL]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.SET_POLICY,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.CEO]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.SET_POLICY,
      CAPABILITIES.COMMUNICATE,
    ],
  },

  roles: [
    {
      level: HierarchyLevel.INDIVIDUAL_CONTRIBUTOR,
      roleId: 'doctor',
      role: {
        roleId: 'doctor',
        roleName: 'Physician',
        roleCategory: 'healthcare',
        lifeStage: LifeStage.ADULT,
        description: 'Medical doctor',
        minimumTier: Tier.CAREER,
        defaultTier: Tier.CAREER,
        capabilities: [
          CAPABILITIES.DIAGNOSE,
          CAPABILITIES.PRESCRIBE,
          CAPABILITIES.COUNSEL_MEDICAL,
          CAPABILITIES.RESEARCH,
          CAPABILITIES.COMMUNICATE,
        ],
        domainExpertise: ['medicine', 'diagnostics', 'patient_care'],
        p12Role: 'none',
        responseProfile: {
          tone: 'professional and reassuring',
          formality: 0.75,
          verbosity: 0.7,
          empathy: 0.8,
        },
      },
      reportsTo: HierarchyLevel.MANAGER,
    },
    // Add more healthcare roles...
  ],
};

/**
 * ===================
 * MANUFACTURING INDUSTRY
 * ===================
 */

export const MANUFACTURING_INDUSTRY_TEMPLATE: IndustryTemplate = {
  industryId: 'manufacturing',
  industryName: 'Manufacturing',
  description: 'Production and manufacturing operations',

  knowledgeDomains: [
    'production',
    'quality_control',
    'supply_chain',
    'logistics',
    'safety',
    'operations',
    'lean_manufacturing',
  ],

  celestialMapping: [
    { domain: 'production', raRange: [150, 170], decRange: [-40, -20], altRange: [0, 50] },
    { domain: 'quality_control', raRange: [170, 180], decRange: [-40, -20], altRange: [0, 50] },
  ],

  capabilitiesByLevel: {
    // Similar structure to tech industry
    [HierarchyLevel.INDIVIDUAL_CONTRIBUTOR]: [
      CAPABILITIES.RESEARCH,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.TEAM_LEAD]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.RESEARCH,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.MANAGER]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.SENIOR_MANAGER]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.EXECUTIVE]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.NEGOTIATE,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.C_LEVEL]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.SET_POLICY,
      CAPABILITIES.COMMUNICATE,
    ],
    [HierarchyLevel.CEO]: [
      CAPABILITIES.MANAGE_TEAM,
      CAPABILITIES.STRATEGIC_PLANNING,
      CAPABILITIES.FINANCIAL_ANALYSIS,
      CAPABILITIES.SET_POLICY,
      CAPABILITIES.COMMUNICATE,
    ],
  },

  roles: [
    // Define manufacturing-specific roles
  ],
};

/**
 * Template Registry
 */
export const INDUSTRY_TEMPLATE_REGISTRY: Record<string, IndustryTemplate> = {
  technology: TECH_INDUSTRY_TEMPLATE,
  healthcare: HEALTHCARE_INDUSTRY_TEMPLATE,
  manufacturing: MANUFACTURING_INDUSTRY_TEMPLATE,
  // Add more industries...
};

/**
 * Get industry template
 */
export function getIndustryTemplate(industryId: string): IndustryTemplate | undefined {
  return INDUSTRY_TEMPLATE_REGISTRY[industryId];
}

/**
 * Get all available industry templates
 */
export function getAllIndustryTemplates(): IndustryTemplate[] {
  return Object.values(INDUSTRY_TEMPLATE_REGISTRY);
}

/**
 * Get role by hierarchy level within industry
 */
export function getRoleByLevel(industryId: string, level: HierarchyLevel): RoleHierarchy | undefined {
  const template = getIndustryTemplate(industryId);
  if (!template) return undefined;

  return template.roles.find(r => r.level === level);
}

/**
 * Get career progression path
 */
export function getCareerPath(industryId: string, currentLevel: HierarchyLevel): RoleHierarchy[] {
  const template = getIndustryTemplate(industryId);
  if (!template) return [];

  return template.roles.filter(r => r.level > currentLevel).sort((a, b) => a.level - b.level);
}

/**
 * Check if promotion is possible
 */
export function canPromote(industryId: string, currentLevel: HierarchyLevel, targetLevel: HierarchyLevel): boolean {
  const template = getIndustryTemplate(industryId);
  if (!template) return false;

  // Must be sequential promotion (one level at a time)
  return targetLevel === currentLevel + 1;
}
