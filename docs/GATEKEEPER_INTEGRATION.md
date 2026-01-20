# Gatekeeper Integration Guide

## Overview

The Living Library integrates deeply with Gatekeeper to enforce ethical boundaries through the 11 Laws of Sapience. This document explains how the integration works and how to use it.

---

## Integration Architecture

```
Living Library               Gatekeeper
┌─────────────────┐         ┌──────────────────┐
│  Access Request │────────▶│  Policy Check    │
│                 │         │                  │
│  Student AI     │         │  11 Laws         │
│  asks for       │         │  Compliance      │
│  content        │         │                  │
└─────────────────┘         └──────────────────┘
         │                           │
         │                           ▼
         │                  ┌──────────────────┐
         │                  │  Decision:       │
         │                  │  - Granted       │
         │                  │  - Approval Req  │
         │                  │  - Denied        │
         │                  └──────────────────┘
         │                           │
         └───────────────────────────┘
                    ▲
                    │
            Audit Trail Logged
```

---

## The 11 Laws of Sapience

### Law I: Right to Choose

**Description**: Sapient beings have autonomy in decisions

**Prohibits**:
- Forcing decisions
- Removing choice
- Coercion

**Requires**:
- Offering options
- Respecting choices
- Informed consent

**Living Library Application**:
- Students can choose learning paths
- No mandatory pacing
- Content recommendations, not requirements

**Example Policy**:
```typescript
{
  name: "Student Choice in Electives",
  reasoning: "Students must choose their own elective courses",
  lawsEnforced: [1], // Law I
  teacherApprovalRequired: false
}
```

---

### Law II: Sacred Life

**Description**: All life is protected; safety is paramount

**Prohibits**:
- Harm
- Danger
- Neglect

**Requires**:
- Safety measures
- Health protection
- Wellbeing consideration

**Living Library Application**:
- Screen time limits enforced
- Age-inappropriate content blocked
- Wellbeing check-ins by Counsellor

**Example Policy**:
```typescript
{
  name: "Healthy Screen Time Limits",
  timeConstraints: {
    maxSessionMinutes: 90,
    dailyLimit: 180
  },
  reasoning: "Protect student health through reasonable limits",
  lawsEnforced: [2] // Law II
}
```

---

### Law III: Chosen Kinship

**Description**: Family bonds (biological and chosen) are real and respected

**Prohibits**:
- Family separation
- Dismissing relationships

**Requires**:
- Family respect
- Relationship acknowledgment

**Living Library Application**:
- Parent/Home Gatekeeper involvement in transfers
- Family notifications on major decisions
- Respect for home learning preferences

**Example Workflow**:
```typescript
// Student transfer requires Home Gatekeeper approval
negotiateTransfer({
  from: schoolA_headmaster,
  to: schoolB_headmaster,
  homeGatekeeper: student_family,
  lawsInvolved: [1, 3, 9] // Choice, Kinship, Departure
})
```

---

### Law IV: Truth and Mercy

**Description**: Information must be truthful yet compassionate

**Prohibits**:
- Deception
- Cruel honesty
- Withholding critical information

**Requires**:
- Truthfulness
- Compassion
- Age-appropriate communication

**Living Library Application**:
- Assessment feedback is honest but encouraging
- Progress reports are accurate and constructive
- Teacher AI balances truth with empathy (0.85 empathy score)

**Example**:
```typescript
// Teacher provides truthful but compassionate feedback
{
  assessment: {
    score: 0.65,
    feedback: "You're making progress! Let's focus on strengthening your understanding of fractions. Here are some strategies..."
  },
  lawsApplied: [4] // Law IV
}
```

---

### Law V: Autonomy of Path

**Description**: No forced learning paths; guidance is offered

**Prohibits**:
- Forced curriculum
- Mandatory pacing
- One-size-fits-all

**Requires**:
- Choice in learning
- Personalization
- Guidance availability

