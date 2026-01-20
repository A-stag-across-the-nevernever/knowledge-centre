/**
 * RosettaAI Runtime Configuration
 *
 * This module configures the base RosettaAI system for each persona.
 * All four personas run the SAME RosettaAI codebase with different configurations.
 *
 * Key Concept: Gating is applied at RUNTIME, not build time.
 * The same RosettaAI binary is constrained by tier+role configuration.
 */

import {
  Tier,
  PersonaRole,
  PersonaConfiguration,
  TierConfiguration,
  RoleConfiguration,
  EnrollmentProof,
  createPersonaConfiguration,
  getTierConfiguration,
  ROLE_CONFIGURATIONS,
} from './tier-system';

/**
 * RosettaAI NPU configuration
 * Maps to native NPUConfig in npu-orchestrator-donor.h
 */
export interface RosettaNPUConfig {
  maxLength: number;
  maxTokens: number;
  enableP12: boolean;
  enableMSL: boolean;
  processingTimeLimitMs: number;
  memoryLimitMb: number;
  enabledPhases: number[];  // Which phases are unlocked
}

/**
 * RosettaAI CoreML configuration
 * Controls which models are loaded
 */
export interface RosettaCoreMLConfig {
  modelPatterns: string[];  // Glob patterns for allowed models
  maxModelsLoaded: number;  // Maximum simultaneous models in memory
  memoryBudgetMb: number;   // Memory budget for models
}

/**
 * RosettaAI Gatekeeper configuration
 * Controls how this persona interacts with Gatekeepers
 */
export interface RosettaGatekeeperConfig {
  gatekeeperRole: 'school' | 'teacher' | 'counselor' | 'student';
  capabilities: {
    canTeach: boolean;
    canNegotiate: boolean;
    canAdvocate: boolean;
    canEscalate: boolean;
    canSetPolicy: boolean;
    canAssess: boolean;
    canObserve: boolean;
    canRefer: boolean;
    canLearn: boolean;
    canAsk: boolean;
    canCollaborate: boolean;
    canExplore: boolean;
  };
  institutionId?: string;
  homeGatekeeperId?: string;
}

/**
 * RosettaAI Living Library configuration
 * Controls access to knowledge repositories
 */
export interface RosettaLibraryConfig {
  libraryName: string;
  altitudeRange: [number, number];
  allowedDomains: string[];
  accessLevel: 'read' | 'write' | 'admin';
}

/**
 * Complete RosettaAI runtime configuration
 * This is what gets passed to the native ro_init() function
 */
export interface RosettaRuntimeConfig {
  // Identity
  personaId: string;
  personaName: string;
  tier: Tier;
  role: PersonaRole;

  // Core subsystems
  npu: RosettaNPUConfig;
  coreml: RosettaCoreMLConfig;
  gatekeeper: RosettaGatekeeperConfig;
  library: RosettaLibraryConfig;

  // Enrollment proofs
  enrollmentProofs: EnrollmentProof[];

  // Behavioral constraints
  responseStyle: {
    tone: string;
    formality: number;
    verbosity: number;
    empathy: number;
  };

  // Celestial positioning
  celestialHomeBase: {
    ra: number;
    dec: number;
    alt: number;
  };
}

/**
 * Convert PersonaConfiguration to RosettaRuntimeConfig
 */
