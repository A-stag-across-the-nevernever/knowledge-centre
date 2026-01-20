
# Expandable Role System for RosettaAI

**Version**: 2.0  
**Date**: 2026-01-20

## Executive Summary

The Living Library implements an **expandable role system** where:

1. **STUDENT** is the only child/learning role with gated progression (Home → Elementary → High School → University → Career)
2. **ALL OTHER ROLES** are adult/career roles that start fully unlocked at Career tier (Tier 4)
3. Companies/institutions deploy **industry-templated Living Libraries** with hierarchical role structures
4. When someone joins a company, their AI receives role credentials and activates professional capabilities
5. Career progression = new role credentials with expanded capabilities

## Core Architecture

### Two Role Categories

```
┌──────────────────────────────────────────────────────────────┐
│                    STUDENT ROLE (Gated)                      │
│                                                              │
│  Home (Tier 0) → Elementary (Tier 1) → High School (Tier 2) │
│  → University (Tier 3) → Career (Tier 4)                     │
│                                                              │
│  Sequential unlocking of RosettaAI capabilities              │
│  based on life stage and enrollment proofs                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              ADULT/CAREER ROLES (Fully Unlocked)             │
│                                                              │
│  Teacher, Headmaster, Counsellor (Education)                 │
│  Doctor, Nurse, Surgeon (Healthcare)                         │
│  Software Engineer, Manager, CTO, CEO (Technology)           │
│  Artist, Designer, Curator (Arts)                            │
│  + Infinite expansion to any profession                      │
│                                                              │
│  All start at Career tier (Tier 4) - full RosettaAI          │
│  Differentiated by capabilities, not gating                  │
└──────────────────────────────────────────────────────────────┘
```

### Key Insight

- **Student AI** = Gated by enrollment (educational institutions control progression)
- **Professional AI** = Activated by employment (companies/organizations control roles)

## Industry Templates

Companies deploy Living Libraries using industry-specific templates with hierarchical role structures.

### Example: Technology Industry Template

```
HierarchyLevel.CEO (Level 6)
    ↓
HierarchyLevel.C_LEVEL (Level 5) - CTO, CFO, COO
    ↓
HierarchyLevel.EXECUTIVE (Level 4) - VP Engineering, VP Product
    ↓
HierarchyLevel.SENIOR_MANAGER (Level 3) - Director of Engineering
    ↓
HierarchyLevel.MANAGER (Level 2) - Engineering Manager
    ↓
HierarchyLevel.TEAM_LEAD (Level 1) - Senior Engineer, Tech Lead
    ↓
HierarchyLevel.INDIVIDUAL_CONTRIBUTOR (Level 0) - Software Engineer
```

### Capabilities by Level

**Individual Contributor (Software Engineer)**:
- develop_software
- research
- communicate
- collaborate

**Team Lead (Senior Engineer)**:
- + teach (can mentor juniors)
- + architect_systems

**Manager (Engineering Manager)**:
- + manage_team
- + strategic_planning
- + negotiate

**Director (Director of Engineering)**:
- + financial_analysis
- + advocate

**VP (VP of Engineering)**:
- + escalate
- (manages multiple directors)

**CTO (Chief Technology Officer)**:
- + set_policy
- (executive leadership)

**CEO (Chief Executive Officer)**:
- + full organizational control
- (company leadership)

## Deployment Flow

### 1. Company Deploys Living Library

```typescript
import { CompanyLivingLibrary } from './templates/company-deployment';

// Deploy TechCorp Living Library with tech industry template
const techCorp = new CompanyLivingLibrary({
  companyId: 'techcorp-001',
  companyName: 'TechCorp Inc.',
  industryTemplateId: 'technology',
  customizations: {
    roleNameOverrides: {
      software_engineer: 'Software Development Engineer',
    },
    additionalDomains: ['techcorp_proprietary_systems'],
  },
});
```

### 2. Person Joins Company

```typescript
// Alice joins TechCorp as Software Engineer
const alice = await techCorp.hireEmployee(
  'alice-12345',                              // personId
  'software_engineer',                        // roleId
  HierarchyLevel.INDIVIDUAL_CONTRIBUTOR,      // level
  'Platform Engineering',                     // department
  'manager-bob-67890'                         // manager
);

// Living Library issues role credential
// Credential contains:
// - roleId: 'software_engineer'
// - capabilities: [develop_software, research, communicate, collaborate]
// - signature: cryptographic proof from company Gatekeeper
```

### 3. Alice's AI Activates Role

```typescript
// Alice's AI receives credential via Gatekeeper
const alicePersona = await techCorp.getEmployeePersona(alice.employeeId);

// alicePersona now has:
// - tier: Tier.CAREER (fully unlocked RosettaAI)
// - role: Software Engineer
// - capabilities: develop_software, research, communicate, collaborate
// - domainExpertise: ['programming', 'algorithms']
// - NPU phases: 0-13 (all unlocked)
// - Memory: 2048MB
// - Models: all CoreML models
```

