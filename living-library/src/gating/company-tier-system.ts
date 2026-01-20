/**
 * Company Tier System
 *
 * Just like educational institutions have tiers (Home → Elementary → High School → University),
 * companies have tiers based on size, maturity, and organizational complexity.
 *
 * Company Tiers:
 *   0 - Solo/Freelance - Individual professional (1 person)
 *   1 - Startup - Small team (2-10 people)
 *   2 - Small Business - Growing organization (11-50 people)
 *   3 - Mid-Market - Established company (51-500 people)
 *   4 - Enterprise - Large corporation (501-5000 people)
 *   5 - Global Enterprise - Multinational corporation (5000+ people)
 *
 * Each tier unlocks:
 * - More hierarchical role levels
 * - More sophisticated knowledge organization
 * - More Living Library features (now domain-named: Neural Nexus, Medical Codex, etc.)
 * - More Gatekeeper capabilities
 */

/**
 * Company tier levels
 */
export enum CompanyTier {
  SOLO = 0,           // 1 person - freelancer, consultant, solo practitioner
  STARTUP = 1,        // 2-10 people - early stage startup
  SMALL_BUSINESS = 2, // 11-50 people - small business
  MID_MARKET = 3,     // 51-500 people - mid-market company
  ENTERPRISE = 4,     // 501-5000 people - large enterprise
  GLOBAL = 5,         // 5000+ people - global corporation
}

/**
 * Company tier metadata
 */
export interface CompanyTierMetadata {
  tier: CompanyTier;
  name: string;
  employeeRange: [number, number | null]; // null = unlimited
  description: string;

  // Organizational capabilities unlocked at this tier
  maxHierarchyLevels: number;  // How many levels of management allowed
  maxDepartments: number;      // How many departments/divisions
  maxLocations: number;        // How many physical locations

  // Living Library / Domain System capabilities
  knowledgeRepoSize: number;   // GB of knowledge storage
  celestialAltitudeRange: [number, number]; // What altitude range accessible
  customRolesAllowed: number;  // How many custom roles beyond template

  // Gatekeeper capabilities
  gatekeeperFederation: boolean;  // Can federate with other companies?
  crossCompanyNegotiation: boolean; // Can negotiate across companies?
  globalPolicyManagement: boolean;  // Can set global policies?

  // Feature flags
  features: {
    multiRegion: boolean;
    advancedAnalytics: boolean;
    customIntegrations: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    dedicatedSupport: boolean;
  };
}

/**
 * Company tier configurations
 */
export const COMPANY_TIER_CONFIG: Record<CompanyTier, CompanyTierMetadata> = {
  [CompanyTier.SOLO]: {
    tier: CompanyTier.SOLO,
    name: 'Solo/Freelance',
    employeeRange: [1, 1],
    description: 'Individual professional, freelancer, or consultant',

    maxHierarchyLevels: 1,  // Just you
    maxDepartments: 1,
    maxLocations: 1,

    knowledgeRepoSize: 10,  // 10 GB
    celestialAltitudeRange: [0, 5],
    customRolesAllowed: 3,

    gatekeeperFederation: false,
    crossCompanyNegotiation: false,
    globalPolicyManagement: false,

    features: {
      multiRegion: false,
      advancedAnalytics: false,
      customIntegrations: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedSupport: false,
    },
  },

  [CompanyTier.STARTUP]: {
    tier: CompanyTier.STARTUP,
    name: 'Startup',
    employeeRange: [2, 10],
    description: 'Early stage startup with small team',

    maxHierarchyLevels: 2,  // IC + Founder/CEO
    maxDepartments: 3,
    maxLocations: 1,

    knowledgeRepoSize: 50,  // 50 GB
    celestialAltitudeRange: [0, 8],
    customRolesAllowed: 5,

    gatekeeperFederation: true,  // Can federate with partners
    crossCompanyNegotiation: false,
    globalPolicyManagement: false,

    features: {
      multiRegion: false,
      advancedAnalytics: true,
      customIntegrations: false,
      apiAccess: true,
      whiteLabel: false,
      dedicatedSupport: false,
    },
  },

  [CompanyTier.SMALL_BUSINESS]: {
    tier: CompanyTier.SMALL_BUSINESS,
    name: 'Small Business',
    employeeRange: [11, 50],
    description: 'Growing small business with multiple teams',

    maxHierarchyLevels: 3,  // IC + Manager + Founder/CEO
    maxDepartments: 5,
    maxLocations: 2,

    knowledgeRepoSize: 200,  // 200 GB
    celestialAltitudeRange: [0, 12],
    customRolesAllowed: 10,

    gatekeeperFederation: true,
    crossCompanyNegotiation: true,
    globalPolicyManagement: false,

    features: {
      multiRegion: false,
      advancedAnalytics: true,
      customIntegrations: true,
      apiAccess: true,
      whiteLabel: false,
      dedicatedSupport: false,
    },
  },

  [CompanyTier.MID_MARKET]: {
    tier: CompanyTier.MID_MARKET,
    name: 'Mid-Market',
    employeeRange: [51, 500],
    description: 'Established mid-market company with departments',

    maxHierarchyLevels: 5,  // IC + Manager + Director + VP + CEO
    maxDepartments: 10,
    maxLocations: 5,

    knowledgeRepoSize: 1000,  // 1 TB
    celestialAltitudeRange: [0, 16],
    customRolesAllowed: 20,

    gatekeeperFederation: true,
    crossCompanyNegotiation: true,
    globalPolicyManagement: true,

    features: {
      multiRegion: true,
      advancedAnalytics: true,
      customIntegrations: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedSupport: true,
    },
  },

  [CompanyTier.ENTERPRISE]: {
    tier: CompanyTier.ENTERPRISE,
    name: 'Enterprise',
    employeeRange: [501, 5000],
    description: 'Large enterprise with multiple divisions',

    maxHierarchyLevels: 7,  // Full hierarchy IC → CEO
    maxDepartments: 50,
    maxLocations: 20,

    knowledgeRepoSize: 5000,  // 5 TB
    celestialAltitudeRange: [0, 18],
    customRolesAllowed: 50,

    gatekeeperFederation: true,
    crossCompanyNegotiation: true,
    globalPolicyManagement: true,

    features: {
      multiRegion: true,
      advancedAnalytics: true,
      customIntegrations: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedSupport: true,
    },
  },

  [CompanyTier.GLOBAL]: {
    tier: CompanyTier.GLOBAL,
    name: 'Global Enterprise',
    employeeRange: [5001, null],
    description: 'Multinational corporation with global operations',

    maxHierarchyLevels: 7,  // Full hierarchy
    maxDepartments: 999,    // Unlimited
    maxLocations: 999,      // Unlimited

    knowledgeRepoSize: 20000,  // 20 TB
    celestialAltitudeRange: [0, 20],
    customRolesAllowed: 999,   // Unlimited

    gatekeeperFederation: true,
    crossCompanyNegotiation: true,
    globalPolicyManagement: true,

    features: {
      multiRegion: true,
      advancedAnalytics: true,
      customIntegrations: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedSupport: true,
    },
  },
};

