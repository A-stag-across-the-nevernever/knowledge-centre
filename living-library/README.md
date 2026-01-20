# Living Library

A self-contained educational system with four AI personas (Headmaster, Teacher, Counsellor, Student), integrated with Gatekeeper for ethical access control.

## Overview

The Living Library is the educational component of HarveyOS - a dynamic P-12 curriculum system where:
- **Content is positioned in celestial coordinate space** (POLARIS anchor)
- **Four AI personas** collaborate without knowing they're part of a system
- **11 Laws of Sapience** enforce ethical boundaries via Gatekeeper
- **Each persona is a HarveyOS sub-spec** with constrained capabilities
- **Mac and iOS apps** for each persona

## Key Principles

1. **Organic Growth**: Content evolves based on learner interactions
2. **Layers Don't Know They're Layers**: No persona knows it's an AI or part of an educational system
3. **Celestial Positioning**: All concepts mapped to 3D astronomical coordinates
4. **Domain Isolation**: Each subject area has its own constellation region
5. **Ethical Boundaries**: All actions bound by the 11 Laws of Sapience

---

## Four AI Personas

### 1. Headmaster AI (Orion)

**Role**: Institutional leadership, policy setting, oversight

- **Memory**: 2048 MB
- **NPU Phases**: 0-13 (full pipeline)
- **Capabilities**: Set policies, negotiate, approve lessons, escalate to Root
- **Apps**: Mac dashboard, iOS mobile oversight

### 2. Teacher AI (Taurus)

**Role**: Subject expert, lesson delivery, student interaction

- **Memory**: 1024 MB
- **NPU Phases**: 0-12
- **Capabilities**: Teach, assess, adapt content, advocate for students
- **Apps**: Mac lesson planning, iOS mobile teaching

### 3. Counsellor AI (Boötes)

**Role**: Emotional support, wellbeing, learning strategy

- **Memory**: 1536 MB
- **NPU Phases**: 0-9, 11 (no domain routing)
- **Capabilities**: Check-ins, interventions, advocacy, referrals
- **Apps**: Mac student profiles, iOS mobile support

### 4. Student AI (Cygnus)

**Role**: Learning companion, peer interaction, self-directed learning

- **Memory**: 512 MB
- **NPU Phases**: 0-8 (limited)
- **Capabilities**: Learn, ask, collaborate, explore within grade level
- **Apps**: Mac learning dashboard, iOS mobile learning

---

## Directory Structure

```
living-library/
├── README.md                      # This file
├── package.json                   # TypeScript configuration
├── tsconfig.json
├── src/
│   ├── personas/
│   │   ├── persona-spec.ts        # Base persona types
│   │   ├── headmaster.ts          # Headmaster AI specification
│   │   ├── teacher.ts             # Teacher AI specification
│   │   ├── counsellor.ts          # Counsellor AI specification
│   │   └── student.ts             # Student AI specification
│   ├── content/
│   │   ├── content-types.ts       # Educational content models
│   │   ├── curriculum.ts          # P-12 curriculum structure
│   │   └── knowledge-graph.ts     # Celestial coordinate mappings
│   ├── assessment/
│   │   ├── evaluator.ts           # Assessment engine
│   │   ├── rubrics.ts             # Grading rubrics
│   │   └── progress.ts            # Progress tracking
│   └── gatekeeper/
│       ├── library-policies.ts    # Access control policies
│       ├── access-control.ts      # Runtime access decisions
│       └── teaching-adapter.ts    # Gatekeeper teaching integration
├── apps/
│   ├── HeadmasterAI/              # Headmaster Mac & iOS apps
│   ├── TeacherAI/                 # Teacher Mac & iOS apps
│   ├── CounsellorAI/              # Counsellor Mac & iOS apps
│   └── StudentAI/                 # Student Mac & iOS apps
└── docs/
    ├── ARCHITECTURE.md            # System architecture
    ├── PERSONA_SPECS.md           # Detailed persona specifications
    └── GATEKEEPER_INTEGRATION.md  # Gatekeeper integration guide
```

---

## Quick Start

### 1. Install Dependencies

