/**
 * Persona Builder
 *
 * Bridges the tier system with the expandable role system.
 * Creates complete RosettaAI configurations from tier + role.
 *
 * Key Insight:
 * - STUDENT role: Gated by life stage (HOME → ELEMENTARY → HIGH_SCHOOL → UNIVERSITY → CAREER)
 * - ALL OTHER roles: Adult/career roles, always at CAREER tier (Tier 4), fully unlocked
 */

import {
  Tier,
  TierConfiguration,
  getTierConfiguration,
  EnrollmentProof,
  PersonaRoleId,
} from './tier-system';

import {
  BaseRole,
  getRole,
  LifeStage,
  STUDENT_ROLE,
  ROLE_REGISTRY,
} from './role-system';

/**
 * Complete persona specification
 * Combines tier (what's unlocked) + role (what you do with it)
 */
export interface PersonaSpec {
  // Identity
  personaId: string;
  personaName: string;

  // Tier (gating level)
  tier: TierConfiguration;

  // Role (professional identity)
  role: BaseRole;

  // Proofs of enrollment/employment
  enrollmentProofs: EnrollmentProof[];

  // Celestial positioning
  celestialHomeBase: {
    ra: number;
    dec: number;
    alt: number;
  };
}

/**
 * Build persona spec for STUDENT (gated role)
 * Students start at tier and unlock progressively
 */
export function buildStudentPersona(
  studentId: string,
  currentTier: Tier,
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  return {
    personaId: studentId,
    personaName: 'Student',
    tier: getTierConfiguration(currentTier),
    role: STUDENT_ROLE,
    enrollmentProofs,
    celestialHomeBase: {
      ra: 310.3579,  // Deneb/Cygnus
      dec: 45.2803,
      alt: 2600,
    },
  };
}

/**
 * Build persona spec for ADULT/CAREER roles
 * All adult roles start fully unlocked at CAREER tier
 */
export function buildAdultPersona(
  personaId: string,
  roleId: string,
  enrollmentProofs: EnrollmentProof[] = [],
  celestialHomeBase?: { ra: number; dec: number; alt: number }
): PersonaSpec {
  const role = getRole(roleId);
  if (!role) {
    throw new Error(`Unknown role: ${roleId}`);
  }

  if (role.lifeStage !== LifeStage.ADULT) {
    throw new Error(`Role ${roleId} is not an adult role. Use buildStudentPersona() for students.`);
  }

  // Adult roles always get CAREER tier (fully unlocked)
  const tier = getTierConfiguration(Tier.CAREER);

  // Default celestial positions for known roles
  const defaultPositions: Record<string, { ra: number; dec: number; alt: number }> = {
    teacher: { ra: 79.0344, dec: 28.6, alt: 65 },        // Aldebaran/Taurus
    headmaster: { ra: 88.7929, dec: -5.9090, alt: 427 }, // Orion
    counsellor: { ra: 213.9153, dec: 19.1823, alt: 37 }, // Arcturus/Boötes
    doctor: { ra: 201.298, dec: -11.161, alt: 249 },     // Spica/Virgo
    software_engineer: { ra: 279.234, dec: 38.783, alt: 25 }, // Vega/Lyra
    manager: { ra: 186.650, dec: -63.099, alt: 320 },    // Acrux/Crux
    artist: { ra: 95.988, dec: -52.696, alt: 860 },      // Canopus/Carina
  };

  return {
    personaId,
    personaName: role.roleName,
    tier,
    role,
    enrollmentProofs,
    celestialHomeBase: celestialHomeBase || defaultPositions[roleId] || {
      ra: 0,
      dec: 0,
      alt: 100,
    },
  };
}

/**
 * Convenience builders for common educational roles
 */

export function buildTeacherPersona(
  teacherId: string,
  subjectExpertise: string[],
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  const persona = buildAdultPersona(teacherId, 'teacher', enrollmentProofs);

  // Override domain expertise with subject expertise
  persona.role = {
    ...persona.role,
    domainExpertise: subjectExpertise,
  };

  return persona;
}

export function buildHeadmasterPersona(
  headmasterId: string,
  institutionId: string,
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  return buildAdultPersona(headmasterId, 'headmaster', enrollmentProofs);
}

export function buildCounsellorPersona(
  counsellorId: string,
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  return buildAdultPersona(counsellorId, 'counsellor', enrollmentProofs);
}

/**
 * Convenience builders for other career roles
 */

export function buildDoctorPersona(
  doctorId: string,
  specialization: string[],
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  const persona = buildAdultPersona(doctorId, 'doctor', enrollmentProofs);

  // Add specialization to domain expertise
  persona.role = {
    ...persona.role,
    domainExpertise: [...persona.role.domainExpertise, ...specialization],
  };

  return persona;
}

export function buildEngineerPersona(
  engineerId: string,
  specialty: string[],
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  const persona = buildAdultPersona(engineerId, 'software_engineer', enrollmentProofs);

  persona.role = {
    ...persona.role,
    domainExpertise: [...persona.role.domainExpertise, ...specialty],
  };

  return persona;
}

export function buildManagerPersona(
  managerId: string,
  industry: string[],
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  const persona = buildAdultPersona(managerId, 'manager', enrollmentProofs);

  persona.role = {
    ...persona.role,
    domainExpertise: [...persona.role.domainExpertise, ...industry],
  };

  return persona;
}

export function buildArtistPersona(
  artistId: string,
  medium: string[],
  enrollmentProofs: EnrollmentProof[] = []
): PersonaSpec {
  const persona = buildAdultPersona(artistId, 'artist', enrollmentProofs);

  persona.role = {
    ...persona.role,
    domainExpertise: [...persona.role.domainExpertise, ...medium],
  };

  return persona;
}

/**
 * Get summary of persona
 */
export function getPersonaSummary(spec: PersonaSpec): string {
  const tierName = ['Home', 'Elementary', 'High School', 'University', 'Career'][spec.tier.tier];
  const isStudent = spec.role.roleId === 'student';

  if (isStudent) {
    return `Student at ${tierName} tier with ${spec.tier.npu.unlockedPhases.length} NPU phases unlocked`;
  } else {
    return `${spec.role.roleName} (fully unlocked) with ${spec.role.capabilities.length} capabilities in ${spec.role.domainExpertise.join(', ')}`;
  }
}

/**
 * Check if persona has specific capability
 */
export function hasCapability(spec: PersonaSpec, capabilityId: string): boolean {
  return spec.role.capabilities.some(cap => cap.capabilityId === capabilityId);
}

/**
 * Get all capability IDs
 */
export function getCapabilityIds(spec: PersonaSpec): string[] {
  return spec.role.capabilities.map(cap => cap.capabilityId);
}
