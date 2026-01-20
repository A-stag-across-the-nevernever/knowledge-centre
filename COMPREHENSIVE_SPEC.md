# KnowledgeCentre - Comprehensive Specification

## Executive Summary

**KnowledgeCentre** is a domain-specific knowledge repository system organizing educational and institutional knowledge using a 3D celestial coordinate system. It provides tier-based access control integrated with GatekeeperNetwork for federated AI governance.

**Status**: Reference implementation complete (Living Library)  
**Technology**: TypeScript, Node.js  
**Lines of Code**: 8,800+ (Living Library) + 1,200+ (shared utilities)  
**Deployment**: Self-hosted by institutions  

---

## Architecture Overview

### Celestial Coordinate System

All knowledge is organized in 3D space using astronomical coordinates:

```
(RA, DEC, ALT)
├── Right Ascension (RA): 0-360° - Domain/subject classification
├── Declination (DEC): -90° to +90° - Topic/subtopic positioning
└── Altitude (ALT): 0-15 - Access tier (grade level / clearance)
```

**POLARIS Anchor**: (37.954557, 89.264108, 0) - Immutable reference point

### Altitude-Based Access Control

| Altitude | Education | Company | Healthcare | Description |
|----------|-----------|---------|------------|-------------|
| 0-5 | K-5 | Intern | Medical Student | Foundation |
| 6-10 | 6-10 | Junior | Resident | Development |
| 11-12 | 11-12 | Mid-level | Attending | Advanced |
| 13-14 | Undergrad | Senior | Specialist | Expert |
| 15 | Graduate | Executive | Department Head | Leadership |

---

## Current Implementation

### Living Library (Education Domain)

**Complete Implementation**: ✅ 100%

#### Directory Structure
```
living-library/
├── src/
│   ├── personas/              # 4 AI personas (1,111 LOC)
│   │   ├── headmaster.ts      # School leadership AI
│   │   ├── teacher.ts         # Subject matter expert AI
│   │   ├── counsellor.ts      # Student guidance AI
│   │   └── student.ts         # Learning companion AI
│   ├── gating/                # Access control (2,148 LOC)
│   │   ├── role-system.ts     # Role-based permissions
│   │   ├── tier-system.ts     # Tier-based access
│   │   ├── role-assignment.ts # Dynamic role assignment
│   │   ├── company-tier-system.ts # Corporate tiers
│   │   ├── persona-builder.ts # Persona construction
│   │   └── rosetta-config.ts  # Configuration system
│   ├── content/               # Content management (1,027 LOC)
│   │   ├── content-types.ts   # Content type definitions
│   │   ├── curriculum.ts      # Curriculum structure
│   │   └── knowledge-graph.ts # Knowledge relationships
│   ├── gatekeeper/            # Integration (300 LOC)
│   │   ├── access-control.ts  # Permission validation
│   │   ├── library-policies.ts # Policy enforcement
│   │   └── teaching-adapter.ts # Curriculum adaptation
│   ├── engine/                # Core engines (350 LOC)
│   │   ├── headmaster-engine.ts
│   │   ├── teacher-engine.ts
│   │   └── student-engine.ts
│   ├── programs/              # Educational programs (500 LOC)
│   │   ├── headmaster-program.ts
│   │   ├── teacher-program.ts
│   │   ├── counsellor-program.ts
│   │   └── student-program.ts
│   ├── templates/             # Deployment templates (100 LOC)
│   │   ├── company-deployment.ts
│   │   └── industry-templates.ts
│   └── index.ts               # Main export
├── package.json
├── tsconfig.json
└── README.md
```

#### Key Features

**1. Persona System**
- **Headmaster**: Leadership, policy, curriculum oversight
- **Teacher**: Subject delivery, assessment, progress tracking
- **Counsellor**: Guidance, support, pathway planning
- **Student**: Learning interface, question answering, study support

**2. Role-Based Access Control**
```typescript
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  altitudeRange: [number, number];  // Min/max altitude access
  canAccessDomains: string[];        // Which RA ranges
}
```

**3. Tier System**
```typescript
export interface Tier {
  id: string;
  name: string;
  level: number;                     // 0-15
  description: string;
  contentAccess: ContentAccessLevel;
  maxConcurrentSessions: number;
  features: string[];
}
```

**4. Content Management**
```typescript
export interface Content {
  id: string;
  title: string;
  coordinate: AstronomicalCoordinate;  // (RA, DEC, ALT)
  type: ContentType;
  metadata: ContentMetadata;
  relatedContent: string[];            // Knowledge graph edges
}
```