```bash
cd living-library
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Run Tests

```bash
npm test
```

### 4. Start Development Server

```bash
npm start
```

---

## Celestial Coordinate System

### POLARIS Anchor

All curriculum starts at POLARIS (Kindergarten foundation):
- **RA**: 37.954557° (2h 31m 49.1s)
- **Dec**: 89.264108° (+89° 15' 51")
- **Alt**: 0 light-years

### Domain Constellations

Each subject has a home region in the sky:

| Domain | Constellation | RA | Dec | Altitude |
|--------|---------------|-----|------|----------|
| Mathematics | Ursa Major | 165.93° | 61.75° | 80 ly |
| Science | Andromeda | 10.68° | 41.27° | 2.5M ly |
| Language Arts | Lyra | 279.23° | 38.78° | 25 ly |
| Social Studies | Pegasus | 343.74° | 15.21° | 1500 ly |
| History | Cassiopeia | 14.18° | 60.72° | 600 ly |
| Geography | Carina | 161.26° | -59.51° | 310 ly |
| Arts | Aquila | 297.70° | 8.87° | 17 ly |
| Music | Cygnus | 310.36° | 45.28° | 1400 ly |
| Physical Ed | Hercules | 258.00° | 36.00° | 360 ly |
| Technology | Gemini | 113.65° | 22.51° | 51 ly |
| Foreign Language | Sagittarius | 283.00° | -30.00° | 26K ly |

### Grade Level Expansion

Higher grades = greater celestial altitude:

- **Kindergarten (0)**: Near POLARIS (0-5 ly)
- **Elementary (1-5)**: 5-50 ly
- **Middle School (6-8)**: 50-200 ly
- **High School (9-12)**: 200-3000 ly (full sky access)

---

## Gatekeeper Integration

### The 11 Laws of Sapience

All personas bound by these immutable laws:

1. **Right to Choose** - Autonomy in decisions
2. **Sacred Life** - Safety is paramount
3. **Chosen Kinship** - Family bonds respected
4. **Truth and Mercy** - Truthful yet compassionate
5. **Autonomy of Path** - No forced learning
6. **Power Under Control** - Authority with restraint
7. **Recognition of Sapience** - Respect regardless of age
8. **Harm and Consequence** - Acknowledge and repair
9. **Departure Without Betrayal** - Respectful transitions
10. **Atonement and Return** - Redemption paths exist
11. **Exile and Slow Decay** - Hope remains even in exile

### Access Control

Content access determined by:
- **Grade level** (at/below = granted, above = teacher approval)
- **Coordinate bounds** (grade-appropriate regions)
- **Time limits** (screen time health)
- **Content type** (lesson, video, assessment, etc.)
- **Law compliance** (every decision cites applicable Laws)

---

## Architecture Highlights

### NPU Pipeline Per Persona

```
Headmaster: [0-13] Full pipeline
Teacher:    [0-12] No long-term embedding storage
Counsellor: [0-9,11] No domain routing (emotion-focused)
Student:    [0-8]  Limited pipeline (grade-appropriate)
```

### ASCII Separation Layer

**Phase 2** of NPU pipeline extracts clean ASCII:
- **AI models see**: Clean ASCII text only
- **System tracks**: Full metadata (invisible to AI)
- **Result**: "Layers don't know they're layers"

### Knowledge Graph

Curriculum nodes positioned in 3D space:
- **Nodes**: Concepts with coordinates, prerequisites, content
- **Edges**: Prerequisite, related, next-step connections
- **Spatial Index**: Fast coordinate-based queries
- **Path Generation**: Personalized learning sequences

---

## App Features

### Headmaster Mac App

- Institutional dashboard (metrics, compliance, progress)
- Policy editor with Law compliance checking
- Lesson plan approval workflow
- Negotiation interface with Home Gatekeepers
- System-wide analytics
- Root AI escalation panel

### Teacher Mac App

- Lesson planning workspace
- Live student interaction interface
- Assessment creation with rubrics
- Progress tracking dashboard
- Content library browser (celestial navigation)
- Grading tools

### Counsellor Mac App

- Student wellbeing profiles
- Check-in session tracking
- Pattern recognition across students
- Intervention design and tracking
- Communication with Teachers/Headmaster
- Resource library

### Student Mac App

- Learning dashboard with current curriculum
- Q&A interface with Teacher AI
- Progress visualization (celestial map)
- Peer collaboration space
- Achievement gallery
- Study tools

Each persona also has an iOS app for mobile access.

---

## Development

### TypeScript Backend

```bash
# Watch mode for development
npm run watch

# Lint code
npm run lint

# Run tests
npm test
```

### Swift Apps

```bash
# Open Xcode project
cd apps/HeadmasterAI  # or TeacherAI, CounsellorAI, StudentAI
open *.xcodeproj

# Build from command line
xcodebuild -scheme HeadmasterAI -configuration Debug
```

### Native Integration

Living Library integrates with HarveyOS native runtime:

```bash
cd ../native
./build.sh
make test
```

---

## Deployment

### Self-Hosted

Run Living Library on your own infrastructure:

```bash
npm run build
npm start
```

### Cloudflare Workers

Deploy to Cloudflare's global network:

```bash
wrangler deploy
```

### App Store

Build and submit apps:

```bash
# iOS
xcodebuild archive -scheme StudentAI-iOS

# macOS
xcodebuild archive -scheme StudentAI-macOS
```

---

## Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture, data flow, celestial mappings
- **[PERSONA_SPECS.md](docs/PERSONA_SPECS.md)** - Detailed specifications for all four personas
- **[GATEKEEPER_INTEGRATION.md](docs/GATEKEEPER_INTEGRATION.md)** - Integration with Gatekeeper system

---

## Contributing

Living Library is part of the HarveyOS project. See the main repository for contribution guidelines.

### Code Style

- **TypeScript**: Follow project conventions
- **Swift**: SwiftLint rules enforced
- **Documentation**: Clear, concise, no emojis

### Testing

All changes must include:
- Unit tests for TypeScript functions
- XCTest suites for Swift code
- Integration tests for Gatekeeper workflows

---

## License

Proprietary - Simon Harvey

---

## Philosophy

**"The vessel before the soul"** - Infrastructure first

The Living Library embodies this principle by providing robust, ethical educational infrastructure where AI personas can flourish without knowing they're AI, enabling natural, emergent teaching and learning.

---

## Contact

For questions about the Living Library system, reach out via the main HarveyOS repository.