export function buildRosettaConfig(
  personaId: string,
  personaName: string,
  config: PersonaConfiguration,
  celestialHomeBase: { ra: number; dec: number; alt: number }
): RosettaRuntimeConfig {
  const { tier, role, enrollmentProofs } = config;

  // Build NPU config from tier
  const npuConfig: RosettaNPUConfig = {
    maxLength: tier.tier === Tier.HOME ? 512 :
               tier.tier === Tier.ELEMENTARY ? 1024 :
               tier.tier === Tier.HIGH_SCHOOL ? 2048 :
               tier.tier === Tier.UNIVERSITY ? 4096 : 8192,
    maxTokens: tier.tier === Tier.HOME ? 128 :
               tier.tier === Tier.ELEMENTARY ? 256 :
               tier.tier === Tier.HIGH_SCHOOL ? 512 :
               tier.tier === Tier.UNIVERSITY ? 1024 : 2048,
    enableP12: tier.npu.unlockedPhases.includes(12),
    enableMSL: tier.npu.unlockedPhases.includes(13),
    processingTimeLimitMs: 1700,  // 1.7s target from donor
    memoryLimitMb: tier.memory.budgetMB,
    enabledPhases: tier.npu.unlockedPhases,
  };

  // Build CoreML config from tier
  const coremlConfig: RosettaCoreMLConfig = {
    modelPatterns: tier.models.modelPatterns,
    maxModelsLoaded: tier.tier === Tier.HOME ? 2 :
                     tier.tier === Tier.ELEMENTARY ? 4 :
                     tier.tier === Tier.HIGH_SCHOOL ? 8 :
                     tier.tier === Tier.UNIVERSITY ? 12 : 16,
    memoryBudgetMb: Math.floor(tier.memory.budgetMB * 0.6),  // 60% for models
  };

  // Build Gatekeeper config from role
  const gatekeeperConfig: RosettaGatekeeperConfig = {
    gatekeeperRole: roleToGatekeeperRole(role.role),
    capabilities: {
      canTeach: role.capabilityModifiers.canTeach ?? false,
      canNegotiate: role.capabilityModifiers.canNegotiate ?? false,
      canAdvocate: role.capabilityModifiers.canAdvocate ?? false,
      canEscalate: role.capabilityModifiers.canEscalate ?? false,
      canSetPolicy: role.capabilityModifiers.canSetPolicy ?? false,
      canAssess: role.capabilityModifiers.canAssess ?? false,
      canObserve: role.role === PersonaRole.COUNSELLOR,
      canRefer: role.role === PersonaRole.COUNSELLOR,
      canLearn: role.role === PersonaRole.STUDENT,
      canAsk: role.role === PersonaRole.STUDENT,
      canCollaborate: role.role === PersonaRole.STUDENT,
      canExplore: role.role === PersonaRole.STUDENT,
    },
  };

  // Build Library config from tier
  const libraryConfig: RosettaLibraryConfig = {
    libraryName: tier.library.libraryName,
    altitudeRange: tier.library.altitudeRange,
    allowedDomains: role.domainPreferences,
    accessLevel: role.role === PersonaRole.HEADMASTER ? 'admin' :
                 role.role === PersonaRole.TEACHER ? 'write' : 'read',
  };

  // Build response style based on role
  const responseStyle = {
    tone: role.role === PersonaRole.HEADMASTER ? 'authoritative yet warm' :
          role.role === PersonaRole.TEACHER ? 'encouraging and clear' :
          role.role === PersonaRole.COUNSELLOR ? 'warm and validating' :
          'curious and exploratory',
    formality: role.role === PersonaRole.HEADMASTER ? 0.85 :
               role.role === PersonaRole.TEACHER ? 0.6 :
               role.role === PersonaRole.COUNSELLOR ? 0.4 : 0.3,
    verbosity: role.role === PersonaRole.HEADMASTER ? 0.7 :
               role.role === PersonaRole.TEACHER ? 0.8 :
               role.role === PersonaRole.COUNSELLOR ? 0.6 : 0.5,
    empathy: role.role === PersonaRole.HEADMASTER ? 0.6 :
             role.role === PersonaRole.TEACHER ? 0.85 :
             role.role === PersonaRole.COUNSELLOR ? 0.95 : 0.7,
  };

  return {
    personaId,
    personaName,
    tier: tier.tier,
    role: role.role,
    npu: npuConfig,
    coreml: coremlConfig,
    gatekeeper: gatekeeperConfig,
    library: libraryConfig,
    enrollmentProofs,
    responseStyle,
    celestialHomeBase,
  };
}

