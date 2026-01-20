/**
 * Student AI - Self-Contained Program
 *
 * Learning companion, peer-level interaction, self-directed learning
 * Constellation: Cygnus (The Swan)
 */

import {
  STUDENT_SPEC,
  LearningProgress,
  MasteredConcept,
  ConceptProgress,
  Question,
  Achievement,
  LearningSession,
  CollaborationSession,
  recommendNextConcepts,
  canAccessContent,
  checkForAchievements,
  calculateRetention,
} from '../personas/student';
import { PersonaState, AstronomicalCoordinate } from '../personas/persona-spec';
import { KnowledgeGraph, initializeLivingLibrary, findNodesNearCoordinate } from '../content/knowledge-graph';
import { CurriculumNode } from '../content/curriculum';

/**
 * Student Program State
 */
export class StudentProgram {
  private state: PersonaState;
  private knowledgeGraph: KnowledgeGraph;
  private progress: LearningProgress;
  private questions: Question[] = [];
  private achievements: Achievement[] = [];
  private sessions: LearningSession[] = [];
  private collaborations: CollaborationSession[] = [];

  constructor(studentId: string, gradeLevel: number) {
    // Initialize persona state
    this.state = {
      personaId: studentId,
      spec: STUDENT_SPEC,
      currentCoordinate: STUDENT_SPEC.celestialHomeBase,
      memoryUsage: 0,
      lastInteraction: new Date(),
    };

    // Initialize knowledge graph
    this.knowledgeGraph = initializeLivingLibrary();

    // Initialize learning progress
    this.progress = {
      studentId,
      gradeLevel,
      currentCoordinate: STUDENT_SPEC.celestialHomeBase,
      masteredConcepts: [],
      inProgress: [],
      recommendedNext: [],
      totalLearningTime: 0,
      lastActive: new Date(),
    };
  }

  /**
   * Get current state
   */
  getState(): PersonaState {
    return { ...this.state };
  }

  /**
   * Get learning progress
   */
  getProgress(): LearningProgress {
    return { ...this.progress };
  }

  /**
   * Start learning session
   */
  startSession(lessonId: string): LearningSession {
    const session: LearningSession = {
      id: `session_${Date.now()}`,
      studentId: this.state.personaId,
      lessonId,
      startedAt: new Date(),
      timeSpent: 0,
      completed: false,
      notes: [],
      questionsAsked: 0,
    };

    this.sessions.push(session);
    this.progress.lastActive = new Date();
    this.state.lastInteraction = new Date();
    return session;
  }

  /**
   * Complete learning session
   */
  completeSession(sessionId: string, comprehensionScore: number): void {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.completed) return;

    session.completed = true;
    session.endedAt = new Date();
    session.timeSpent = (session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60);
    session.comprehensionScore = comprehensionScore;

    this.progress.totalLearningTime += session.timeSpent;
    this.progress.lastActive = new Date();

    // Check for achievements
    const newAchievements = checkForAchievements(this.progress, session);
    this.achievements.push(...newAchievements);

