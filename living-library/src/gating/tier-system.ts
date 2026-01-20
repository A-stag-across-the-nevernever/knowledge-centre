/**
 * Tier-Based Gating System for RosettaAI Personas
 *
 * This system controls which RosettaAI capabilities unlock at each life stage.
 * All four personas (Student, Teacher, Headmaster, Counsellor) are the SAME
 * RosettaAI system with different tier configurations.
 *
 * Tiers:
 *   0 - Home (Sanctum) - Basic learning, family use
 *   1 - Elementary School - Structured education begins
 *   2 - High School - Advanced education, critical thinking
 *   3 - University - Research, specialization
 *   4 - Career - Professional/corporate use
 */

export enum Tier {
  HOME = 0,
  ELEMENTARY = 1,
  HIGH_SCHOOL = 2,
  UNIVERSITY = 3,
  CAREER = 4,
}

/**
 * NPU Phase unlocking based on tier
 * Phases 0-13 are progressively unlocked
 */
export interface TierNPUConfig {
  tier: Tier;
  unlockedPhases: number[];
  description: string;
}

export const TIER_NPU_UNLOCKS: Record<Tier, TierNPUConfig> = {
  [Tier.HOME]: {
    tier: Tier.HOME,
    unlockedPhases: [0, 1, 2, 3, 4, 5], // Basic: validation, tokenization, ASCII, position, POS, sentence
    description: "Home/Family use - basic language processing",
  },
  [Tier.ELEMENTARY]: {
    tier: Tier.ELEMENTARY,
    unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8], // Add: morphology, question logic, domain routing
    description: "Elementary school - structured learning begins",
  },
  [Tier.HIGH_SCHOOL]: {
    tier: Tier.HIGH_SCHOOL,
    unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Add: pattern selection, context frame
    description: "High school - advanced reasoning and context building",
  },
  [Tier.UNIVERSITY]: {
    tier: Tier.UNIVERSITY,
    unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Add: P-12 learning, MSL embedding
    description: "University - research and specialized knowledge",
  },
  [Tier.CAREER]: {
    tier: Tier.CAREER,
    unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // All phases
    description: "Career/Professional - full system capabilities",
  },
};

/**
 * Memory budget unlocking based on tier
 */
export interface TierMemoryConfig {
  tier: Tier;
  budgetMB: number;
  description: string;
}

export const TIER_MEMORY_UNLOCKS: Record<Tier, TierMemoryConfig> = {
  [Tier.HOME]: {
    tier: Tier.HOME,
    budgetMB: 256,
    description: "Limited memory for basic use",
  },
  [Tier.ELEMENTARY]: {
    tier: Tier.ELEMENTARY,
    budgetMB: 512,
    description: "Student-level memory budget",
  },
  [Tier.HIGH_SCHOOL]: {
    tier: Tier.HIGH_SCHOOL,
    budgetMB: 1024,
    description: "Advanced student memory budget",
  },
  [Tier.UNIVERSITY]: {
    tier: Tier.UNIVERSITY,
    budgetMB: 1536,
    description: "Research-level memory budget",
  },
  [Tier.CAREER]: {
    tier: Tier.CAREER,
    budgetMB: 2048,
    description: "Professional-level memory budget",
  },
};

/**
 * CoreML model unlocking based on tier
 */
export interface TierModelConfig {
  tier: Tier;
  modelPatterns: string[];
  description: string;
}

export const TIER_MODEL_UNLOCKS: Record<Tier, TierModelConfig> = {
  [Tier.HOME]: {
    tier: Tier.HOME,
    modelPatterns: ["grammar_foundation*", "math_basic*"],
    description: "Basic grammar and math models",
  },
  [Tier.ELEMENTARY]: {
    tier: Tier.ELEMENTARY,
    modelPatterns: [
      "grammar_foundation*",
      "grammar_intermediate*",
      "math_basic*",
      "math_arithmetic*",
      "reasoning_logic*",
    ],
    description: "Elementary education models",
  },
  [Tier.HIGH_SCHOOL]: {
    tier: Tier.HIGH_SCHOOL,
    modelPatterns: ["grammar_*", "math_*", "science_*", "reasoning_*"],
    description: "High school level models across all subjects",
  },
  [Tier.UNIVERSITY]: {
    tier: Tier.UNIVERSITY,
    modelPatterns: [
      "grammar_*",
      "math_*",
      "science_*",
      "reasoning_*",
      "research_*",
      "specialization_*",
    ],
    description: "University and research models",
  },
  [Tier.CAREER]: {
    tier: Tier.CAREER,
    modelPatterns: ["*"], // All models
    description: "Full model access",
  },
};

/**
 * Living Library access based on tier
 */
export interface TierLibraryAccess {
  tier: Tier;
  libraryName: string;
  altitudeRange: [number, number]; // Celestial altitude range accessible
  description: string;
}