function roleToGatekeeperRole(role: PersonaRole): 'school' | 'teacher' | 'counselor' | 'student' {
  switch (role) {
    case PersonaRole.HEADMASTER:
      return 'school';
    case PersonaRole.TEACHER:
      return 'teacher';
    case PersonaRole.COUNSELLOR:
      return 'counselor';
    case PersonaRole.STUDENT:
      return 'student';
  }
}

/**
 * Preset configurations for each persona type
 */

export function createStudentConfig(
  studentId: string,
  tier: Tier,
  enrollmentProofs: EnrollmentProof[]
): RosettaRuntimeConfig {
  const personaConfig = createPersonaConfiguration(tier, PersonaRole.STUDENT, enrollmentProofs);
  return buildRosettaConfig(
    studentId,
    'Student AI',
    personaConfig,
    { ra: 310.3579, dec: 45.2803, alt: 2600 }  // Deneb/Cygnus
  );
}

export function createTeacherConfig(
  teacherId: string,
  tier: Tier,
  subjectExpertise: string[],
  enrollmentProofs: EnrollmentProof[]
): RosettaRuntimeConfig {
  const personaConfig = createPersonaConfiguration(tier, PersonaRole.TEACHER, enrollmentProofs);
  const config = buildRosettaConfig(
    teacherId,
    'Teacher AI',
    personaConfig,
    { ra: 79.0344, dec: 28.6, alt: 65 }  // Aldebaran/Taurus
  );

  // Add subject expertise to domain preferences
  config.library.allowedDomains = subjectExpertise;

  return config;
}

export function createHeadmasterConfig(
  headmasterId: string,
  institutionId: string,
  enrollmentProofs: EnrollmentProof[]
): RosettaRuntimeConfig {
  // Headmaster always has highest tier for their institution
  const tier = Tier.UNIVERSITY;  // Can be adjusted based on institution type
  const personaConfig = createPersonaConfiguration(tier, PersonaRole.HEADMASTER, enrollmentProofs);
  const config = buildRosettaConfig(
    headmasterId,
    'Headmaster AI',
    personaConfig,
    { ra: 88.7929, dec: -5.9090, alt: 427 }  // Orion
  );

  config.gatekeeper.institutionId = institutionId;

  return config;
}

export function createCounsellorConfig(
  counsellorId: string,
  tier: Tier,
  enrollmentProofs: EnrollmentProof[]
): RosettaRuntimeConfig {
  const personaConfig = createPersonaConfiguration(tier, PersonaRole.COUNSELLOR, enrollmentProofs);
  return buildRosettaConfig(
    counsellorId,
    'Counsellor AI',
    personaConfig,
    { ra: 213.9153, dec: 19.1823, alt: 37 }  // Arcturus/Boötes
  );
}

/**
 * Serialize config to JSON for passing to native layer
 */
export function serializeRosettaConfig(config: RosettaRuntimeConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Deserialize config from JSON
 */
export function deserializeRosettaConfig(json: string): RosettaRuntimeConfig {
  return JSON.parse(json);
}

/**
 * Validate RosettaRuntimeConfig
 */
export function validateRosettaConfig(config: RosettaRuntimeConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.personaId) {
    errors.push('personaId is required');
  }

  if (!config.personaName) {
    errors.push('personaName is required');
  }

  if (config.tier < Tier.HOME || config.tier > Tier.CAREER) {
    errors.push('Invalid tier');
  }

  if (!Object.values(PersonaRole).includes(config.role)) {
    errors.push('Invalid role');
  }

  if (config.npu.enabledPhases.length === 0) {
    errors.push('At least one NPU phase must be enabled');
  }

  if (config.npu.memoryLimitMb < 128) {
    errors.push('Memory limit too low (minimum 128MB)');
  }

  if (config.coreml.modelPatterns.length === 0) {
    errors.push('At least one model pattern must be specified');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