---

### Shared Utilities

**Location**: `/src/`

#### 1. File Harvester (400+ LOC)
```typescript
// src/harvester/file-harvester.ts
export class FileHarvester {
  async harvestDirectory(path: string): Promise<HarvestedContent[]>
  async harvestS3Bucket(bucket: string): Promise<HarvestedContent[]>
  async harvestGitRepo(url: string): Promise<HarvestedContent[]>
  async harvestDatabase(connection: string): Promise<HarvestedContent[]>
  
  private assignCoordinates(content: RawContent): AstronomicalCoordinate
  private classifyDomain(content: RawContent): Domain
  private determineTier(content: RawContent): number
}
```

**Features**:
- Scans filesystems, S3, git repos, databases
- Auto-indexes content with celestial coordinates
- Deterministic coordinate generation
- Metadata extraction

#### 2. Cloud Storage Providers (600+ LOC)
```typescript
// src/storage/cloud-providers.ts
export interface CloudProvider {
  upload(file: File, coordinate: AstronomicalCoordinate): Promise<URL>
  download(coordinate: AstronomicalCoordinate): Promise<File>
  delete(coordinate: AstronomicalCoordinate): Promise<void>
  list(raRange?: [number, number], altRange?: [number, number]): Promise<Content[]>
}

export class NextcloudProvider implements CloudProvider { /* ... */ }
export class MinIOProvider implements CloudProvider { /* ... */ }
export class S3Provider implements CloudProvider { /* ... */ }
export class CloudflareR2Provider implements CloudProvider { /* ... */ }
```

**Supported Providers**:
- Nextcloud (self-hosted)
- MinIO (self-hosted)
- AWS S3
- Cloudflare R2
- Cost calculator included

#### 3. Crypto Utilities
```typescript
// src/utils/crypto.ts
export function hashToCoordinate(content: string): AstronomicalCoordinate
export function generateDeterministicRA(domain: string): number
export function generateDeterministicDEC(topic: string): number
export function validateCoordinate(coord: AstronomicalCoordinate): boolean
```

---

## Integration with GatekeeperNetwork

```typescript
interface GatekeeperIntegration {
  // Credential validation
  validateCredential(credential: Credential): Promise<boolean>
  
  // Policy enforcement
  checkPolicy(
    credential: Credential,
    coordinate: AstronomicalCoordinate
  ): Promise<AccessDecision>
  
  // Teaching adaptation
  adaptCurriculumToTier(
    curriculum: Curriculum,
    tier: number
  ): Promise<AdaptedCurriculum>
}
```

**Access Flow**:
1. Student requests content at coordinate (RA, DEC, ALT)
2. KnowledgeCentre sends credential to GatekeeperNetwork
3. Gatekeeper validates credential + checks 11 Laws
4. Gatekeeper returns AccessDecision (allow/deny + adaptation instructions)
5. KnowledgeCentre serves content (or adapted version)

---

## Installation & Deployment

### Prerequisites
- Node.js 20+
- TypeScript 5.3+
- Self-hosted storage (Nextcloud/MinIO) OR cloud storage (S3/R2)

### Install Living Library
```bash
cd living-library
npm install
npm run build
npm test
```

### Tier-Specific Installation Scripts

**Location**: `/install/`

1. **install-living-library.sh** - Education deployment
   - Creates system directories
   - Sets up content harvesting
   - Configures tier-based filtering
   - Integrates with Gatekeeper

2. **install-neural-nexus.sh** - Technology domain (reference)
   - Technology company deployment
   - Engineering tier structure
   - Code and documentation indexing

---

## Domain Templates (Future)

### Planned Domains

| Domain | Name | Target | Status |
|--------|------|--------|--------|
| Education | **Living Library** | Schools, Universities | ✅ Complete |
| Technology | **Neural Nexus** | Tech Companies | 📋 Template |
| Healthcare | **Medical Codex** | Hospitals, Clinics | 📋 Template |
| Manufacturing | **Forge Network** | Manufacturing | 📋 Template |
| Finance | **Capital Archive** | Banks, Financial | 📋 Template |
| Creative | **Creative Muse** | Studios, Agencies | 📋 Template |

### Creating a New Domain