    this.state.lastInteraction = new Date();
  }

  /**
   * Ask question to teacher
   */
  askQuestion(question: string, subject?: string, context?: string): Question {
    const q: Question = {
      id: `question_${Date.now()}`,
      studentId: this.state.personaId,
      recipient: 'teacher',
      subject: subject as any,
      question,
      context,
      askedAt: new Date(),
      answered: false,
      followUpQuestions: [],
    };

    this.questions.push(q);

    // Increment question count for current session
    const currentSession = this.sessions[this.sessions.length - 1];
    if (currentSession && !currentSession.completed) {
      currentSession.questionsAsked++;
    }

    this.state.lastInteraction = new Date();
    return q;
  }

  /**
   * Receive answer to question
   */
  receiveAnswer(questionId: string, answer: string): void {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return;

    question.answered = true;
    question.answer = answer;
    question.answeredAt = new Date();
    this.state.lastInteraction = new Date();
  }

  /**
   * Master a concept
   */
  masterConcept(conceptId: string, conceptName: string, domain: any, coordinate: AstronomicalCoordinate): void {
    // Remove from in-progress
    this.progress.inProgress = this.progress.inProgress.filter(c => c.conceptId !== conceptId);

    // Add to mastered
    const masteredConcept: MasteredConcept = {
      conceptId,
      conceptName,
      domain,
      coordinate,
      masteredAt: new Date(),
      confidence: 0.9,
      retentionScore: 0.9,
    };

    this.progress.masteredConcepts.push(masteredConcept);
    this.progress.currentCoordinate = coordinate;

    // Update recommendations
    this.updateRecommendations();

    this.state.lastInteraction = new Date();
  }

  /**
   * Start working on a concept
   */
  startConcept(conceptId: string, conceptName: string, domain: any, coordinate: AstronomicalCoordinate): void {
    const inProgress: ConceptProgress = {
      conceptId,
      conceptName,
      domain,
      coordinate,
      startedAt: new Date(),
      progress: 0,
      attempts: 0,
      lastPractice: new Date(),
      strugglingAreas: [],
    };

    this.progress.inProgress.push(inProgress);
    this.state.lastInteraction = new Date();
  }

  /**
   * Update concept progress
   */
  updateConceptProgress(conceptId: string, progressDelta: number): void {
    const concept = this.progress.inProgress.find(c => c.conceptId === conceptId);
    if (!concept) return;

    concept.progress = Math.min(1.0, concept.progress + progressDelta);
    concept.attempts++;
    concept.lastPractice = new Date();

    // If progress reaches 1.0, consider it mastered
    if (concept.progress >= 1.0) {
      this.masterConcept(concept.conceptId, concept.conceptName, concept.domain, concept.coordinate);
    }

    this.state.lastInteraction = new Date();
  }

  /**
   * Update recommendations based on current progress
   */
  private updateRecommendations(): void {
    const allNodes = Array.from(this.knowledgeGraph.nodes.values());
    const recommendations = recommendNextConcepts(
      this.progress,
      allNodes.map(n => ({
        id: n.id,
        prerequisites: n.prerequisites,
        coordinate: n.coordinate,
      }))
    );

    this.progress.recommendedNext = recommendations;
  }

  /**
   * Check if can access content
   */
  canAccess(contentGradeLevel: number, allowAboveGrade: boolean = false): boolean {
    return canAccessContent(this.progress.gradeLevel, contentGradeLevel, allowAboveGrade);
  }

  /**
   * Explore nearby concepts in knowledge graph
   */
  exploreCelestialRegion(radius: number = 10): CurriculumNode[] {
    const nearbyNodes = findNodesNearCoordinate(
      this.knowledgeGraph,
      this.progress.currentCoordinate,
      radius
    );

    // Filter to grade-appropriate content
    const accessible = nearbyNodes.filter(node =>
      canAccessContent(this.progress.gradeLevel, node.gradeLevel)
    );

    this.state.lastInteraction = new Date();
    return accessible;
  }

  /**
   * Join collaboration session
   */
  joinCollaboration(topic: string, domain: any): CollaborationSession {
    const session: CollaborationSession = {
      id: `collab_${Date.now()}`,
      participants: [this.state.personaId],
      topic,
      domain,
      startedAt: new Date(),
      contributions: [],
    };

    this.collaborations.push(session);
    this.state.lastInteraction = new Date();
    return session;
  }

  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  /**
   * Get unanswered questions
   */
  getUnansweredQuestions(): Question[] {
    return this.questions.filter(q => !q.answered);
  }

  /**
   * Update retention scores for mastered concepts
   */
  updateRetentionScores(): void {
    const now = new Date();

    for (const concept of this.progress.masteredConcepts) {
      concept.retentionScore = calculateRetention(concept.masteredAt, concept.confidence);
    }

    this.state.lastInteraction = now;
  }

  /**
   * Export state for persistence
   */
  export(): object {
    return {
      state: this.state,
      progress: this.progress,
      questions: this.questions,
      achievements: this.achievements,
      sessions: this.sessions,
      collaborations: this.collaborations,
    };
  }

  /**
   * Import state from persistence
   */
  import(data: any): void {
    if (data.state) this.state = data.state;
    if (data.progress) this.progress = data.progress;
    if (data.questions) this.questions = data.questions;
    if (data.achievements) this.achievements = data.achievements;
    if (data.sessions) this.sessions = data.sessions;
    if (data.collaborations) this.collaborations = data.collaborations;
  }
}

/**
 * Create and run Student program
 */
export function createStudent(studentId: string, gradeLevel: number): StudentProgram {
  return new StudentProgram(studentId, gradeLevel);
}
