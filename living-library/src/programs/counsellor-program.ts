/**
 * Counsellor AI - Self-Contained Program
 *
 * Emotional support, learning strategy, holistic student wellbeing
 * Constellation: Boötes (The Herdsman)
 */

import {
  COUNSELLOR_SPEC,
  WellbeingProfile,
  CheckIn,
  Concern,
  Intervention,
  Pattern,
  Referral,
  calculateOverallWellbeing,
  needsImmediateAttention,
  generateAccommodations,
} from '../personas/counsellor';
import { PersonaState } from '../personas/persona-spec';

/**
 * Counsellor Program State
 */
export class CounsellorProgram {
  private state: PersonaState;
  private wellbeingProfiles: Map<string, WellbeingProfile> = new Map();
  private checkIns: CheckIn[] = [];
  private interventions: Intervention[] = [];
  private patterns: Pattern[] = [];
  private referrals: Referral[] = [];

  constructor() {
    // Initialize persona state
    this.state = {
      personaId: 'counsellor_main',
      spec: COUNSELLOR_SPEC,
      currentCoordinate: COUNSELLOR_SPEC.celestialHomeBase,
      memoryUsage: 0,
      lastInteraction: new Date(),
    };
  }

  /**
   * Get current state
   */
  getState(): PersonaState {
    return { ...this.state };
  }

  /**
   * Conduct check-in with student
   */
  conductCheckIn(checkIn: Omit<CheckIn, 'id'>): CheckIn {
    const fullCheckIn: CheckIn = {
      ...checkIn,
      id: `checkin_${Date.now()}`,
    };

    this.checkIns.push(fullCheckIn);

    // Update student's wellbeing profile
    const profile = this.wellbeingProfiles.get(checkIn.studentId);
    if (profile) {
      profile.lastCheckIn = checkIn.date;

      // Update overall wellbeing based on check-in metrics
      const checkInScore = (checkIn.mood + checkIn.energy + (1 - checkIn.stress)) / 3;
      profile.overallWellbeing = (profile.overallWellbeing + checkInScore) / 2;

      // Add concerns if stress is high or mood is low
      if (checkIn.stress > 0.7 || checkIn.mood < 0.3) {
        const concern: Concern = {
          id: `concern_${Date.now()}`,
          domain: 'emotional',
          severity: checkIn.stress > 0.85 ? 'high' : 'moderate',
          description: checkIn.notes || 'Student showing signs of stress or low mood',
          identifiedAt: checkIn.date,
          resolved: false,
        };
        profile.concerns.push(concern);
      }
    }

    this.state.lastInteraction = new Date();
    return fullCheckIn;
  }

  /**
   * Create or update student wellbeing profile
   */
  createProfile(studentId: string): WellbeingProfile {
    const profile: WellbeingProfile = {
      studentId,
      lastCheckIn: new Date(),
      overallWellbeing: 0.7, // Start with moderate wellbeing
      domainScores: {
        emotional: 0.7,
        social: 0.7,
        behavioral: 0.7,
        developmental: 0.7,
        academic_stress: 0.7,
        family: 0.7,
        peer_relationships: 0.7,
        self_esteem: 0.7,
      },
      concerns: [],
      strengths: [],
      goals: [],
      interventions: [],
    };

    this.wellbeingProfiles.set(studentId, profile);
    this.state.lastInteraction = new Date();
    return profile;
  }

  /**
   * Get student wellbeing profile
   */
  getProfile(studentId: string): WellbeingProfile | undefined {
    return this.wellbeingProfiles.get(studentId);
  }

  /**
   * Record intervention
   */
  recordIntervention(intervention: Omit<Intervention, 'id'>): Intervention {
    const fullIntervention: Intervention = {
      ...intervention,
      id: `intervention_${Date.now()}`,
    };

    this.interventions.push(fullIntervention);

    // Add to student's profile
    const profile = this.wellbeingProfiles.get(intervention.studentId);
    if (profile) {
      profile.interventions.push(fullIntervention);
    }

    this.state.lastInteraction = new Date();
    return fullIntervention;
  }

  /**
   * Create referral to external resource
   */
  createReferral(referral: Omit<Referral, 'id' | 'status' | 'createdAt'>): Referral {
    const fullReferral: Referral = {
      ...referral,
      id: `referral_${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };

    this.referrals.push(fullReferral);
    this.state.lastInteraction = new Date();
    return fullReferral;
  }

  /**
   * Get students needing immediate attention
   */
  getUrgentCases(): WellbeingProfile[] {
    const urgent: WellbeingProfile[] = [];

    for (const profile of this.wellbeingProfiles.values()) {
      if (needsImmediateAttention(profile)) {
        urgent.push(profile);
      }
    }

    this.state.lastInteraction = new Date();
    return urgent;
  }

  /**
   * Detect patterns across student population
   */
  detectPatterns(): Pattern[] {
    const concernCounts = new Map<string, number>();

    // Count concerns by domain
    for (const profile of this.wellbeingProfiles.values()) {
      for (const concern of profile.concerns) {
        if (!concern.resolved) {
          const count = concernCounts.get(concern.domain) || 0;
          concernCounts.set(concern.domain, count + 1);
        }
      }
    }

    // Create patterns for frequently occurring concerns
    for (const [domain, count] of concernCounts.entries()) {
      if (count >= 3) {
        const existingPattern = this.patterns.find(
          p => p.type === 'emotional' && p.description.includes(domain)
        );

        if (existingPattern) {
          existingPattern.frequency = count;
          existingPattern.lastSeen = new Date();
        } else {
          const pattern: Pattern = {
            id: `pattern_${Date.now()}_${domain}`,
            type: 'emotional',
            description: `Multiple students showing ${domain} concerns`,
            frequency: count,
            firstDetected: new Date(),
            lastSeen: new Date(),
            severity: count >= 5 ? 'high' : 'moderate',
            recommendedAction: `Review ${domain} support strategies`,
          };
          this.patterns.push(pattern);
        }
      }
    }

    this.state.lastInteraction = new Date();
    return [...this.patterns];
  }

  /**
   * Generate accommodation recommendations for a student
   */
  getAccommodations(studentId: string): string[] {
    const profile = this.wellbeingProfiles.get(studentId);
    if (!profile) return [];

    const accommodations = generateAccommodations(profile);
    this.state.lastInteraction = new Date();
    return accommodations;
  }

  /**
   * Get all check-ins for a student
   */
  getStudentCheckIns(studentId: string): CheckIn[] {
    return this.checkIns.filter(c => c.studentId === studentId);
  }

  /**
   * Get recent check-ins across all students
   */
  getRecentCheckIns(days: number = 7): CheckIn[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.checkIns.filter(c => c.date >= cutoff);
  }

  /**
   * Export state for persistence
   */
  export(): object {
    return {
      state: this.state,
      wellbeingProfiles: Array.from(this.wellbeingProfiles.entries()),
      checkIns: this.checkIns,
      interventions: this.interventions,
      patterns: this.patterns,
      referrals: this.referrals,
    };
  }

  /**
   * Import state from persistence
   */
  import(data: any): void {
    if (data.state) this.state = data.state;
    if (data.wellbeingProfiles) this.wellbeingProfiles = new Map(data.wellbeingProfiles);
    if (data.checkIns) this.checkIns = data.checkIns;
    if (data.interventions) this.interventions = data.interventions;
    if (data.patterns) this.patterns = data.patterns;
    if (data.referrals) this.referrals = data.referrals;
  }
}

/**
 * Create and run Counsellor program
 */
export function createCounsellor(): CounsellorProgram {
  return new CounsellorProgram();
}