/**
 * Determine company tier from employee count
 */
export function determineCompanyTier(employeeCount: number): CompanyTier {
  if (employeeCount === 1) return CompanyTier.SOLO;
  if (employeeCount <= 10) return CompanyTier.STARTUP;
  if (employeeCount <= 50) return CompanyTier.SMALL_BUSINESS;
  if (employeeCount <= 500) return CompanyTier.MID_MARKET;
  if (employeeCount <= 5000) return CompanyTier.ENTERPRISE;
  return CompanyTier.GLOBAL;
}

/**
 * Get tier configuration
 */
export function getCompanyTierConfig(tier: CompanyTier): CompanyTierMetadata {
  return COMPANY_TIER_CONFIG[tier];
}

/**
 * Check if company can unlock next tier
 */
export function canUnlockNextTier(currentTier: CompanyTier, currentEmployeeCount: number): boolean {
  if (currentTier === CompanyTier.GLOBAL) return false; // Already at max

  const nextTier = currentTier + 1;
  const nextTierConfig = COMPANY_TIER_CONFIG[nextTier];

  return currentEmployeeCount >= nextTierConfig.employeeRange[0];
}

/**
 * Company tier unlock proof
 * Similar to enrollment proof for students
 */
export interface CompanyTierProof {
  companyId: string;
  currentTier: CompanyTier;
  targetTier: CompanyTier;
  employeeCount: number;
  verificationDate: Date;
  signature: string;
  gatekeeperId: string;
}

/**
 * Domain naming by company tier
 * Larger companies get more sophisticated naming options
 */
export interface DomainNamingByTier {
  tier: CompanyTier;
  availableNames: {
    primary: string;
    alternatives: string[];
  };
  brandingOptions: {
    customLogo: boolean;
    customColors: boolean;
    whiteLabel: boolean;
  };
}

export function getDomainNamingByTier(
  industryId: string,
  tier: CompanyTier
): DomainNamingByTier {
  const config = COMPANY_TIER_CONFIG[tier];

  // Base naming from nomenclature
  const baseNames: Record<string, { primary: string; alternatives: string[] }> = {
    technology: {
      primary: 'Neural Nexus',
      alternatives: ['Code Collective', 'Tech Forge', 'Digital Commons'],
    },
    healthcare: {
      primary: 'Medical Codex',
      alternatives: ['Healing Archive', 'Clinical Canon', 'Care Collective'],
    },
    manufacturing: {
      primary: 'Forge Network',
      alternatives: ['Industrial Commons', 'Works Repository'],
    },
    // ... etc
  };

  return {
    tier,
    availableNames: baseNames[industryId] || {
      primary: 'Knowledge Nexus',
      alternatives: ['Corporate Commons', 'Enterprise Archive'],
    },
    brandingOptions: {
      customLogo: tier >= CompanyTier.SMALL_BUSINESS,
      customColors: tier >= CompanyTier.SMALL_BUSINESS,
      whiteLabel: config.features.whiteLabel,
    },
  };
}

/**
 * Hierarchy levels allowed by tier
 */
