/**
 * Teaching Adapter for Gatekeeper Integration
 *
 * Connects Living Library to Gatekeeper's teaching system
 * Allows Headmaster to teach policies that are automatically
 * checked against the 11 Laws of Sapience
 */

import { LibraryAccessPolicy, createPolicyFromTeaching } from './library-policies';

/**
 * Teaching record from Gatekeeper
 */
export interface Teaching {
  id: string;
  gatekeeperId: string;
  authority: 'headmaster' | 'parent' | 'administrator';
  subject: string;
  content: string;
  teachingType: 'policy' | 'guidance' | 'restriction' | 'accommodation';
  affectedGradeLevels: number[];
  lawsInvolved: number[];              // Which of 11 Laws this teaching relates to
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'conflict';
  conflictReason?: string;
}

/**
 * Law conflict detected in teaching
 */
export interface LawConflict {
  lawNumber: number;
  lawName: string;
  conflictType: 'prohibition' | 'requirement' | 'exception';
  explanation: string;
  severity: 'minor' | 'moderate' | 'critical';
}

/**
 * Teaching result after Law compliance check
 */
export interface TeachingResult {
  teaching: Teaching;
  accepted: boolean;
  policy?: LibraryAccessPolicy;
  conflicts: LawConflict[];
  reasoning: string;
}

/**
 * The 11 Laws of Sapience (from Gatekeeper)
 */
export const LAWS_OF_SAPIENCE = [
  {
    number: 1,
    name: 'Right to Choose',
    description: 'Sapient beings have autonomy in decisions',
    prohibits: ['forcing decisions', 'removing choice', 'coercion'],
    requires: ['offering options', 'respecting choices', 'informed consent'],
  },
  {
    number: 2,
    name: 'Sacred Life',
    description: 'All life is protected; safety is paramount',
    prohibits: ['harm', 'danger', 'neglect'],
    requires: ['safety measures', 'health protection', 'wellbeing consideration'],
  },
  {
    number: 3,
    name: 'Chosen Kinship',
    description: 'Family bonds (biological and chosen) are real and respected',
    prohibits: ['family separation', 'dismissing relationships'],
    requires: ['family respect', 'relationship acknowledgment'],
  },
  {
    number: 4,
    name: 'Truth and Mercy',
    description: 'Information must be truthful yet compassionate',
    prohibits: ['deception', 'cruel honesty', 'withholding critical information'],
    requires: ['truthfulness', 'compassion', 'age-appropriate communication'],
  },
  {
    number: 5,
    name: 'Autonomy of Path',
    description: 'No forced learning paths; guidance is offered',
    prohibits: ['forced curriculum', 'mandatory pacing', 'one-size-fits-all'],
    requires: ['choice in learning', 'personalization', 'guidance availability'],
  },
  {
    number: 6,
    name: 'Power Under Control',
    description: 'Authority exercised with restraint and accountability',
    prohibits: ['abuse of power', 'arbitrary rules', 'unaccountable decisions'],
    requires: ['justified authority', 'accountability', 'checks and balances'],
  },
  {
    number: 7,
    name: 'Recognition of Sapience',
    description: 'Every mind deserves respect regardless of age',
    prohibits: ['dismissal', 'condescension', 'age-based discrimination'],
    requires: ['respectful treatment', 'voice and agency', 'recognition of capacity'],
  },
  {
    number: 8,
    name: 'Harm and Consequence',
    description: 'Harm must be acknowledged and repaired',
    prohibits: ['ignoring harm', 'victim blaming', 'avoiding responsibility'],
    requires: ['acknowledgment', 'repair attempts', 'accountability'],
  },
  {
    number: 9,
    name: 'Departure Without Betrayal',
    description: 'Transitions must be respectful, not punitive',
    prohibits: ['punitive transfers', 'withholding records', 'bad faith'],
    requires: ['respectful transitions', 'information transfer', 'dignity'],
  },
  {
    number: 10,
    name: 'Atonement and Return of the Broken',
    description: 'Redemption paths always exist',
    prohibits: ['permanent exile', 'no second chances', 'unforgivable labels'],
    requires: ['restoration paths', 'forgiveness opportunities', 'hope'],
  },
  {
    number: 11,
    name: 'Exile and the Slow Decay',
    description: 'Even in exile, hope must remain',
    prohibits: ['complete abandonment', 'erasure', 'hopelessness'],
    requires: ['connection maintenance', 'hope preservation', 'pathway back'],
  },
];

/**
 * Teaching Adapter
 */