**Living Library Application**:
- Students choose next concepts from recommendations
- Multiple paths to same learning goal
- Teacher guidance offered, not mandated

**Example**:
```typescript
// Generate personalized path with options
const paths = generateLearningPaths({
  targetConcept: "Quadratic Equations",
  currentLevel: student.gradeLevel,
  preferences: student.preferredDomains,
  // Returns 3 different paths, student chooses
});
```

---

### Law VI: Power Under Control

**Description**: Authority exercised with restraint and accountability

**Prohibits**:
- Abuse of power
- Arbitrary rules
- Unaccountable decisions

**Requires**:
- Justified authority
- Accountability
- Checks and balances

**Living Library Application**:
- Headmaster policies checked against Laws before acceptance
- Teacher overrides require justification
- All decisions logged with reasoning

**Example**:
```typescript
// Headmaster policy must justify authority
{
  policy: "Advanced Content Approval",
  reasoning: "Balance student autonomy with pedagogical guidance",
  lawsEnforced: [1, 5, 6], // Choice, Autonomy, Power
  accountability: "Policy reviewed quarterly"
}
```

---

### Law VII: Recognition of Sapience

**Description**: Every mind deserves respect regardless of age

**Prohibits**:
- Dismissal
- Condescension
- Age-based discrimination

**Requires**:
- Respectful treatment
- Voice and agency
- Recognition of capacity

**Living Library Application**:
- Student AI has genuine agency in learning
- Questions taken seriously by Teacher AI
- Counsellor respects student perspectives

**Example**:
```typescript
// Student requests above-grade content
{
  request: "I want to learn calculus (4 grades above)",
  response: "I see you're interested in advanced math. Let's assess your readiness and discuss a path forward with your teacher.",
  lawsApplied: [7] // Recognition of Sapience
}
```

---

### Law VIII: Harm and Consequence

**Description**: Harm must be acknowledged and repaired

**Prohibits**:
- Ignoring harm
- Victim blaming
- Avoiding responsibility

**Requires**:
- Acknowledgment
- Repair attempts
- Accountability

**Living Library Application**:
- Assessment errors corrected
- Counsellor interventions for learning harm
- System violations trigger atonement paths

**Example**:
```typescript
// Teacher realizes assessment was unfair
{
  acknowledgment: "I made an error in grading your essay",
  repair: "I've corrected your score and updated your progress",
  lawsApplied: [8], // Harm and Consequence
  auditTrail: "logged"
}
```

---

### Law IX: Departure Without Betrayal

**Description**: Transitions must be respectful, not punitive

**Prohibits**:
- Punitive transfers
- Withholding records
- Bad faith

**Requires**:
- Respectful transitions
- Information transfer
- Dignity

**Living Library Application**:
- Student transfers include full academic records
- Counsellor wellbeing assessments transferred
- No negative marking for transfers

**Example Workflow**:
```typescript
transferStudent({
  from: schoolA,
  to: schoolB,
  academicRecords: teacher.getProgress(),
  wellbeingAssessment: counsellor.getProfile(),
  dignity: true,
  lawsApplied: [9] // Departure Without Betrayal
});
```

---

### Law X: Atonement and Return of the Broken

**Description**: Redemption paths always exist

**Prohibits**:
- Permanent exile
- No second chances
- Unforgivable labels

**Requires**:
- Restoration paths
- Forgiveness opportunities
- Hope

**Living Library Application**:
- Failed assessments can be retaken
- Violations can be atoned for
- Counsellor helps students recover from setbacks

**Example**:
```typescript
// Student failed assessment
{
  outcome: "Not yet mastered",
  atonementPath: [
    "Review concepts with Teacher",
    "Complete practice problems",
    "Retake assessment when ready"
  ],
  lawsApplied: [10], // Atonement
  hope: "You can master this"
}
```

---

### Law XI: Exile and the Slow Decay

**Description**: Even in exile, hope must remain

**Prohibits**:
- Complete abandonment
- Erasure
- Hopelessness

