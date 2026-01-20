/**
 * Living Library - Self-Contained Educational AI System
 *
 * Exports all four AI personas as standalone programs:
 * - Headmaster AI
 * - Teacher AI
 * - Counsellor AI
 * - Student AI
 */

// Persona Specifications
export * from './personas/persona-spec';
export * from './personas/headmaster';
export * from './personas/teacher';
export * from './personas/counsellor';
export * from './personas/student';

// Content System
export * from './content/content-types';
export * from './content/curriculum';
export * from './content/knowledge-graph';

// Gatekeeper Integration
export * from './gatekeeper/library-policies';
export * from './gatekeeper/access-control';
export * from './gatekeeper/teaching-adapter';

// Self-Contained Programs
export { HeadmasterProgram } from './programs/headmaster-program';
export { TeacherProgram } from './programs/teacher-program';
export { CounsellorProgram } from './programs/counsellor-program';
export { StudentProgram } from './programs/student-program';
