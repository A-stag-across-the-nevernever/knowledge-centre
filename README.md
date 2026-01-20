# KnowledgeCentre - Domain Knowledge Repositories

**Part of Souls in Development**

KnowledgeCentre provides domain-specific knowledge repositories accessed via GatekeeperNetwork. Each domain is self-hosted by institutions and provides tier-based access control.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE CENTRE                         │
│                (Domain Knowledge Repositories)               │
│                                                              │
│  Domain-specific knowledge bases with celestial coords      │
│  Tier-based access control via GatekeeperNetwork            │
└─────────────────────────────────────────────────────────────┘
```

## Role in Souls in Development

KnowledgeCentre is **Component 3 of 3**:

1. **RosettaAI** - Core AI engine (runs locally)
2. **GatekeeperNetwork** - Federation infrastructure
3. **KnowledgeCentre** (this component) - Domain knowledge repositories

### What KnowledgeCentre Does

- **Domain-Specific Knowledge**: Organized repositories per industry/domain
- **Celestial Coordinate Organization**: 3D coordinate system (RA, DEC, ALT)
- **Tier-Based Access**: Altitude ranges restrict knowledge access by tier
- **Self-Hosted**: Each institution hosts their own knowledge base
- **GatekeeperNetwork Gated**: Access controlled via credentials

## Domain Repositories

| Domain | Name | Used By | Directory |
|--------|------|---------|-----------|
| Education | **Living Library** | Schools, Universities | `living-library/` |
| Technology | **Neural Nexus** | Tech Companies | `neural-nexus/` |
| Healthcare | **Medical Codex** | Hospitals, Clinics | `medical-codex/` |
| Manufacturing | **Forge Network** | Manufacturing Companies | `forge-network/` |
| Finance | **Capital Archive** | Banks, Financial Firms | `capital-archive/` |
| Creative | **Creative Muse** | Studios, Agencies | `creative-muse/` |

## Celestial Coordinate System

All knowledge is organized using 3D celestial coordinates:

### Coordinate Structure
- **Right Ascension (RA)**: 0-360 degrees (conceptual category)
- **Declination (DEC)**: -90 to +90 degrees (conceptual subcategory)
- **Altitude (ALT)**: 0-20 (complexity/expertise level)

### POLARIS Anchor
**POLARIS** (37.954557, 89.264108, 0) represents "absolute truth" and serves as the coordinate system anchor.

### Altitude-Based Access Control

| Tier | Altitude Range | Complexity Level |
|------|----------------|------------------|
| Home | 0-3 | Very basic concepts |
| Elementary | 0-5 | Basic concepts |
| High School | 0-10 | Intermediate concepts |
| University | 0-15 | Advanced concepts |
| Career | 0-20 | Expert-level concepts |

## Living Library (Education Domain)

Educational knowledge base for schools and universities.

### Content Organization

**Elementary (ALT 0-5)**:
- Basic arithmetic, reading, science
- Simple historical facts
- Elementary grammar
- Basic geography

**High School (ALT 5-10)**:
- Algebra, geometry, calculus basics
- Literature analysis
- Chemistry, physics fundamentals
- World history, government

**University (ALT 10-15)**:
- Advanced mathematics
- Specialized sciences
- Academic research methods
- Scholarly literature

### Installation
```bash
cd install
./install-living-library.sh --tier elementary --school-id springfield-elem-001
```

## Neural Nexus (Technology Domain)

Technology and software engineering knowledge base.

### Content Organization

**All tiers (ALT 0-20)** - Career only:
- Programming languages and frameworks
- System architecture patterns
- DevOps and deployment
- Security best practices
- Industry-specific technologies

### Installation
```bash
cd install
./install-neural-nexus.sh --company-id techcorp-001 --tier startup
```

## Medical Codex (Healthcare Domain)

Medical knowledge and clinical decision support.

### Content Organization

**Career tier (ALT 0-20)** - Medical professionals only:
- Diagnosis assistance
- Treatment protocols
- Drug interactions
- Medical research
- Clinical guidelines

### Installation
```bash
cd install
./install-medical-codex.sh --company-id mercy-hospital-001
```

## Directory Structure

```
KnowledgeCentre/
├── README.md                      # This file
├── living-library/                # Education domain
│   ├── src/                       # Source code
│   ├── content/                   # Educational content
│   ├── package.json              # Dependencies
│   └── README.md                 # Domain-specific docs
├── neural-nexus/                  # Technology domain
│   ├── src/                       # Source code
│   ├── content/                   # Tech knowledge
│   └── README.md                 # Domain-specific docs
├── medical-codex/                 # Healthcare domain
│   ├── src/                       # Source code
│   ├── content/                   # Medical knowledge
│   └── README.md                 # Domain-specific docs
├── forge-network/                 # Manufacturing domain
├── capital-archive/               # Finance domain
├── creative-muse/                 # Creative/Arts domain
└── install/                       # Installation scripts
    ├── install-living-library.sh
    ├── install-neural-nexus.sh
    ├── install-medical-codex.sh
    └── install-domain.sh          # Generic installer
```

## Installation

### Prerequisites
- Node.js 18+
- GatekeeperNetwork server installed
- Storage for knowledge content

### Living Library (Schools)
```bash
cd install
./install-living-library.sh \
  --tier elementary \
  --school-id springfield-elem-001 \
  --school-name "Springfield Elementary"
```

### Neural Nexus (Tech Companies)
```bash
cd install
./install-neural-nexus.sh \
  --company-id techcorp-001 \
  --company-name "TechCorp Inc"
```

### Medical Codex (Hospitals)
```bash
cd install
./install-medical-codex.sh \
  --company-id mercy-hospital-001 \
  --company-name "Mercy Hospital"
```

## Integration with GatekeeperNetwork

KnowledgeCentre repositories are accessed exclusively through GatekeeperNetwork:

1. **Credential Validation**: Gatekeeper validates user credentials
2. **Tier Check**: Gatekeeper verifies user's tier level
3. **Altitude Filtering**: Only concepts within altitude range are accessible
4. **Audit Logging**: All access is logged via 11 Laws enforcement
5. **Content Delivery**: Knowledge delivered to user's RosettaAI

## Content Format

Knowledge is stored in structured format with celestial coordinates:

```json
{
  "concept_id": "photosynthesis-basic",
  "name": "Photosynthesis",
  "coordinates": {
    "ra": 145.23,
    "dec": 42.15,
    "alt": 4
  },
  "tier_access": ["elementary", "high_school", "university"],
  "content": {
    "description": "Process by which plants convert light into energy",
    "details": "...",
    "examples": ["..."],
    "references": ["..."]
  },
  "prerequisites": ["plant-biology-basic"],
  "related_concepts": ["chlorophyll", "glucose-production"]
}
```

## Creating Custom Domains

To create a new domain (e.g., "Legal Codex" for law firms):

1. Create directory structure
2. Define celestial coordinate ranges
3. Organize content by altitude
4. Create domain-specific installation script
5. Configure GatekeeperNetwork integration

See `docs/CREATING_CUSTOM_DOMAINS.md` for detailed guide.

## Philosophy

**"The vessel before the soul"**

Knowledge repositories must be perfectly organized and access-controlled before we trust them with human education and professional development.

## See Also

- [RosettaAI](../RosettaAI/README.md) - Core AI engine
- [GatekeeperNetwork](../GatekeeperNetwork/README.md) - Federation infrastructure
- [Souls in Development](../README.md) - Overall system architecture