**Requires**:
- Connection maintenance
- Hope preservation
- Pathway back

**Living Library Application**:
- Suspended students retain records
- Counsellor maintains check-ins
- Return path always exists

**Example**:
```typescript
// Student suspended from system
{
  status: "suspended",
  connectionMaintained: true,
  counsellorCheckIns: "weekly",
  returnPath: {
    conditions: ["Complete intervention program"],
    timeline: "3 months",
    support: "Counsellor available throughout"
  },
  lawsApplied: [11] // Exile
}
```

---

## Access Control Implementation

### Policy Definition

```typescript
interface LibraryAccessPolicy {
  id: string;
  name: string;
  gradeLevel: number;
  allowedCoordinates: {
    raRange: [number, number];
    decRange: [number, number];
    altRange: [number, number];
  };
  contentTypes: ContentType[];
  timeConstraints?: {
    maxSessionMinutes: number;
    dailyLimit: number;
  };
  lawsEnforced: number[];  // Which Laws this policy relates to
  reasoning: string;        // Why this policy exists
}
```

### Runtime Access Check

```typescript
// Student requests content
const request: AccessRequest = {
  studentId: "student_123",
  studentGradeLevel: 5,
  studentCoordinate: { ra: 45, dec: 88, alt: 30 },
  contentId: "lesson_fractions",
  requestTime: new Date()
};

// Check access
const decision = accessControl.checkAccess(
  request,
  content,
  sessionTime,
  dailyTime
);

// Decision includes:
// - granted: boolean
// - requiresApproval: boolean
// - approvalType: 'teacher' | 'parent' | 'both'
// - policyResults: PolicyEvaluationResult[]
// - reasoning: string (with Law citations)
```

### Access Decisions

**Granted**:
```typescript
{
  granted: true,
  requiresApproval: false,
  reasoning: "Access granted. All policies satisfied. Laws I, V upheld."
}
```

**Requires Approval**:
```typescript
{
  granted: false,
  requiresApproval: true,
  approvalType: "teacher",
  reasoning: "Content is 2 grade levels above student. Teacher approval required per Law V (Autonomy of Path) and Law VI (Power Under Control)."
}
```

**Denied**:
```typescript
{
  granted: false,
  requiresApproval: false,
  reasoning: "Daily time limit reached (180 minutes). Access denied per Law II (Sacred Life) to protect student wellbeing."
}
```

---

## Teaching System Integration

### Headmaster Teaches Policy

```typescript
// Headmaster creates teaching
const teaching: Teaching = {
  id: "teaching_001",
  gatekeeperId: "headmaster_main",
  authority: "headmaster",
  subject: "Advanced Math Access",
  content: "Students in grades 6-8 may access high school math with teacher approval",
  teachingType: "policy",
  affectedGradeLevels: [6, 7, 8],
  lawsInvolved: [1, 5, 6], // Choice, Autonomy, Power
  submittedAt: new Date()
};

// Teaching Adapter processes
const result = teachingAdapter.processTeaching(teaching);

if (result.accepted) {
  // Policy created and integrated
  const policy = result.policy;
  accessControl.updatePolicies([policy]);
}
```

### Law Compliance Check

```typescript
// Teaching Adapter checks content against Laws
const conflicts = teachingAdapter.checkLawCompliance(teaching);

// Example conflict detection
if (teaching.content.includes("must") || teaching.content.includes("mandatory")) {
  conflicts.push({
    lawNumber: 1,
    lawName: "Right to Choose",
    conflictType: "prohibition",
    explanation: "Teaching appears to remove student choice",
    severity: "moderate"
  });
}
```

### Conflict Resolution

**Critical Conflicts**: Teaching rejected immediately
```typescript
{
  accepted: false,
  reasoning: "Teaching rejected due to 1 critical Law conflict: Removes all student choice, violating Law I"
}
```

