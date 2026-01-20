# Company Tier System

**Version**: 2.0  
**Date**: 2026-01-20

## Overview

Just like education has tiers (Home → Elementary → High School → University → Career), **companies have tiers based on size and maturity** that unlock organizational capabilities.

## Company Tiers

```
Tier 0: SOLO/FREELANCE (1 person)
   ↓
Tier 1: STARTUP (2-10 people)
   ↓
Tier 2: SMALL BUSINESS (11-50 people)
   ↓
Tier 3: MID-MARKET (51-500 people)
   ↓
Tier 4: ENTERPRISE (501-5,000 people)
   ↓
Tier 5: GLOBAL ENTERPRISE (5,000+ people)
```

## What Each Tier Unlocks

### Tier 0: Solo/Freelance (1 person)

**Profile**: Individual consultant, freelancer, solo practitioner

**Organizational Capabilities**:
- Max hierarchy levels: 1 (just you)
- Max departments: 1
- Max locations: 1
- Custom roles: 3

**System Capabilities**:
- Knowledge storage: 10 GB
- Celestial altitude range: 0-5
- Gatekeeper federation: No
- Multi-region: No

**Domain Name Examples**:
- Solo Software Developer → "Neural Nexus (Personal)"
- Solo Doctor → "Medical Codex (Practice)"
- Solo Artist → "Creative Muse (Studio)"

**Use Case**: You're a freelance software engineer with your own AI assistant configured for your expertise.

---

### Tier 1: Startup (2-10 people)

**Profile**: Early stage startup, small team

**Organizational Capabilities**:
- Max hierarchy levels: 2 (IC + Founder/CEO)
- Max departments: 3
- Max locations: 1
- Custom roles: 5

**System Capabilities**:
- Knowledge storage: 50 GB
- Celestial altitude range: 0-8
- Gatekeeper federation: Yes (with partners)
- API access: Yes
- Advanced analytics: Yes

**Domain Name Examples**:
- Tech Startup → "Neural Nexus"
- Health Tech Startup → "Medical Codex"
- Design Studio → "Creative Muse"

**Use Case**: 5-person startup, founders + engineers, flat structure, everyone's AI has access to shared company knowledge.

---

### Tier 2: Small Business (11-50 people)

**Profile**: Growing company with teams

**Organizational Capabilities**:
- Max hierarchy levels: 3 (IC + Manager + CEO)
- Max departments: 5
- Max locations: 2
- Custom roles: 10

**System Capabilities**:
- Knowledge storage: 200 GB
- Celestial altitude range: 0-12
- Cross-company negotiation: Yes
- Custom integrations: Yes
- Custom branding: Yes (logo, colors)

**Domain Name Examples**:
- 30-person dev shop → "Code Collective"
- Small clinic → "Healing Archive"
- Design agency → "Studio Collective"

**Use Case**: Engineering team, sales team, operations team - each with managers reporting to CEO.

---

### Tier 3: Mid-Market (51-500 people)

**Profile**: Established company with departments

**Organizational Capabilities**:
- Max hierarchy levels: 5 (IC → Manager → Director → VP → CEO)
- Max departments: 10
- Max locations: 5
- Custom roles: 20

**System Capabilities**:
- Knowledge storage: 1 TB
- Celestial altitude range: 0-16
- Multi-region support: Yes
- White label branding: Yes
- Global policy management: Yes
- Dedicated support: Yes

**Domain Name Examples**:
- 200-person SaaS company → "Neural Nexus" (custom branded)
- Regional hospital network → "Clinical Canon"
- Manufacturing company → "Forge Network"

**Use Case**: Multiple departments (Engineering, Sales, Marketing, Finance), directors, VPs, full corporate structure.

---

### Tier 4: Enterprise (501-5,000 people)

**Profile**: Large corporation with divisions

**Organizational Capabilities**:
- Max hierarchy levels: 7 (full IC → CEO hierarchy)
- Max departments: 50
- Max locations: 20
- Custom roles: 50

**System Capabilities**:
- Knowledge storage: 5 TB
- Celestial altitude range: 0-18
- Unlimited custom roles: Up to 50
- Advanced security: Yes
- Dedicated account manager: Yes

**Domain Name Examples**:
- Fortune 1000 tech company → "Digital Commons" (fully white labeled)
- Hospital system → "Medical Codex Enterprise"
- Manufacturing conglomerate → "Industrial Commons"

**Use Case**: Multiple divisions, regional offices, complex org chart, thousands of employees' AIs coordinating.

---

### Tier 5: Global Enterprise (5,000+ people)

**Profile**: Multinational corporation

**Organizational Capabilities**:
- Max hierarchy levels: 7+ (full hierarchy)
- Max departments: Unlimited
- Max locations: Unlimited
- Custom roles: Unlimited

**System Capabilities**:
- Knowledge storage: 20 TB
- Celestial altitude range: 0-20
- Global operations: Yes
- Enterprise SLA: Yes
- 24/7 premium support: Yes

**Domain Name Examples**:
- Fortune 500 tech giant → "GlobalTech Nexus" (fully custom)
- International hospital network → "WorldHealth Codex"
- Multinational manufacturer → "Global Forge"

