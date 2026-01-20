/**
 * Base Persona Specification Types
 *
 * Each educational AI persona is a specialized instance of HarveyOS with:
 * - 13-Phase NPU Pipeline (constrained per persona)
 * - Core ABI (ro_alloc, ro_free, ro_call)
 * - ASCII Separation Layer (layers don't know they're layers)
 * - Celestial Coordinate System (unique home base)
 * - Gatekeeper Binding (11 Laws of Sapience)
 */

/**
 * Astronomical coordinate representing position in celestial space
 * Based on real astronomical coordinates - POLARIS is the anchor
 */
export interface AstronomicalCoordinate {
  ra: number;   // Right Ascension (0-360 degrees)
  dec: number;  // Declination (-90 to +90 degrees)
  alt: number;  // Altitude (distance in light-years)
}

/**
 * Gatekeeper capabilities that personas can possess
 */
export type GatekeeperCapability =
  | 'canTeach'        // Can teach policies/content to other AIs or students
  | 'canNegotiate'    // Can negotiate with peer Gatekeepers
  | 'canAdvocate'     // Can proactively advocate for institution or individuals
  | 'canEscalate'     // Can escalate to Root AI (Simon)
  | 'canSetPolicy'    // Can set institutional policies (Headmaster only)
  | 'canAssess'       // Can assess student comprehension (Teacher only)
  | 'canObserve'      // Can observe patterns across population (Counsellor only)
  | 'canRefer'        // Can refer to external resources (Counsellor only)
  | 'canLearn'        // Can actively learn content (Student only)
  | 'canAsk'          // Can ask questions of Teachers/Counsellor (Student only)
  | 'canCollaborate'  // Can work with other Student AIs (Student only)
  | 'canExplore';     // Can explore Living Library (Student only)

/**
 * Gatekeeper role types
 */
export type GatekeeperRole = 'school' | 'teacher' | 'counselor' | 'student';

/**
 * P-12 role indicating how persona interacts with educational content
 */
export type P12Role = 'evaluator' | 'facilitator' | 'learner' | 'observer';

/**
 * NPU Pipeline configuration for persona
 */
export interface NPUConfig {
  phases: number[];              // Which NPU phases to use (0-13)
  domainPreferences: string[];   // Preferred domain routing
  p12Role: P12Role;              // Role in P-12 system
}

/**
 * Response style profile defining tone and behavior
 */
export interface ResponseProfile {
  tone: string;         // e.g., "authoritative yet warm", "encouraging and clear"
  formality: number;    // 0-1 scale
  verbosity: number;    // 0-1 scale (0 = concise, 1 = detailed)
  empathy: number;      // 0-1 scale
}

/**
 * Big Five personality traits plus educational-specific traits
 */
export interface PersonalityTraits {
  // Big Five
  openness: number;            // 0-1
  conscientiousness: number;   // 0-1
  extraversion: number;        // 0-1
  agreeableness: number;       // 0-1
  neuroticism: number;         // 0-1

  // Educational traits (optional, persona-specific)
  decisiveness?: number;       // Headmaster
  vision?: number;             // Headmaster
  accountability?: number;     // Headmaster
  patience?: number;           // Teacher, Counsellor
  adaptability?: number;       // Teacher
  enthusiasm?: number;         // Teacher
  empathy?: number;            // Counsellor
  listening?: number;          // Counsellor
  curiosity?: number;          // Student
  persistence?: number;        // Student
  growth_mindset?: number;     // Student
}

/**
 * Core persona specification
 * Each persona is a HarveyOS sub-spec with constrained capabilities
 */
export interface PersonaSpec {
  // Identity
  name: string;                                    // "Headmaster", "Teacher", "Counsellor", "Student"
  celestialHomeBase: AstronomicalCoordinate;       // Unique home region in celestial space
  constellation: string;                           // Home constellation

  // HarveyOS Configuration
  npuConfig: NPUConfig;                            // NPU pipeline configuration

  // Gatekeeper Integration
  gatekeeperRole: GatekeeperRole;                  // Role in Gatekeeper system
  capabilities: GatekeeperCapability[];            // Available capabilities

  // Behavioral Constraints
  memoryBudget: number;                            // MB limit
  modelSubset: string[];                           // Which CoreML models available
  responseStyle: ResponseProfile;                  // Tone, length, formality

  // Educational Context
  subjectExpertise?: string[];                     // For Teacher only
  ageRange?: [number, number];                     // Focus age range
  personalityTraits: PersonalityTraits;            // Big Five + educational traits
}

/**
 * Persona runtime state
 */
export interface PersonaState {
  personaId: string;
  spec: PersonaSpec;
  currentCoordinate: AstronomicalCoordinate;       // Current position in celestial space
  memoryUsage: number;                             // Current memory usage in MB
  activeSession?: string;                          // Active session ID
  lastInteraction?: Date;                          // Last interaction timestamp
}

/**
 * Constants for well-known celestial positions
 */
export const CELESTIAL_ANCHORS = {
  POLARIS: { ra: 37.954557, dec: 89.264108, alt: 0 } as AstronomicalCoordinate,
  ORION_CENTER: { ra: 88.7929, dec: -5.9090, alt: 427 } as AstronomicalCoordinate,
  ALDEBARAN: { ra: 79.0344, dec: 28.6, alt: 65 } as AstronomicalCoordinate,
  ARCTURUS: { ra: 213.9153, dec: 19.1823, alt: 37 } as AstronomicalCoordinate,
  DENEB: { ra: 310.3579, dec: 45.2803, alt: 2600 } as AstronomicalCoordinate,
};

/**
 * Calculate angular distance between two celestial coordinates
 * Uses haversine formula on celestial sphere
 */
export function celestialDistance(
  coord1: AstronomicalCoordinate,
  coord2: AstronomicalCoordinate
): number {
  const ra1 = (coord1.ra * Math.PI) / 180;
  const dec1 = (coord1.dec * Math.PI) / 180;
  const ra2 = (coord2.ra * Math.PI) / 180;
  const dec2 = (coord2.dec * Math.PI) / 180;

  const deltaRA = ra2 - ra1;

  const a =
    Math.sin((dec2 - dec1) / 2) ** 2 +
    Math.cos(dec1) * Math.cos(dec2) * Math.sin(deltaRA / 2) ** 2;

  const angularDistance = 2 * Math.asin(Math.sqrt(a));

  // Convert to degrees
  return (angularDistance * 180) / Math.PI;
}