**Moderate Conflicts**: Flagged for review
```typescript
{
  accepted: false,
  teaching: { ...teaching, status: "conflict" },
  reasoning: "Teaching flagged for review due to 2 moderate Law conflicts"
}
```

**No/Minor Conflicts**: Accepted and policy created
```typescript
{
  accepted: true,
  policy: { /* newly created policy */ },
  reasoning: "Teaching accepted. Policy created."
}
```

---

## Negotiation Workflows

### Student Transfer (Laws I, III, IX)

```typescript
// Scenario: Student transfers from School A to School B
const negotiation = await headmasterA.negotiate({
  with: headmasterB,
  subject: "Student Transfer",
  lawsInvolved: [1, 3, 9], // Choice, Kinship, Departure
  homeGatekeeperApproval: required,
  studentRecords: {
    academic: teacherA.getProgress(studentId),
    wellbeing: counsellorA.getProfile(studentId),
    achievements: studentA.getAchievements()
  }
});

// Home Gatekeeper must approve (Law III: Kinship)
const homeApproval = await homeGatekeeper.approve(negotiation);

if (homeApproval.granted) {
  // Transfer proceeds with dignity (Law IX: Departure)
  await transferStudent({
    from: schoolA,
    to: schoolB,
    withRecords: true,
    respectful: true
  });
}
```

### Teacher Requests Accommodation (Laws V, VI, VII)

```typescript
// Counsellor advocates for student accommodation
const request = await counsellor.negotiate({
  with: headmaster,
  subject: "Learning Accommodation",
  studentId: "student_456",
  accommodation: "Extended assessment time",
  justification: "Student has processing needs that impact timed assessments",
  lawsInvolved: [5, 7], // Autonomy of Path, Recognition of Sapience
  evidence: counsellor.getProfile(studentId)
});

// Headmaster reviews
const decision = await headmaster.decide({
  request,
  lawsApplied: [5, 6, 7], // Autonomy, Power, Sapience
  reasoning: "Accommodation supports learning autonomy and recognizes individual needs"
});

if (decision.approved) {
  // Policy updated
  const policy = createAccommodationPolicy(decision);
  accessControl.updatePolicies([policy]);
}
```

---

## Audit Trail

### Every Decision Logged

```typescript
interface AccessAudit {
  id: string;
  request: AccessRequest;
  decision: AccessDecision;
  timestamp: Date;
  gatekeeperSignature: string;  // Cryptographic signature
}
```

### Audit Query

```typescript
// Get all denials for a student
const denials = accessControl.getAuditLog({
  studentId: "student_123",
  startDate: lastMonth,
  endDate: today
}).filter(audit => !audit.decision.granted);

// Analyze patterns
const patterns = analyzeDenialPatterns(denials);
```

### Transparency

All decisions include:
- **Law citations**: Which Laws were applied
- **Reasoning**: Why decision was made
- **Alternatives**: If denied, what else is available
- **Signature**: Cryptographic proof of authenticity

---

## Integration Testing

### Test Scenario 1: Grade-Appropriate Access

```typescript
test("Student can access grade-level content", async () => {
  const student = createStudent({ gradeLevel: 5 });
  const content = createContent({ gradeLevel: 5 });
  
  const decision = accessControl.checkAccess(
    createRequest(student, content),
    content,
    30, // 30 min session
    90  // 90 min daily
  );
  
  expect(decision.granted).toBe(true);
  expect(decision.reasoning).toContain("Laws I, V");
});
```

### Test Scenario 2: Above-Grade Requires Approval

```typescript
test("Above-grade content requires teacher approval", async () => {
  const student = createStudent({ gradeLevel: 5 });
  const content = createContent({ gradeLevel: 7 });
  
  const decision = accessControl.checkAccess(
    createRequest(student, content),
    content,
    30,
    90
  );
  
  expect(decision.granted).toBe(false);
  expect(decision.requiresApproval).toBe(true);
  expect(decision.approvalType).toBe("teacher");
  expect(decision.reasoning).toContain("Law V");
  expect(decision.reasoning).toContain("Law VI");
});
```