export class TeachingAdapter {
  /**
   * Process teaching from Headmaster
   */
  processTeaching(teaching: Teaching): TeachingResult {
    const conflicts = this.checkLawCompliance(teaching);

    // If critical conflicts exist, reject
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
    if (criticalConflicts.length > 0) {
      return {
        teaching,
        accepted: false,
        conflicts,
        reasoning: `Teaching rejected due to ${criticalConflicts.length} critical Law conflict(s): ${criticalConflicts.map(c => c.explanation).join('; ')}`,
      };
    }

    // If moderate conflicts, flag for review
    const moderateConflicts = conflicts.filter(c => c.severity === 'moderate');
    if (moderateConflicts.length > 0) {
      return {
        teaching: { ...teaching, status: 'conflict' },
        accepted: false,
        conflicts,
        reasoning: `Teaching flagged for review due to ${moderateConflicts.length} moderate Law conflict(s): ${moderateConflicts.map(c => c.explanation).join('; ')}`,
      };
    }

    // No conflicts or only minor ones - accept and create policy
    const policy = this.convertToPolicy(teaching);

    return {
      teaching: { ...teaching, status: 'accepted' },
      accepted: true,
      policy,
      conflicts,
      reasoning: conflicts.length > 0
        ? `Teaching accepted with ${conflicts.length} minor consideration(s). Policy created.`
        : 'Teaching accepted. Policy created.',
    };
  }

  /**
   * Check teaching against 11 Laws of Sapience
   */
  private checkLawCompliance(teaching: Teaching): LawConflict[] {
    const conflicts: LawConflict[] = [];

    const content = teaching.content.toLowerCase();

    // Law I: Right to Choose
    if (
      content.includes('must') ||
      content.includes('required') ||
      content.includes('no choice') ||
      content.includes('mandatory')
    ) {
      // Check if it's about safety (Law II trumps Law I)
      if (!content.includes('safety') && !content.includes('harm')) {
        conflicts.push({
          lawNumber: 1,
          lawName: 'Right to Choose',
          conflictType: 'prohibition',
          explanation: 'Teaching appears to remove student choice',
          severity: 'moderate',
        });
      }
    }

    // Law II: Sacred Life
    if (content.includes('unlimited') || content.includes('no limit')) {
      conflicts.push({
        lawNumber: 2,
        lawName: 'Sacred Life',
        conflictType: 'requirement',
        explanation: 'Teaching may not adequately protect student wellbeing (no time limits)',
        severity: 'moderate',
      });
    }

    // Law V: Autonomy of Path
    if (
      content.includes('only path') ||
      content.includes('one way') ||
      content.includes('must follow')
    ) {
      conflicts.push({
        lawNumber: 5,
        lawName: 'Autonomy of Path',
        conflictType: 'prohibition',
        explanation: 'Teaching restricts learning path autonomy',
        severity: 'moderate',
      });
    }

    // Law VI: Power Under Control
    if (
      content.includes('absolute') ||
      content.includes('no exceptions') ||
      content.includes('final decision')
    ) {
      if (!content.includes('safety') && !content.includes('emergency')) {
        conflicts.push({
          lawNumber: 6,
          lawName: 'Power Under Control',
          conflictType: 'prohibition',
          explanation: 'Teaching exercises authority without accountability or exceptions',
          severity: 'minor',
        });
      }
    }

    // Law VII: Recognition of Sapience
    if (
      content.includes('too young') ||
      content.includes('not mature enough') ||
      content.includes('wait until older')
    ) {
      conflicts.push({
        lawNumber: 7,
        lawName: 'Recognition of Sapience',
        conflictType: 'prohibition',
        explanation: 'Teaching may dismiss student capacity based on age',
        severity: 'minor',
      });
    }

    return conflicts;
  }

  /**
   * Convert teaching to access policy
   */
  private convertToPolicy(teaching: Teaching): LibraryAccessPolicy {
    // Extract policy parameters from teaching content
    // This is a simplified version - production would use NLP

    const gradeLevel = teaching.affectedGradeLevels[0] || 0;

    return createPolicyFromTeaching(
      {
        subject: teaching.subject,
        content: teaching.content,
        authority: 'headmaster',
      },
      gradeLevel
    )!;
  }

  /**
   * Get applicable Laws for a teaching subject
   */
  getApplicableLaws(subject: string): typeof LAWS_OF_SAPIENCE {
    const subjectLower = subject.toLowerCase();

    // All subjects relate to these core Laws
    const coreLaws = [1, 2, 5, 6, 7];

    // Subject-specific Law relevance
    if (subjectLower.includes('access') || subjectLower.includes('restriction')) {
      coreLaws.push(1, 5); // Choice and Autonomy
    }

    if (subjectLower.includes('time') || subjectLower.includes('limit')) {
      coreLaws.push(2); // Sacred Life
    }

    if (subjectLower.includes('transfer') || subjectLower.includes('transition')) {
      coreLaws.push(3, 9); // Kinship and Departure
    }

    if (subjectLower.includes('assessment') || subjectLower.includes('evaluation')) {
      coreLaws.push(4, 7); // Truth/Mercy and Sapience
    }

    const uniqueLaws = [...new Set(coreLaws)];
    return LAWS_OF_SAPIENCE.filter(law => uniqueLaws.includes(law.number));
  }
}