export const TIER_LIBRARY_ACCESS: Record<Tier, TierLibraryAccess> = {
  [Tier.HOME]: {
    tier: Tier.HOME,
    libraryName: "Sanctum",
    altitudeRange: [0, 2],
    description: "Home library - foundational knowledge",
  },
  [Tier.ELEMENTARY]: {
    tier: Tier.ELEMENTARY,
    libraryName: "Living Library (Elementary)",
    altitudeRange: [0, 5],
    description: "Elementary school library - K-5 content",
  },
  [Tier.HIGH_SCHOOL]: {
    tier: Tier.HIGH_SCHOOL,
    libraryName: "Living Library (High School)",
    altitudeRange: [0, 10],
    description: "High school library - grades 6-12 content",
  },
  [Tier.UNIVERSITY]: {
    tier: Tier.UNIVERSITY,
    libraryName: "Athenaeum",
    altitudeRange: [0, 15],
    description: "University library - advanced and research content",
  },
  [Tier.CAREER]: {
    tier: Tier.CAREER,
    libraryName: "Professional Library",
    altitudeRange: [0, 20],
    description: "Professional library - full knowledge base",
  },
};

/**
 * Enrollment proof - cryptographic evidence of tier unlocking
 */
export interface EnrollmentProof {
  studentId: string;
  institutionId: string;
  institutionType:
    | "home"
    | "elementary"
    | "high_school"
    | "university"
    | "employer";
  tier: Tier;
  enrollmentDate: Date;
  expirationDate?: Date;
  signature: string; // Cryptographic signature from institution's Gatekeeper
  gatekeeperId: string;
}

/**
 * Validate enrollment proof against cryptographic signature
 */
export function validateEnrollmentProof(proof: EnrollmentProof): boolean {
  // TODO: Implement cryptographic validation
  // For now, basic validation
  if (
    !proof.studentId ||
    !proof.institutionId ||
    !proof.signature ||
    !proof.gatekeeperId
  ) {
    return false;
  }

  if (proof.expirationDate && proof.expirationDate < new Date()) {
    return false;
  }

  return true;
}

/**
 * Get complete tier configuration
 */
export interface TierConfiguration {
  tier: Tier;
  npu: TierNPUConfig;
  memory: TierMemoryConfig;
  models: TierModelConfig;
  library: TierLibraryAccess;
}

export function getTierConfiguration(tier: Tier): TierConfiguration {
  return {
    tier,
    npu: TIER_NPU_UNLOCKS[tier],
    memory: TIER_MEMORY_UNLOCKS[tier],
    models: TIER_MODEL_UNLOCKS[tier],
    library: TIER_LIBRARY_ACCESS[tier],
  };
}

/**
 * Unlock next tier - requires enrollment proof
 */
export interface TierUnlockRequest {
  currentTier: Tier;
  targetTier: Tier;
  enrollmentProof: EnrollmentProof;
}

export interface TierUnlockResult {
  success: boolean;
  newTier?: Tier;
  error?: string;
  timestamp: Date;
}

export function unlockTier(request: TierUnlockRequest): TierUnlockResult {
  // Validate enrollment proof
  if (!validateEnrollmentProof(request.enrollmentProof)) {
    return {
      success: false,
      error: "Invalid enrollment proof",
      timestamp: new Date(),
    };
  }

  // Verify target tier matches enrollment proof
  if (request.enrollmentProof.tier !== request.targetTier) {
    return {
      success: false,
      error: "Enrollment proof tier does not match target tier",
      timestamp: new Date(),
    };
  }

  // Verify sequential unlocking (can't skip tiers)
  if (
    request.targetTier !== request.currentTier + 1 &&
    request.targetTier !== Tier.HOME
  ) {
    return {
      success: false,
      error: "Must unlock tiers sequentially",
      timestamp: new Date(),
    };
  }

  return {
    success: true,
    newTier: request.targetTier,
    timestamp: new Date(),
  };
}

/**
 * NOTE: PersonaRole enum has been replaced by the expandable role system.
 * See role-system.ts for BaseRole interface and ROLE_REGISTRY.
 *
 * The old enum is kept here for backwards compatibility but should
 * be migrated to use roleId strings from ROLE_REGISTRY.
 */
export type PersonaRoleId = string; // Any roleId from ROLE_REGISTRY

/**
 * Complete persona configuration = Tier + Role
 */
export interface PersonaConfiguration {
  tier: TierConfiguration;
  role: RoleConfiguration;
  enrollmentProofs: EnrollmentProof[];
}

export function createPersonaConfiguration(
  tier: Tier,
  role: PersonaRole,
  enrollmentProofs: EnrollmentProof[] = [],
): PersonaConfiguration {
  return {
    tier: getTierConfiguration(tier),
    role: ROLE_CONFIGURATIONS[role],
    enrollmentProofs,
  };
}