export function getAllowedHierarchyLevels(tier: CompanyTier): number[] {
  const config = COMPANY_TIER_CONFIG[tier];
  return Array.from({ length: config.maxHierarchyLevels }, (_, i) => i);
}

/**
 * Example tier progression:
 *
 * Alice starts as solo freelance developer:
 * - Tier 0 (Solo)
 * - Access to "Neural Nexus" (10GB knowledge)
 * - Can only use predefined roles
 * - No hierarchy (just Alice)
 *
 * Alice hires 3 developers:
 * - Tier 1 (Startup) automatically unlocked
 * - Access to 50GB knowledge
 * - Can now have IC + CEO hierarchy
 * - Can federate with partner companies
 *
 * Company grows to 30 employees:
 * - Tier 2 (Small Business) unlocked
 * - 200GB knowledge
 * - IC + Manager + CEO hierarchy
 * - Custom integrations enabled
 *
 * Company reaches 200 employees:
 * - Tier 3 (Mid-Market) unlocked
 * - 1TB knowledge
 * - Full 5-level hierarchy
 * - Global policy management
 * - White label branding
 *
 * Company IPOs with 2000 employees:
 * - Tier 4 (Enterprise) unlocked
 * - 5TB knowledge
 * - Full 7-level hierarchy
 * - 20 locations
 * - Dedicated support
 *
 * Company becomes Fortune 500 with 50,000 employees:
 * - Tier 5 (Global Enterprise) unlocked
 * - 20TB knowledge
 * - Unlimited departments/locations
 * - Full global operations
 */

/**
 * Pricing tier suggestions (optional, for monetization)
 */
export interface PricingTier {
  tier: CompanyTier;
  monthlyPricePerEmployee: number;
  minimumMonthlyPrice: number;
  setupFee: number;
}

export const SUGGESTED_PRICING: Record<CompanyTier, PricingTier> = {
  [CompanyTier.SOLO]: {
    tier: CompanyTier.SOLO,
    monthlyPricePerEmployee: 49,
    minimumMonthlyPrice: 49,
    setupFee: 0,
  },
  [CompanyTier.STARTUP]: {
    tier: CompanyTier.STARTUP,
    monthlyPricePerEmployee: 39,
    minimumMonthlyPrice: 99,
    setupFee: 500,
  },
  [CompanyTier.SMALL_BUSINESS]: {
    tier: CompanyTier.SMALL_BUSINESS,
    monthlyPricePerEmployee: 29,
    minimumMonthlyPrice: 499,
    setupFee: 2000,
  },
  [CompanyTier.MID_MARKET]: {
    tier: CompanyTier.MID_MARKET,
    monthlyPricePerEmployee: 19,
    minimumMonthlyPrice: 1999,
    setupFee: 10000,
  },
  [CompanyTier.ENTERPRISE]: {
    tier: CompanyTier.ENTERPRISE,
    monthlyPricePerEmployee: 15,
    minimumMonthlyPrice: 7999,
    setupFee: 50000,
  },
  [CompanyTier.GLOBAL]: {
    tier: CompanyTier.GLOBAL,
    monthlyPricePerEmployee: 12,
    minimumMonthlyPrice: 60000,
    setupFee: 100000,
  },
};

/**
 * Calculate monthly cost for company
 */
export function calculateMonthlyCost(tier: CompanyTier, employeeCount: number): number {
  const pricing = SUGGESTED_PRICING[tier];
  const calculatedCost = employeeCount * pricing.monthlyPricePerEmployee;
  return Math.max(calculatedCost, pricing.minimumMonthlyPrice);
}

/**
 * Feature comparison for sales/marketing
 */
export function getFeatureComparison(): Record<CompanyTier, string[]> {
  return {
    [CompanyTier.SOLO]: [
      '1 employee',
      '10 GB knowledge storage',
      'Basic role templates',
      'Single location',
      'Community support',
    ],
    [CompanyTier.STARTUP]: [
      '2-10 employees',
      '50 GB knowledge storage',
      'Advanced analytics',
      'API access',
      'Gatekeeper federation',
      'Email support',
    ],
    [CompanyTier.SMALL_BUSINESS]: [
      '11-50 employees',
      '200 GB knowledge storage',
      'Custom integrations',
      'Up to 2 locations',
      'Cross-company negotiation',
      'Priority support',
    ],
    [CompanyTier.MID_MARKET]: [
      '51-500 employees',
      '1 TB knowledge storage',
      'Multi-region support',
      'White label branding',
      'Up to 5 locations',
      'Global policy management',
      'Dedicated support',
    ],
    [CompanyTier.ENTERPRISE]: [
      '501-5,000 employees',
      '5 TB knowledge storage',
      'Up to 20 locations',
      'Full customization',
      'Advanced security',
      'Dedicated account manager',
    ],
    [CompanyTier.GLOBAL]: [
      '5,000+ employees',
      '20 TB knowledge storage',
      'Unlimited locations',
      'Unlimited custom roles',
      'Global operations',
      'Enterprise SLA',
      '24/7 premium support',
    ],
  };
}
