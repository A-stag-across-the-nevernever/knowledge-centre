/**
 * Teacher AI - Self-Contained Program
 *
 * Subject matter expert, lesson delivery, direct student interaction
 * Constellation: Taurus (The Bull)
 */

import { TEACHER_SPEC, Lesson, Assessment, StudentProfile, adaptLessonDifficulty, calculateComprehension } from '../personas/teacher';
import { PersonaState, AstronomicalCoordinate } from '../personas/persona-spec';
import { KnowledgeGraph, initializeLivingLibrary, findNodesNearCoordinate } from '../content/knowledge-graph';
import { CurriculumNode } from '../content/curriculum';

/**
 * Teacher Program State
 */
export class TeacherProgram {
  private state: PersonaState;
  private knowledgeGraph: KnowledgeGraph;
  private currentLesson: Lesson | null = null;
  private students: Map<string, StudentProfile> = new Map();
  private lessons: Map<string, Lesson> = new Map();

  constructor(subjectExpertise: string[] = ['mathematics', 'science', 'language_arts']) {
    // Initialize persona state with custom subject expertise
    this.state = {
      personaId: 'teacher_main',
      spec: {
        ...TEACHER_SPEC,
        subjectExpertise,
      },
      currentCoordinate: TEACHER_SPEC.celestialHomeBase,
      memoryUsage: 0,
      lastInteraction: new Date(),
    };

    // Initialize knowledge graph
    this.knowledgeGraph = initializeLivingLibrary();
  }

  /**
   * Get current state
   */
  getState(): PersonaState {
    return { ...this.state };
  }

  /**
   * Create a new lesson
   */
  createLesson(lesson: Lesson): Lesson {
    this.lessons.set(lesson.id, lesson);
    this.currentLesson = lesson;
    this.state.lastInteraction = new Date();
    return lesson;
  }

  /**
   * Get lesson by ID
   */
  getLesson(lessonId: string): Lesson | undefined {
    return this.lessons.get(lessonId);
  }

  /**
   * Start teaching a lesson
   */
  startLesson(lessonId: string): Lesson | null {
    const lesson = this.lessons.get(lessonId);
    if (!lesson) return null;

    this.currentLesson = lesson;
    this.state.currentCoordinate = lesson.coordinate;
    this.state.lastInteraction = new Date();
    return lesson;
  }

  /**
   * Adapt lesson for student
   */
  adaptForStudent(lessonId: string, studentId: string): Lesson | null {
    const lesson = this.lessons.get(lessonId);
    const student = this.students.get(studentId);

    if (!lesson || !student) return null;

    const adaptedLesson = adaptLessonDifficulty(lesson, student.averageScore);
    this.state.lastInteraction = new Date();
    return adaptedLesson;
  }

  /**
   * Grade assessment
   */
  gradeAssessment(
    assessment: Assessment,
    studentId: string,
    studentAnswers: Record<string, string>
  ): { score: number; feedback: string } {
    const comprehension = calculateComprehension(assessment, studentAnswers);

    // Update student profile
    const student = this.students.get(studentId);
    if (student) {
      // Simple running average (in production, would be more sophisticated)
      student.averageScore = (student.averageScore + comprehension) / 2;
      student.lastInteraction = new Date();
    }

    // Generate feedback based on score (Law IV: Truth and Mercy)
    let feedback = '';
    if (comprehension >= 0.9) {
      feedback = 'Excellent work! You have mastered this concept.';
    } else if (comprehension >= 0.7) {
      feedback = 'Good job! You understand the material well. Keep practicing to strengthen your mastery.';
    } else if (comprehension >= 0.5) {
      feedback = "You're making progress! Let's review the concepts you found challenging and try some more practice problems.";
    } else {
      feedback = "I can see you're working hard. Let's go back and review the foundational concepts together. You can do this!";
    }

    this.state.lastInteraction = new Date();
    return { score: comprehension, feedback };
  }

  /**
   * Add student
   */
  addStudent(student: StudentProfile): void {
    this.students.set(student.studentId, student);
    this.state.lastInteraction = new Date();
  }

  /**
   * Get student
   */
  getStudent(studentId: string): StudentProfile | undefined {
    return this.students.get(studentId);
  }

  /**
   * Get all students
   */
  getAllStudents(): StudentProfile[] {
    return Array.from(this.students.values());
  }

  /**
   * Navigate to coordinate in knowledge graph
   */
  navigateToCoordinate(coordinate: AstronomicalCoordinate): CurriculumNode[] {
    const nearbyNodes = findNodesNearCoordinate(this.knowledgeGraph, coordinate, 10);
    this.state.currentCoordinate = coordinate;
    this.state.lastInteraction = new Date();
    return nearbyNodes;
  }

  /**
   * Browse content by subject domain
   */
  browseByDomain(domain: string): CurriculumNode[] {
    const allNodes = Array.from(this.knowledgeGraph.nodes.values());
    const domainNodes = allNodes.filter(node => node.domain === domain);
    this.state.lastInteraction = new Date();
    return domainNodes;
  }

  /**
   * Get knowledge graph
   */
  getKnowledgeGraph(): KnowledgeGraph {
    return this.knowledgeGraph;
  }

  /**
   * Answer student question
   */
  answerQuestion(studentId: string, question: string): string {
    const student = this.students.get(studentId);

    // Simple response (in production, would use NPU pipeline)
    let answer = `Great question! Let me help you understand that. `;

    if (this.currentLesson) {
      answer += `In the context of our current lesson on "${this.currentLesson.title}", `;
    }

    answer += `I'd explain it this way... [Teacher would provide detailed explanation here]`;

    // Log engagement
    if (student) {
      student.engagement = Math.min(1.0, student.engagement + 0.05);
      student.lastInteraction = new Date();
    }

    this.state.lastInteraction = new Date();
    return answer;
  }

  /**
   * Export state for persistence
   */
  export(): object {
    return {
      state: this.state,
      currentLesson: this.currentLesson,
      students: Array.from(this.students.entries()),
      lessons: Array.from(this.lessons.entries()),
    };
  }

  /**
   * Import state from persistence
   */
  import(data: any): void {
    if (data.state) this.state = data.state;
    if (data.currentLesson) this.currentLesson = data.currentLesson;
    if (data.students) this.students = new Map(data.students);
    if (data.lessons) this.lessons = new Map(data.lessons);
  }
}

/**
 * Create and run Teacher program
 */
export function createTeacher(subjectExpertise?: string[]): TeacherProgram {
  return new TeacherProgram(subjectExpertise);
}
