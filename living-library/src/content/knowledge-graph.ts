/**
 * Knowledge Graph Management
 *
 * Manages the celestial coordinate-based knowledge graph
 * for the Living Library curriculum
 */

import { AstronomicalCoordinate, CELESTIAL_ANCHORS } from '../personas/persona-spec';
import { CurriculumNode, KnowledgeGraph, buildKnowledgeGraph } from './curriculum';
import { SubjectDomain } from '../personas/teacher';

/**
 * Domain-to-constellation mapping
 * Each academic domain has a home region in celestial space
 */
export const DOMAIN_CONSTELLATIONS: Record<
  SubjectDomain,
  { constellation: string; centerCoordinate: AstronomicalCoordinate }
> = {
  mathematics: {
    constellation: 'Ursa Major',
    centerCoordinate: { ra: 165.93, dec: 61.75, alt: 80 },
  },
  science: {
    constellation: 'Andromeda',
    centerCoordinate: { ra: 10.68, dec: 41.27, alt: 2537000 },
  },
  language_arts: {
    constellation: 'Lyra',
    centerCoordinate: { ra: 279.23, dec: 38.78, alt: 25 },
  },
  social_studies: {
    constellation: 'Pegasus',
    centerCoordinate: { ra: 343.74, dec: 15.21, alt: 1500 },
  },
  history: {
    constellation: 'Cassiopeia',
    centerCoordinate: { ra: 14.18, dec: 60.72, alt: 600 },
  },
  geography: {
    constellation: 'Carina',
    centerCoordinate: { ra: 161.26, dec: -59.51, alt: 310 },
  },
  arts: {
    constellation: 'Aquila',
    centerCoordinate: { ra: 297.70, dec: 8.87, alt: 17 },
  },
  music: {
    constellation: 'Cygnus',
    centerCoordinate: { ra: 310.36, dec: 45.28, alt: 1400 },
  },
  physical_education: {
    constellation: 'Hercules',
    centerCoordinate: { ra: 258.00, dec: 36.00, alt: 360 },
  },
  technology: {
    constellation: 'Gemini',
    centerCoordinate: { ra: 113.65, dec: 22.51, alt: 51 },
  },
  foreign_language: {
    constellation: 'Sagittarius',
    centerCoordinate: { ra: 283.00, dec: -30.00, alt: 26000 },
  },
};

/**
 * Coordinate generator for curriculum nodes
 */
export class CoordinateGenerator {
  private domainOffsets: Map<SubjectDomain, number> = new Map();

  /**
   * Generate coordinate for a curriculum node
   * Positions node relative to domain center, adjusted for grade level
   */
  generateCoordinate(
    domain: SubjectDomain,
    gradeLevel: number,
    conceptIndex: number
  ): AstronomicalCoordinate {
    const domainCenter = DOMAIN_CONSTELLATIONS[domain].centerCoordinate;

    // Get current offset for this domain
    const offset = this.domainOffsets.get(domain) || 0;
    this.domainOffsets.set(domain, offset + 1);

    // Grade level affects altitude (higher grades = greater altitude)
    const gradeMultiplier = 1 + (gradeLevel / 12);
    const baseAltitude = domainCenter.alt * gradeMultiplier;

    // Spread nodes in a spiral pattern around domain center
    const theta = (conceptIndex * 137.5) * (Math.PI / 180); // Golden angle spiral
    const radius = Math.sqrt(conceptIndex + 1) * 2; // Expand spiral outward

    const ra = domainCenter.ra + radius * Math.cos(theta);
    const dec = domainCenter.dec + radius * Math.sin(theta) * 0.5; // Less spread in declination
    const alt = baseAltitude + (conceptIndex * 0.5);

    return {
      ra: ((ra % 360) + 360) % 360, // Normalize to 0-360
      dec: Math.max(-90, Math.min(90, dec)), // Clamp to -90 to 90
      alt: Math.max(0, alt),
    };
  }

  /**
   * Reset offsets (for testing)
   */
  reset(): void {
    this.domainOffsets.clear();
  }
}

/**
 * Sample curriculum nodes for testing
 */
