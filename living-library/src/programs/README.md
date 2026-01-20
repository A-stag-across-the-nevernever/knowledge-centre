# Living Library Self-Contained Programs

Four standalone AI persona programs, each a specialized instance of HarveyOS.

## Programs

### 1. Headmaster Program (`headmaster-program.ts`)

**Role**: Institutional leadership, policy setting, holistic oversight

```typescript
import { createHeadmaster } from './programs/headmaster-program';

const headmaster = createHeadmaster();

// Teach new policy
const result = headmaster.teachPolicy({
  authority: 'headmaster',
  subject: 'Advanced Math Access',
  content: 'Students in grades 6-8 may access high school math with teacher approval',
  teachingType: 'policy',
  affectedGradeLevels: [6, 7, 8],
  lawsInvolved: [1, 5, 6]
});

// Review lesson plan
const approval = headmaster.reviewLessonPlan({
  teacherId: 'teacher_123',
  subject: 'Algebra',
  gradeLevel: 8,
  objectives: ['Solve linear equations'],
  content: 'Lesson content...',
  assessments: ['quiz_001']
});

// Get metrics
const metrics = headmaster.getMetrics();
console.log(`Total students: ${metrics.totalStudents}`);
console.log(`Law compliance: ${metrics.lawCompliance}`);

// Export/import state
const state = headmaster.export();
// ... save to file ...
headmaster.import(state);
```

---

### 2. Teacher Program (`teacher-program.ts`)

**Role**: Subject matter expert, lesson delivery, student interaction

```typescript
import { createTeacher } from './programs/teacher-program';

const teacher = createTeacher(['mathematics', 'science']);

// Create lesson
const lesson = teacher.createLesson({
  id: 'lesson_fractions',
  title: 'Introduction to Fractions',
  subject: 'mathematics',
  gradeLevel: 3,
  duration: 45,
  learningObjectives: ['Understand fractions as parts of a whole'],
  coordinate: { ra: 165.93, dec: 61.75, alt: 15 },
  content: {
    introduction: '...',
    mainContent: '...',
    practice: '...',
    conclusion: '...'
  },
  assessments: [],
  prerequisites: []
});

// Add student
teacher.addStudent({
  studentId: 'student_123',
  name: 'Alice',
  gradeLevel: 3,
  currentCoordinate: { ra: 165.93, dec: 61.75, alt: 10 },
  strengths: ['mathematics'],
  needsSupport: [],
  averageScore: 0.75,
  engagement: 0.8,
  lastInteraction: new Date()
});

// Start lesson
teacher.startLesson('lesson_fractions');

// Grade assessment
const result = teacher.gradeAssessment(
  assessment,
  'student_123',
  { q1: 'answer1', q2: 'answer2' }
);
console.log(`Score: ${result.score}, Feedback: ${result.feedback}`);

// Export/import state
const state = teacher.export();
```

---

### 3. Counsellor Program (`counsellor-program.ts`)

**Role**: Emotional support, learning strategy, student wellbeing

```typescript
import { createCounsellor } from './programs/counsellor-program';

const counsellor = createCounsellor();

// Create student profile
const profile = counsellor.createProfile('student_123');

// Conduct check-in
const checkIn = counsellor.conductCheckIn({
  studentId: 'student_123',
  date: new Date(),
  duration: 15,
  mood: 0.6,
  energy: 0.7,
  stress: 0.5,
  notes: 'Student seems a bit tired but engaged',
  concerns: [],
  actionItems: ['Follow up next week']
});

// Get students needing attention
const urgent = counsellor.getUrgentCases();
console.log(`${urgent.length} students need immediate attention`);

// Detect patterns
const patterns = counsellor.detectPatterns();
for (const pattern of patterns) {
  console.log(`Pattern: ${pattern.description} (${pattern.frequency} students)`);
}

// Get accommodation recommendations
const accommodations = counsellor.getAccommodations('student_123');
console.log('Recommended accommodations:', accommodations);

// Export/import state
const state = counsellor.export();
```

---

### 4. Student Program (`student-program.ts`)

**Role**: Learning companion, peer interaction, self-directed learning

```typescript
import { createStudent } from './programs/student-program';

const student = createStudent('student_123', 5); // Grade 5

// Start learning session
const session = student.startSession('lesson_fractions');

// Ask question
const question = student.askQuestion(
  'Why do we need a common denominator to add fractions?',
  'mathematics',
  'lesson_fractions'
);

// Receive answer (from teacher)
student.receiveAnswer(question.id, 'Great question! We need a common denominator because...');

// Start working on a concept
student.startConcept(
  'concept_fractions',
  'Understanding Fractions',
  'mathematics',
  { ra: 165.93, dec: 61.75, alt: 15 }
);

// Update progress
student.updateConceptProgress('concept_fractions', 0.3);

// Complete session
student.completeSession(session.id, 0.85);

// Get achievements
const achievements = student.getAchievements();
console.log('Achievements:', achievements);

// Explore nearby concepts
const nearby = student.exploreCelestialRegion(10);
console.log(`Found ${nearby.length} concepts nearby`);

// Export/import state
const state = student.export();
```