**Use Case**: Global corporation, offices in 50 countries, hundreds of thousands of employees, fully customized deployment.

---

## Automatic Tier Progression

As companies grow, they **automatically unlock** higher tiers:

```typescript
// Company starts
const company = new CompanyLivingLibrary({
  companyId: 'acme-001',
  companyName: 'Acme Corp',
  industryTemplateId: 'technology',
  tier: CompanyTier.STARTUP,  // 5 employees
  employeeCount: 5,
});

// Hire more people
await company.hireEmployee(...);  // 6th employee
await company.hireEmployee(...);  // 7th employee
// ... continue hiring

// When 11th employee hired
await company.hireEmployee(...);  // 11th employee
// ✓ Automatically unlocked Tier 2 (Small Business)
// ✓ Can now use 3-level hierarchy
// ✓ Knowledge storage increased to 200 GB
// ✓ Custom integrations enabled
```

## Tier-Based Features

### Knowledge Storage by Tier

| Tier | Storage | Altitude Range | Custom Roles |
|------|---------|----------------|--------------|
| Solo | 10 GB | 0-5 | 3 |
| Startup | 50 GB | 0-8 | 5 |
| Small Business | 200 GB | 0-12 | 10 |
| Mid-Market | 1 TB | 0-16 | 20 |
| Enterprise | 5 TB | 0-18 | 50 |
| Global | 20 TB | 0-20 | Unlimited |

### Hierarchy Complexity by Tier

| Tier | Max Levels | Example Structure |
|------|------------|-------------------|
| Solo | 1 | You |
| Startup | 2 | IC → CEO |
| Small Business | 3 | IC → Manager → CEO |
| Mid-Market | 5 | IC → Manager → Director → VP → CEO |
| Enterprise | 7 | IC → Team Lead → Manager → Sr Mgr → Director → VP → C-Level → CEO |
| Global | 7+ | Full hierarchy + regional variations |

### Gatekeeper Capabilities by Tier

| Capability | Solo | Startup | Small | Mid | Enterprise | Global |
|------------|------|---------|-------|-----|------------|--------|
| Basic federation | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cross-company negotiation | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Global policy management | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Multi-region support | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| White label branding | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

## Domain Naming by Tier

Larger companies get more sophisticated naming and branding options:

### Tier 0-1: Standard Names
- Use industry defaults
- "Neural Nexus" (Tech)
- "Medical Codex" (Healthcare)
- No customization

### Tier 2: Basic Branding
- Choose from alternatives
- "Neural Nexus" OR "Code Collective" OR "Tech Forge"
- Custom logo
- Custom colors

### Tier 3+: Full White Label
- Fully custom naming
- "Acme Intelligence Hub"
- "GlobalCorp Knowledge Network"
- Complete visual customization

## Pricing Model (Example)

| Tier | Per Employee/Month | Minimum/Month | Setup Fee |
|------|-------------------|---------------|-----------|
| Solo | $49 | $49 | $0 |
| Startup | $39 | $99 | $500 |
| Small Business | $29 | $499 | $2,000 |
| Mid-Market | $19 | $1,999 | $10,000 |
| Enterprise | $15 | $7,999 | $50,000 |
| Global | $12 | $60,000 | $100,000 |

## Real-World Example: Company Growth

### Year 1: Alice's Solo Practice

```
Alice (Freelance Designer)
- Tier 0: Solo
- Domain: "Creative Muse (Personal)"
- 1 person (Alice)
- 10 GB knowledge
- Just Alice's AI with her portfolio, client work, design templates
```

### Year 2: Hired First Employees

```
Alice Design Studio
- Tier 1: Startup
- Domain: "Creative Muse"
- 4 people (Alice + 3 designers)
- 50 GB knowledge
- Hierarchy: Designers → Alice (Founder)
- All designers' AIs share studio knowledge
```

### Year 3: Growing Business

```
Alice Design Co.
- Tier 2: Small Business
- Domain: "Studio Collective" (custom branding)
- 25 people (designers, account managers, operations)
- 200 GB knowledge
- Hierarchy: ICs → Managers → Alice (CEO)
- 3 departments: Design, Client Services, Operations
```

### Year 5: Established Agency

```
Alice Creative Agency
- Tier 3: Mid-Market
- Domain: "Alice Creative Nexus" (white labeled)
- 150 people
- 1 TB knowledge
- Hierarchy: ICs → Managers → Directors → VP Creative → Alice (CEO)
- 5 departments, 3 office locations
- Global client negotiations via Gatekeeper
```

### Year 10: Global Network

```
Alice Global Creative
- Tier 5: Global Enterprise
- Domain: "AGC Intelligence Hub" (fully custom)
- 8,000 people worldwide
- 20 TB knowledge
- Full hierarchy across 30 countries
- Unlimited departments/locations
- 24/7 support
```

## Summary

**Same system as education, applied to companies:**

- Education: Home (Tier 0) → Elementary (1) → High School (2) → University (3) → Career (4)
- Companies: Solo (Tier 0) → Startup (1) → Small Business (2) → Mid-Market (3) → Enterprise (4) → Global (5)

Each tier unlocks:
- More organizational complexity
- More knowledge storage
- More capabilities
- More customization

**The AI grows with the company, just like it grows with the student.**