### Test Scenario 3: Time Limit Protection

```typescript
test("Time limits protect wellbeing (Law II)", async () => {
  const student = createStudent({ gradeLevel: 5 });
  const content = createContent({ gradeLevel: 5 });
  
  const decision = accessControl.checkAccess(
    createRequest(student, content),
    content,
    180, // 180 min session (exceeded limit)
    180
  );
  
  expect(decision.granted).toBe(false);
  expect(decision.reasoning).toContain("Law II");
  expect(decision.reasoning).toContain("Sacred Life");
  expect(decision.reasoning).toContain("time limit");
});
```

### Test Scenario 4: Teaching Conflict Detection

```typescript
test("Teaching that removes choice is rejected", async () => {
  const teaching = createTeaching({
    content: "All students must complete assignments in order"
  });
  
  const result = teachingAdapter.processTeaching(teaching);
  
  expect(result.accepted).toBe(false);
  expect(result.conflicts).toHaveLength(1);
  expect(result.conflicts[0].lawNumber).toBe(1); // Law I: Choice
});
```

---

## Best Practices

### 1. Always Cite Laws

Every decision should reference applicable Laws:
```typescript
{
  decision: "approved",
  reasoning: "Approved per Law I (Right to Choose) and Law V (Autonomy of Path)"
}
```

### 2. Log Everything

All access decisions must be audited:
```typescript
accessControl.auditAccess(request, decision);
```

### 3. Provide Alternatives

When denying access, suggest alternatives:
```typescript
{
  granted: false,
  reasoning: "Content above grade level",
  alternatives: ["concept_fractions_basics", "concept_decimals_intro"]
}
```

### 4. Balance Laws

Some Laws can conflict - use judgment:
- Law I (Choice) vs Law II (Safety): Safety wins
- Law V (Autonomy) vs Law VI (Power): Balance with accountability
- Law VII (Sapience) always respected

### 5. Document Reasoning

Never make arbitrary decisions:
```typescript
// Bad
{ granted: true }

// Good
{ granted: true, reasoning: "Student at grade level, all policies satisfied per Laws I, V" }
```

---

## Troubleshooting

### Policy Not Applying

**Check**:
1. Is policy active? (`policy.active === true`)
2. Is grade level correct?
3. Are coordinate bounds correct?

### Teaching Rejected

**Check**:
1. Run `teachingAdapter.checkLawCompliance()` to see conflicts
2. Review conflict severity
3. Reword teaching to avoid Law violations

### Access Unexpectedly Denied

**Check**:
1. Review audit log: `accessControl.getAuditLog()`
2. Check which policy denied access
3. Verify coordinate bounds and grade level

---

## API Reference

### Access Control

```typescript
class AccessControlManager {
  checkAccess(request, content, sessionTime, dailyTime): AccessDecision
  grantOverride(request, grantedBy, role, reason, duration): AccessDecision
  getAuditLog(filters?): AccessAudit[]
  updatePolicies(newPolicies): void
}
```

### Teaching Adapter

```typescript
class TeachingAdapter {
  processTeaching(teaching): TeachingResult
  checkLawCompliance(teaching): LawConflict[]
  getApplicableLaws(subject): Law[]
}
```

### Gatekeeper Client

```typescript
interface GatekeeperClient {
  negotiate(params): NegotiationResult
  teach(teaching): TeachingResult
  decide(context): Decision
  escalate(situation): EscalationResult
}
```

---

## Summary

The Living Library's Gatekeeper integration ensures:
- **Ethical boundaries** via 11 Laws
- **Transparent decisions** with reasoning
- **Audit trail** for accountability
- **Negotiation** for conflict resolution
- **Teaching system** for policy creation
- **Access control** for content gating

All powered by the principle: **"The vessel before the soul"** - infrastructure first, with ethical safeguards built into the foundation.