### 4. Career Progression

```typescript
// After 3 years, Alice promoted to Senior Engineer
const promotedAlice = await techCorp.promoteEmployee(
  alice.employeeId,
  HierarchyLevel.TEAM_LEAD,
  'Exceptional performance and technical leadership'
);

// New credential issued
// Alice's AI now has ADDITIONAL capabilities:
// - teach (can mentor junior engineers)
// - architect_systems (can design architectures)
```

### 5. Multiple Roles

```typescript
// Alice also teaches part-time at university
// Alice's AI holds TWO credentials:
// 1. Senior Engineer at TechCorp
// 2. Teacher at University

// Capabilities are MERGED:
// From Senior Engineer: develop_software, teach, architect_systems, research
// From Teacher: teach, assess, advocate_student, negotiate
// Combined: develop_software, teach, assess, architect_systems, research, advocate_student, negotiate
```

## Living Library Structure

### Educational Living Libraries

```
Elementary School Living Library
├── Roles: Student (Tier 1), Teacher, Headmaster, Counsellor
├── Knowledge Domain: Alt 0-5 (K-5 curriculum)
└── Gatekeeper: School Gatekeeper

High School Living Library
├── Roles: Student (Tier 2), Teacher, Headmaster, Counsellor
├── Knowledge Domain: Alt 0-10 (grades 6-12 curriculum)
└── Gatekeeper: School Gatekeeper

University Living Library (Athenaeum)
├── Roles: Student (Tier 3), Professor, Dean, Counsellor
├── Knowledge Domain: Alt 0-15 (advanced/research)
└── Gatekeeper: University Gatekeeper
```

### Corporate Living Libraries

```
TechCorp Living Library
├── Roles: Software Engineer → Senior Engineer → Manager → Director → VP → CTO → CEO
├── Knowledge Domain: Alt 0-20 (programming, systems, business)
└── Gatekeeper: Corporate Gatekeeper

City General Hospital Living Library
├── Roles: Doctor → Attending → Department Head → Chief of Medicine → CMO → CEO
├── Knowledge Domain: Alt 0-20 (medicine, healthcare, management)
└── Gatekeeper: Hospital Gatekeeper
```

## Industry Template Registry

### Available Templates

1. **Technology** (`technology`)
   - Roles: Software Engineer, Senior Engineer, Engineering Manager, Director, VP, CTO, CEO
   - Domains: programming, algorithms, systems, databases, networking, security, AI/ML, cloud

2. **Healthcare** (`healthcare`)
   - Roles: Doctor, Attending Physician, Department Head, Chief of Medicine, CMO, CEO
   - Domains: medicine, anatomy, pharmacology, surgery, diagnostics, patient care

3. **Manufacturing** (`manufacturing`)
   - Roles: Production Worker, Supervisor, Plant Manager, VP Operations, COO, CEO
   - Domains: production, quality control, supply chain, logistics, safety

4. **Financial Services** (`financial`)
   - Roles: Analyst, Senior Analyst, Portfolio Manager, Director, VP, CFO, CEO
   - Domains: finance, accounting, risk management, investments

5. **Arts** (`arts`)
   - Roles: Artist, Lead Artist, Creative Director, Art Director, CEO
   - Domains: art, creativity, aesthetics, culture, curation

6. **Custom** (`custom`)
   - Build your own industry template

### Adding New Industries

```typescript
import { IndustryTemplate, HierarchyLevel } from './templates/industry-templates';

const AEROSPACE_INDUSTRY_TEMPLATE: IndustryTemplate = {
  industryId: 'aerospace',
  industryName: 'Aerospace Engineering',
  description: 'Aircraft and spacecraft design and manufacturing',
  
  knowledgeDomains: [
    'aerodynamics',
    'propulsion',
    'structures',
    'systems_engineering',
    'flight_dynamics',
  ],
  
  celestialMapping: [
    { domain: 'aerodynamics', raRange: [120, 140], decRange: [20, 40], altRange: [0, 100] },
    // ...
  ],
  
  roles: [
    {
      level: HierarchyLevel.INDIVIDUAL_CONTRIBUTOR,
      roleId: 'aerospace_engineer',
      role: {
        roleId: 'aerospace_engineer',
        roleName: 'Aerospace Engineer',
        // ... full role definition
      },
    },
    // ... more roles
  ],
};

// Register template
INDUSTRY_TEMPLATE_REGISTRY['aerospace'] = AEROSPACE_INDUSTRY_TEMPLATE;
```

## Role Assignment Flow