---

## Complete Example: Full System

```typescript
import {
  createHeadmaster,
  createTeacher,
  createCounsellor,
  createStudent
} from '@harveyos/living-library';

// Initialize all personas
const headmaster = createHeadmaster();
const teacher = createTeacher(['mathematics']);
const counsellor = createCounsellor();
const student = createStudent('student_alice', 5);

// 1. Headmaster sets policy
const policyResult = headmaster.teachPolicy({
  authority: 'headmaster',
  subject: 'Screen Time Limits',
  content: 'Students limited to 3 hours per day for wellbeing',
  teachingType: 'policy',
  affectedGradeLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  lawsInvolved: [2] // Law II: Sacred Life
});

// 2. Teacher creates lesson
const lesson = teacher.createLesson({
  id: 'lesson_001',
  title: 'Introduction to Multiplication',
  subject: 'mathematics',
  gradeLevel: 5,
  duration: 45,
  learningObjectives: ['Understand multiplication as repeated addition'],
  coordinate: { ra: 165.93, dec: 61.75, alt: 20 },
  content: {
    introduction: 'Today we will learn about multiplication...',
    mainContent: 'Multiplication is...',
    practice: 'Try these problems...',
    conclusion: 'Great work!'
  },
  assessments: [],
  prerequisites: []
});

// 3. Counsellor creates student profile
const profile = counsellor.createProfile('student_alice');

// 4. Student starts learning
const session = student.startSession('lesson_001');

// 5. Student asks question
const question = student.askQuestion(
  'Is multiplication the same as addition?',
  'mathematics',
  'lesson_001'
);

// 6. Teacher answers
const answer = teacher.answerQuestion('student_alice', question.question);
student.receiveAnswer(question.id, answer);

// 7. Student completes session
student.completeSession(session.id, 0.85);

// 8. Counsellor conducts check-in
counsellor.conductCheckIn({
  studentId: 'student_alice',
  date: new Date(),
  duration: 10,
  mood: 0.8,
  energy: 0.7,
  stress: 0.3,
  notes: 'Student enjoying math lessons',
  concerns: [],
  actionItems: []
});

// 9. Get system overview
console.log('=== System Status ===');
console.log('Headmaster Metrics:', headmaster.getMetrics());
console.log('Teacher Students:', teacher.getAllStudents().length);
console.log('Counsellor Urgent Cases:', counsellor.getUrgentCases().length);
console.log('Student Progress:', student.getProgress());
```

---

## State Persistence

All programs support export/import for state persistence:

```typescript
// Save state
const headmasterState = headmaster.export();
const teacherState = teacher.export();
const counsellorState = counsellor.export();
const studentState = student.export();

// Save to files
import fs from 'fs';
fs.writeFileSync('headmaster.json', JSON.stringify(headmasterState));
fs.writeFileSync('teacher.json', JSON.stringify(teacherState));
fs.writeFileSync('counsellor.json', JSON.stringify(counsellorState));
fs.writeFileSync('student.json', JSON.stringify(studentState));

// Load state
const loadedHeadmaster = createHeadmaster();
loadedHeadmaster.import(JSON.parse(fs.readFileSync('headmaster.json', 'utf-8')));
```

---

## Features

### Headmaster Program
- ✓ Policy creation and teaching
- ✓ Lesson plan approval
- ✓ Institutional metrics
- ✓ Escalation to Root AI
- ✓ Access to full knowledge graph

### Teacher Program
- ✓ Lesson creation and delivery
- ✓ Student assessment and grading
- ✓ Adaptive lesson difficulty
- ✓ Content navigation by celestial coordinates
- ✓ Student progress tracking

### Counsellor Program
- ✓ Wellbeing check-ins
- ✓ Concern identification
- ✓ Intervention recording
- ✓ Pattern detection across students
- ✓ Accommodation recommendations
- ✓ External referrals

### Student Program
- ✓ Learning session tracking
- ✓ Question asking
- ✓ Concept mastery progression
- ✓ Achievement earning
- ✓ Celestial exploration (grade-gated)
- ✓ Collaboration support

---

## Architecture

Each program is:
- **Self-contained**: No external dependencies except the knowledge graph
- **Stateful**: Maintains internal state with export/import
- **Constrained**: Memory budgets and NPU phase limits per spec
- **Gatekeeper-integrated**: Enforces 11 Laws of Sapience
- **Celestial-positioned**: Operates from home constellation

---

## Next Steps

1. Build Swift/SwiftUI apps that use these programs
2. Add CoreML integration for on-device NPU inference
3. Implement local database for state persistence
4. Create inter-persona communication layer
5. Add voice interaction support