```bash
# 1. Copy Living Library structure
cp -r living-library/ my-domain/

# 2. Customize personas
# Edit src/personas/ to fit domain

# 3. Define domain-specific tiers
# Edit src/gating/tier-system.ts

# 4. Configure content types
# Edit src/content/content-types.ts

# 5. Set RA range for domain
# Edit configuration to claim RA degrees

# 6. Build and deploy
cd my-domain
npm install
npm run build
./install/install-my-domain.sh
```

---

## API Reference

### Content Access API
```typescript
GET /content/:ra/:dec/:alt
  - Retrieves content at specific coordinate
  - Requires valid Gatekeeper credential
  - Returns adapted content based on tier

POST /content/search
  - Search within RA/DEC/ALT ranges
  - Filter by tier
  - Returns coordinate list

GET /persona/:type/interact
  - Interact with AI persona (headmaster, teacher, etc.)
  - Persona awareness limited by tier

POST /curriculum/evaluate
  - P-12 learning evaluation
  - Personalized curriculum path
  - Progress tracking
```

### Harvester API
```typescript
POST /harvest/directory
  - Scan and index directory
  - Assign coordinates
  - Return harvested count

POST /harvest/git
  - Index git repository
  - Track commits for versioning
  - Generate knowledge graph
```

---

## Configuration

### Environment Variables
```bash
KNOWLEDGE_CENTRE_PORT=3000
GATEKEEPER_URL=https://gatekeeper.institution.edu
STORAGE_PROVIDER=nextcloud
NEXTCLOUD_URL=https://cloud.institution.edu
NEXTCLOUD_USER=knowledge-centre
NEXTCLOUD_PASSWORD=<secret>
DEFAULT_TIER=0
ENABLE_HARVESTING=true
```

### Role Configuration
```yaml
# config/roles/teacher.yaml
name: Teacher
description: Subject matter expert
altitudeRange: [0, 12]
permissions:
  - VIEW_CONTENT
  - ADAPT_CURRICULUM
  - TRACK_PROGRESS
  - ASSIGN_TASKS
canAccessDomains:
  - mathematics
  - science
  - literature
```

### Tier Configuration
```yaml
# config/tiers/elementary.yaml
name: Elementary School
level: 5
maxAltitude: 5
contentAccess: FILTERED
features:
  - interactive_learning
  - gamification
  - parental_controls
maxConcurrentSessions: 30
```

---

## Testing

```bash
# Unit tests
npm test

# Integration tests with Gatekeeper
npm run test:integration

# Harvester tests
npm run test:harvester

# Coverage report
npm run test:coverage
```

---

## Documentation

**Location**: `/docs/`

- **ARCHITECTURE.md** - System design
- **GATEKEEPER_INTEGRATION.md** - Integration patterns
- **EXPANDABLE_ROLE_SYSTEM.md** - RBAC documentation
- **PERSONA_SPECS.md** - Persona specifications
- **COMPANY_TIER_SYSTEM.md** - Tier system guide
- **NOMENCLATURE.md** - Naming conventions

---

## Key Principles

1. **Self-Hosted First** - Institutions control their data
2. **Celestial Organization** - Deterministic coordinate assignment
3. **Tier-Based Access** - Altitude restricts content visibility
4. **Domain Isolation** - Each domain claims RA range
5. **Gatekeeper Integration** - All access validated through federation
6. **Persona-Driven** - AI personas provide natural interaction
7. **Knowledge Graph** - Content relationships preserved

---

## Performance Characteristics

- **Coordinate lookup**: O(log n) via spatial index
- **Content serving**: <100ms for local, <500ms for cloud
- **Harvesting**: ~1000 files/second
- **Concurrent users**: 100+ per instance
- **Storage**: Unlimited (depends on provider)

---

## Security

- **Credential validation** via GatekeeperNetwork
- **11 Laws compliance** enforced
- **Tier isolation** prevents privilege escalation
- **Encrypted storage** optional (provider-dependent)
- **Audit logging** all access attempts
- **Content signing** for provenance

---

## Roadmap

### Phase 1: Complete ✅
- Living Library reference implementation
- Celestial coordinate system
- Persona system
- Tier-based access
- Harvester utilities

### Phase 2: In Progress 🔄
- GatekeeperNetwork integration
- Real-time sync across institutions
- Mobile apps (iOS/Android)

### Phase 3: Planned 📋
- Additional domain implementations
- Advanced knowledge graph
- Collaborative learning features
- Analytics dashboard

---

## License

Proprietary - Souls in Development

## Contact

For implementation guidance or domain-specific customization, refer to Living Library source code as reference.