```
┌──────────────┐
│   Person     │
│   (Alice)    │
└──────┬───────┘
       │
       │ 1. Apply for job
       ↓
┌────────────────────────┐
│  Company Living Lib    │
│    (TechCorp)          │
├────────────────────────┤
│ Industry Template: Tech│
│ Roles: SW Eng → CEO    │
└──────┬─────────────────┘
       │
       │ 2. Issue role credential
       ↓
┌────────────────────────┐
│  Role Credential       │
├────────────────────────┤
│ roleId: software_eng   │
│ level: IC              │
│ capabilities: [...]    │
│ signature: 0xABC...    │
│ gatekeeperId: techcorp │
└──────┬─────────────────┘
       │
       │ 3. Send via Gatekeeper
       ↓
┌────────────────────────┐
│   Alice's AI           │
│   (RosettaAI)          │
├────────────────────────┤
│ BEFORE: Student Tier 3 │
│ AFTER:  Career Tier 4  │
│ Role: Software Engineer│
│ Capabilities: develop, │
│   research, collaborate│
└────────────────────────┘
```

## Benefits

### 1. Infinite Extensibility
- Add new industries without modifying core system
- Companies customize templates to their structure
- New roles = new capability combinations

### 2. Clear Separation
- **Student AI** = Educational journey (child/adolescent)
- **Professional AI** = Career journey (adult)
- No confusion between life stages

### 3. Organizational Alignment
- Company hierarchy maps directly to role hierarchy
- Promotions = new credentials = new capabilities
- AI grows with career

### 4. Federation
- Home Gatekeeper manages Student AI
- School Gatekeeper manages educational roles
- Company Gatekeeper manages professional roles
- Gatekeepers negotiate/federate knowledge

### 5. Privacy & Control
- Companies control their own Living Libraries (self-hosted)
- Employees' AI data stays with employer
- Termination = revoke credentials = AI loses professional capabilities

## Implementation Files

```
living-library/
├── src/
│   ├── gating/
│   │   ├── tier-system.ts           # Tier 0-4 unlocking system
│   │   ├── role-system.ts           # Expandable role definitions
│   │   ├── rosetta-config.ts        # RosettaAI runtime configuration
│   │   ├── role-assignment.ts       # Role credential issuance
│   │   └── persona-builder.ts       # Build personas from tier+role
│   ├── templates/
│   │   ├── industry-templates.ts    # Tech, Healthcare, Manufacturing, etc.
│   │   └── company-deployment.ts    # Company Living Library deployment
│   └── engine/
│       ├── student-engine.ts        # Student AI wrapper
│       ├── teacher-engine.ts        # Teacher AI wrapper
│       ├── headmaster-engine.ts     # Headmaster AI wrapper
│       └── (any-profession)-engine.ts # Extensible
└── docs/
    └── EXPANDABLE_ROLE_SYSTEM.md    # This document
```

## Migration Path

### From Old System

**Old (Enum-based, Fixed Roles)**:
```typescript
enum PersonaRole {
  STUDENT,
  TEACHER,
  HEADMASTER,
  COUNSELLOR,
}
```

**New (Expandable, Dynamic Roles)**:
```typescript
// Roles are defined as BaseRole objects in ROLE_REGISTRY
const role = getRole('software_engineer');  // Get any role by ID
const allRoles = getAllAdultRoles();        // Get all career roles
```

### Adding Custom Roles

```typescript
import { createCustomRole, registerRole, CAPABILITIES } from './gating/role-system';

// Create Data Scientist role
const dataScientist = createCustomRole(
  'data_scientist',
  'Data Scientist',
  'technology',
  [
    CAPABILITIES.RESEARCH,
    CAPABILITIES.DEVELOP_SOFTWARE,
    CAPABILITIES.COMMUNICATE,
  ],
  ['statistics', 'machine_learning', 'data_analysis'],
  {
    tone: 'analytical and precise',
    formality: 0.6,
    verbosity: 0.7,
    empathy: 0.5,
  }
);

// Register it
registerRole(dataScientist);

// Now available for all companies
```

## Future Expansion

### Government Template
- Roles: Analyst, Manager, Director, Undersecretary, Secretary
- Domains: policy, governance, public service

### Creative Industries Template
- Roles: Writer, Editor, Director, Producer, Studio Head
- Domains: storytelling, production, media

### Research Template
- Roles: Research Assistant, Researcher, Principal Investigator, Lab Director
- Domains: scientific research, methodology, publication

### Retail Template
- Roles: Associate, Supervisor, Store Manager, Regional Manager, VP Retail, CEO
- Domains: sales, customer service, inventory, merchandising

## Conclusion

The expandable role system transforms the Living Library from a purely educational system into a **lifelong AI companion system** that grows with the person from childhood through their entire career, adapting to any industry or profession through templated role structures.

**Key Principle**: One RosettaAI system, infinite roles through configuration.
