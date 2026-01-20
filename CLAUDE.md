# CLAUDE.md

Project guidance for Claude Code when working with this repository.

## Project Overview

KnowledgeCentre provides domain-specific knowledge repositories organized using celestial coordinates and accessed via GatekeeperNetwork.

## Repository Structure

| Directory | Purpose |
|-----------|---------|
| `living-library/` | Education domain - reference implementation (active) |
| `src/` | Shared utilities (harvester, storage, crypto) |
| `install/` | Tier-specific installation scripts |
| `docs/` | Architecture and specification documents |

## Current Implementation Status

**Active Components:**
- **Living Library** - Complete education domain implementation (28 TypeScript files, 4,488 lines)
- **Shared Utilities** - Content harvester, cloud storage providers, crypto utilities

**Empty Domains (removed):**
- capital-archive (Finance) - removed (was empty)
- creative-muse (Creative) - removed (was empty)
- forge-network (Manufacturing) - removed (was empty)
- medical-codex (Healthcare) - removed (was empty)
- neural-nexus (Technology) - removed (was empty)

## Build Commands

### Living Library
```bash
cd living-library
npm install
npm run build
npm test
```

### Shared Utilities
```bash
cd src
# Utilities are imported by living-library
```

## Testing

```bash
cd living-library
npm test
```

## Architecture

### Living Library Structure
```
living-library/
├── src/
│   ├── personas/      - Headmaster, Teacher, Counsellor, Student
│   ├── gating/        - Role and tier-based access control
│   ├── content/       - Content types, curriculum, knowledge graph
│   ├── gatekeeper/    - Gatekeeper integration
│   ├── engine/        - Persona engines
│   ├── programs/      - Educational programs
│   └── templates/     - Company deployment templates
├── package.json
└── tsconfig.json
```

### Shared Utilities
```
src/
├── harvester/         - File and content harvesting system
├── storage/           - Cloud provider abstraction (S3, R2, MinIO, Nextcloud)
└── utils/            - Crypto utilities for coordinate generation
```

## Key Principles

- **Celestial Coordinate Organization** - All knowledge indexed by (RA, DEC, ALT)
- **Tier-Based Access** - Altitude restricts knowledge by organizational tier
- **Domain-Specific** - Each domain (education, healthcare, etc.) is separate
- **Self-Hosted** - Institutions host their own knowledge repositories
- **GatekeeperNetwork Integration** - Access controlled via credentials

## Documentation

See `docs/` for:
- ARCHITECTURE.md - System design
- GATEKEEPER_INTEGRATION.md - Integration patterns
- EXPANDABLE_ROLE_SYSTEM.md - Role-based access control
- PERSONA_SPECS.md - Persona specifications
- COMPANY_TIER_SYSTEM.md - Tier system
- NOMENCLATURE.md - Naming conventions

## Notes

Living Library serves as the **reference implementation** for domain-specific knowledge repositories. Other domains can be created following the same pattern.

For full system integration, see:
- **GatekeeperNetwork** - Federation and access control
- **RosettaAI** - Core AI engine
