/**
 * Educational Content Type Definitions
 *
 * Defines the structure of educational content in the Living Library
 */

import { AstronomicalCoordinate } from '../personas/persona-spec';
import { SubjectDomain } from '../personas/teacher';

/**
 * Content types available in the library
 */
export type ContentType =
  | 'lesson'
  | 'activity'
  | 'video'
  | 'reading'
  | 'assessment'
  | 'exploration'
  | 'interactive'
  | 'project';

/**
 * Accessibility features for content
 */
export interface AccessibilityFeatures {
  closedCaptions: boolean;
  audioDescription: boolean;
  textToSpeech: boolean;
  adjustableFontSize: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  alternativeFormats: string[];      // e.g., ['braille', 'large_print']
}

/**
 * Content metadata
 */
export interface ContentMetadata {
  gradeLevel: number;                // 0-12 (K-12)
  domain: SubjectDomain;
  duration: number;                  // minutes
  difficulty: number;                // 0-1 (0 = beginner, 1 = advanced)
  accessibility: AccessibilityFeatures;
  tags: string[];
  language: string;                  // ISO 639-1 code
  lastUpdated: Date;
  version: number;
}

/**
 * Educational content in the Living Library
 */
export interface EducationalContent {
  id: string;
  type: ContentType;
  coordinate: AstronomicalCoordinate;
  title: string;
  description: string;
  metadata: ContentMetadata;

  // Adaptive versions for different grade levels
  adaptiveVersions: {
    gradeLevel: number;
    content: string | ContentBlock[];
  }[];

  // Prerequisites and related content
  prerequisites: string[];           // Content IDs
  relatedContent: string[];          // Content IDs
  nextSteps: string[];               // Content IDs
}

/**
 * Structured content block
 */
export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'audio' | 'interactive' | 'code' | 'math';
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Interactive content element
 */
export interface InteractiveContent extends EducationalContent {
  type: 'interactive';
  interactionType: 'simulation' | 'game' | 'quiz' | 'puzzle' | 'visualization';
  controls: InteractionControl[];
  feedback: FeedbackRule[];
}

/**
 * Interaction control
 */
export interface InteractionControl {
  id: string;
  type: 'button' | 'slider' | 'input' | 'choice' | 'drag_drop';
  label: string;
  options?: string[];
  validation?: ValidationRule;
}

/**
 * Validation rule
 */
export interface ValidationRule {
  type: 'regex' | 'range' | 'exact' | 'custom';
  value: string | number | [number, number];
  errorMessage?: string;
}

/**
 * Feedback rule
 */
export interface FeedbackRule {
  condition: string;                 // JavaScript expression
  feedback: string;
  type: 'success' | 'error' | 'hint' | 'info';
}

/**
 * Video content
 */
export interface VideoContent extends EducationalContent {
  type: 'video';
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;                  // seconds
  chapters: VideoChapter[];
  transcript?: string;
  subtitles?: Subtitle[];
}

/**
 * Video chapter
 */
export interface VideoChapter {
  title: string;
  timestamp: number;                 // seconds
  description?: string;
}

/**
 * Subtitle track
 */
export interface Subtitle {
  language: string;                  // ISO 639-1
  url: string;
  format: 'srt' | 'vtt' | 'sbv';
}

/**
 * Reading content
 */
export interface ReadingContent extends EducationalContent {
  type: 'reading';
  text: string;
  readingLevel: number;              // Flesch-Kincaid grade level
  wordCount: number;
  estimatedReadingTime: number;      // minutes
  vocabulary: VocabularyTerm[];
}

/**
 * Vocabulary term with definition
 */
export interface VocabularyTerm {
  term: string;
  definition: string;
  examples: string[];
  relatedTerms: string[];
}

/**
 * Project-based content
 */
export interface ProjectContent extends EducationalContent {
  type: 'project';
  objectives: string[];
  materials: string[];
  steps: ProjectStep[];
  rubric: ProjectRubric;
  exemplars: Exemplar[];
}

/**
 * Project step
 */
export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;             // minutes
  resources: string[];
  checkpoints: string[];
}

/**
 * Project rubric
 */
export interface ProjectRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

/**
 * Rubric criterion
 */
export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;                    // 0-1
  levels: RubricLevel[];
}

/**
 * Rubric level
 */
export interface RubricLevel {
  name: string;                      // e.g., "Exemplary", "Proficient"
  score: number;
  description: string;
  indicators: string[];
}

/**
 * Project exemplar
 */
export interface Exemplar {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  notes: string;
}

/**
 * Content collection (curated set of related content)
 */
export interface ContentCollection {
  id: string;
  title: string;
  description: string;
  curator: 'headmaster' | 'teacher' | 'system';
  contents: string[];                // Content IDs
  gradeLevel: number;
  domain: SubjectDomain;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get content by coordinate proximity
 */
export function getContentByProximity(
  coordinate: AstronomicalCoordinate,
  allContent: EducationalContent[],
  limit: number = 10
): EducationalContent[] {
  const withDistance = allContent.map(content => ({
    content,
    distance: calculateDistance(coordinate, content.coordinate),
  }));

  withDistance.sort((a, b) => a.distance - b.distance);

  return withDistance.slice(0, limit).map(item => item.content);
}

/**
 * Calculate distance between coordinates
 */
function calculateDistance(
  coord1: AstronomicalCoordinate,
  coord2: AstronomicalCoordinate
): number {
  const raDiff = coord2.ra - coord1.ra;
  const decDiff = coord2.dec - coord1.dec;
  const altDiff = (coord2.alt - coord1.alt) / 100;

  return Math.sqrt(raDiff ** 2 + decDiff ** 2 + altDiff ** 2);
}

/**
 * Filter content by grade level and domain
 */
export function filterContent(
  content: EducationalContent[],
  filters: {
    gradeLevel?: number;
    domain?: SubjectDomain;
    type?: ContentType;
    maxDifficulty?: number;
    tags?: string[];
  }
): EducationalContent[] {
  return content.filter(item => {
    if (filters.gradeLevel !== undefined && item.metadata.gradeLevel !== filters.gradeLevel) {
      return false;
    }

    if (filters.domain && item.metadata.domain !== filters.domain) {
      return false;
    }

    if (filters.type && item.type !== filters.type) {
      return false;
    }

    if (filters.maxDifficulty !== undefined && item.metadata.difficulty > filters.maxDifficulty) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasAllTags = filters.tags.every(tag => item.metadata.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    return true;
  });
}