export function createSampleCurriculum(): CurriculumNode[] {
  const generator = new CoordinateGenerator();
  const nodes: CurriculumNode[] = [];

  // Kindergarten Math
  nodes.push({
    id: 'k_math_counting_1_10',
    coordinate: generator.generateCoordinate('mathematics', 0, 0),
    title: 'Counting 1-10',
    description: 'Learn to count from 1 to 10 with objects',
    gradeLevel: 0,
    domain: 'mathematics',
    prerequisites: [],
    estimatedDuration: 30,
    learningObjectives: [
      'Count to 10 by ones',
      'Recognize written numerals 1-10',
      'Count objects up to 10',
    ],
    assessments: ['assess_k_math_counting_1_10'],
    content: ['content_k_math_counting_1_10_lesson', 'content_k_math_counting_1_10_practice'],
    relatedNodes: ['k_math_number_recognition'],
    nextNodes: ['k_math_counting_11_20'],
    keywords: ['counting', 'numbers', 'numerals', 'objects'],
    difficulty: 0.1,
  });

  nodes.push({
    id: 'k_math_counting_11_20',
    coordinate: generator.generateCoordinate('mathematics', 0, 1),
    title: 'Counting 11-20',
    description: 'Extend counting skills from 11 to 20',
    gradeLevel: 0,
    domain: 'mathematics',
    prerequisites: ['k_math_counting_1_10'],
    estimatedDuration: 30,
    learningObjectives: [
      'Count to 20 by ones',
      'Recognize written numerals 11-20',
      'Count objects up to 20',
    ],
    assessments: ['assess_k_math_counting_11_20'],
    content: ['content_k_math_counting_11_20_lesson'],
    relatedNodes: ['k_math_addition_basics'],
    nextNodes: ['1_math_counting_100'],
    keywords: ['counting', 'numbers', 'teen numbers'],
    difficulty: 0.2,
  });

  // 1st Grade Math
  nodes.push({
    id: '1_math_counting_100',
    coordinate: generator.generateCoordinate('mathematics', 1, 0),
    title: 'Counting to 100',
    description: 'Count to 100 and understand place value',
    gradeLevel: 1,
    domain: 'mathematics',
    prerequisites: ['k_math_counting_11_20'],
    estimatedDuration: 45,
    learningObjectives: [
      'Count to 100 by ones and tens',
      'Understand tens and ones place value',
      'Skip count by 2s, 5s, and 10s',
    ],
    assessments: ['assess_1_math_counting_100'],
    content: ['content_1_math_counting_100_lesson', 'content_1_math_place_value'],
    relatedNodes: ['1_math_addition_subtraction'],
    nextNodes: ['2_math_counting_1000'],
    keywords: ['counting', 'place value', 'skip counting'],
    difficulty: 0.3,
  });

  // Kindergarten Language Arts
  nodes.push({
    id: 'k_la_alphabet',
    coordinate: generator.generateCoordinate('language_arts', 0, 0),
    title: 'Learning the Alphabet',
    description: 'Recognize and name all letters of the alphabet',
    gradeLevel: 0,
    domain: 'language_arts',
    prerequisites: [],
    estimatedDuration: 60,
    learningObjectives: [
      'Recognize all uppercase letters',
      'Recognize all lowercase letters',
      'Know letter names',
      'Understand alphabetical order',
    ],
    assessments: ['assess_k_la_alphabet'],
    content: ['content_k_la_alphabet_song', 'content_k_la_letter_recognition'],
    relatedNodes: ['k_la_letter_sounds'],
    nextNodes: ['k_la_phonics'],
    keywords: ['alphabet', 'letters', 'literacy'],
    difficulty: 0.1,
  });

  nodes.push({
    id: 'k_la_phonics',
    coordinate: generator.generateCoordinate('language_arts', 0, 1),
    title: 'Beginning Phonics',
    description: 'Learn letter sounds and simple word decoding',
    gradeLevel: 0,
    domain: 'language_arts',
    prerequisites: ['k_la_alphabet'],
    estimatedDuration: 45,
    learningObjectives: [
      'Know letter sounds',
      'Blend simple CVC words',
      'Segment words into phonemes',
    ],
    assessments: ['assess_k_la_phonics'],
    content: ['content_k_la_phonics_lesson', 'content_k_la_word_families'],
    relatedNodes: ['k_la_reading_basics'],
    nextNodes: ['1_la_reading_fluency'],
    keywords: ['phonics', 'sounds', 'reading', 'decoding'],
    difficulty: 0.3,
  });

  // 3rd Grade Science
  nodes.push({
    id: '3_sci_states_of_matter',
    coordinate: generator.generateCoordinate('science', 3, 0),
    title: 'States of Matter',
    description: 'Understand solids, liquids, and gases',
    gradeLevel: 3,
    domain: 'science',
    prerequisites: [],
    estimatedDuration: 60,
    learningObjectives: [
      'Identify three states of matter',
      'Describe properties of each state',
      'Understand phase changes',
    ],
    assessments: ['assess_3_sci_states_of_matter'],
    content: ['content_3_sci_matter_lesson', 'content_3_sci_matter_lab'],
    relatedNodes: ['3_sci_water_cycle'],
    nextNodes: ['4_sci_atoms_molecules'],
    standardsAlignment: [
      {
        framework: 'NGSS',
        standard: '2-PS1-1',
        description: 'Plan and conduct an investigation to describe and classify different kinds of materials',
      },
    ],
    keywords: ['matter', 'solid', 'liquid', 'gas', 'phase change'],
    difficulty: 0.4,
  });

  return nodes;
}

/**
 * Initialize the Living Library knowledge graph
 */
export function initializeLivingLibrary(): KnowledgeGraph {
  const sampleNodes = createSampleCurriculum();
  return buildKnowledgeGraph(sampleNodes);
}

/**
 * Visualize knowledge graph region
 */
export function visualizeRegion(
  graph: KnowledgeGraph,
  centerCoordinate: AstronomicalCoordinate,
  radius: number
): string {
  const nodes = Array.from(graph.nodes.values());
  const nearbyNodes = nodes.filter(node => {
    const distance = calculateDistance(centerCoordinate, node.coordinate);
    return distance <= radius;
  });

  let output = `Knowledge Graph Region (radius ${radius}°)\n`;
  output += `Center: RA ${centerCoordinate.ra.toFixed(2)}°, Dec ${centerCoordinate.dec.toFixed(2)}°, Alt ${centerCoordinate.alt.toFixed(0)} ly\n\n`;

  for (const node of nearbyNodes) {
    const distance = calculateDistance(centerCoordinate, node.coordinate);
    output += `[${node.gradeLevel}] ${node.domain}: ${node.title} (${distance.toFixed(2)}° away)\n`;
  }

  return output;
}

/**
 * Calculate angular distance
 */
function calculateDistance(
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

  return (angularDistance * 180) / Math.PI;
}
