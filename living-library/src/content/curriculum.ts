/**
 * P-12 Curriculum Structure
 *
 * Defines the curriculum organization and knowledge graph
 * positioned in celestial coordinate space
 */

import { AstronomicalCoordinate, CELESTIAL_ANCHORS } from '../personas/persona-spec';
import { SubjectDomain } from '../personas/teacher';
import { EducationalContent } from './content-types';

/**
 * Curriculum node in the knowledge graph
 * Each node is positioned in celestial coordinate space
 */
export interface CurriculumNode {
  id: string;
  coordinate: AstronomicalCoordinate;
  title: string;
  description: string;
  gradeLevel: number;                // 0-12 (K-12)
  domain: SubjectDomain;

  // Learning structure
  prerequisites: string[];           // Node IDs that must be completed first
  estimatedDuration: number;         // minutes
  learningObjectives: string[];

  // Content and assessments
  assessments: string[];             // Assessment IDs
  content: string[];                 // Content IDs

  // Connections in knowledge graph
  relatedNodes: string[];            // Conceptually related nodes
  nextNodes: string[];               // Suggested next nodes

  // Metadata
  standardsAlignment?: StandardAlignment[];
  keywords: string[];
  difficulty: number;                // 0-1
}

/**
 * Standards alignment (Common Core, Next Gen Science, etc.)
 */
export interface StandardAlignment {
  framework: string;                 // e.g., "CCSS", "NGSS", "State Standards"
  standard: string;                  // e.g., "CCSS.MATH.CONTENT.3.OA.A.1"
  description: string;
}

/**
 * Curriculum path (sequence of nodes)
 */
export interface CurriculumPath {
  id: string;
  title: string;
  description: string;
  gradeLevel: number;
  domain: SubjectDomain;
  nodes: string[];                   // Node IDs in sequence
  estimatedTotalDuration: number;    // minutes
  milestones: Milestone[];
}

/**
 * Milestone in curriculum path
 */
export interface Milestone {
  nodeId: string;
  title: string;
  description: string;
  assessmentRequired: boolean;
  minimumScore?: number;             // 0-1
}

/**
 * Knowledge graph representing full curriculum
 */
export interface KnowledgeGraph {
  nodes: Map<string, CurriculumNode>;
  edges: GraphEdge[];
  coordinateIndex: CoordinateIndex;
}

/**
 * Edge between curriculum nodes
 */
export interface GraphEdge {
  from: string;                      // Node ID
  to: string;                        // Node ID
  type: 'prerequisite' | 'related' | 'next' | 'builds_on';
  strength: number;                  // 0-1 (how strong the connection is)
}

/**
 * Spatial index for efficient coordinate-based queries
 */
export interface CoordinateIndex {
  regions: Map<string, string[]>;    // Region key -> Node IDs
}

/**
 * Grade level curriculum organization
 */
export interface GradeLevelCurriculum {
  gradeLevel: number;
  domains: Map<SubjectDomain, DomainCurriculum>;
  coordinateRegion: {
    raRange: [number, number];
    decRange: [number, number];
    altRange: [number, number];
  };
}

/**
 * Domain-specific curriculum
 */
export interface DomainCurriculum {
  domain: SubjectDomain;
  paths: CurriculumPath[];
  coreNodes: string[];               // Essential nodes for this domain
  enrichmentNodes: string[];         // Optional advanced nodes
}

/**
 * Curriculum standards and guidelines
 */
export const CURRICULUM_STANDARDS = {
  // Grade level coordinate regions expand outward from POLARIS
  KINDERGARTEN: {
    gradeLevel: 0,
    coordinateRegion: {
      raRange: [37.0, 39.0],
      decRange: [88.0, 90.0],
      altRange: [0, 5],
    },
  },
  ELEMENTARY: {
    gradeLevel: [1, 5],
    coordinateRegion: {
      raRange: [30.0, 50.0],
      decRange: [85.0, 90.0],
      altRange: [5, 50],
    },
  },
  MIDDLE_SCHOOL: {
    gradeLevel: [6, 8],
    coordinateRegion: {
      raRange: [20.0, 80.0],
      decRange: [70.0, 90.0],
      altRange: [50, 200],
    },
  },
  HIGH_SCHOOL: {
    gradeLevel: [9, 12],
    coordinateRegion: {
      raRange: [0.0, 360.0],
      decRange: [-90.0, 90.0],
      altRange: [200, 3000],
    },
  },
} as const;

/**
 * Build knowledge graph from curriculum nodes
 */
export function buildKnowledgeGraph(nodes: CurriculumNode[]): KnowledgeGraph {
  const nodeMap = new Map<string, CurriculumNode>();
  const edges: GraphEdge[] = [];
  const coordinateIndex: CoordinateIndex = { regions: new Map() };

  // Build node map
  for (const node of nodes) {
    nodeMap.set(node.id, node);

    // Index by coordinate region
    const regionKey = getRegionKey(node.coordinate);
    const regionNodes = coordinateIndex.regions.get(regionKey) || [];
    regionNodes.push(node.id);
    coordinateIndex.regions.set(regionKey, regionNodes);
  }

  // Build edges
  for (const node of nodes) {
    // Prerequisite edges
    for (const prereqId of node.prerequisites) {
      edges.push({
        from: prereqId,
        to: node.id,
        type: 'prerequisite',
        strength: 1.0,
      });
    }

    // Related edges
    for (const relatedId of node.relatedNodes) {
      edges.push({
        from: node.id,
        to: relatedId,
        type: 'related',
        strength: 0.7,
      });
    }

    // Next edges
    for (const nextId of node.nextNodes) {
      edges.push({
        from: node.id,
        to: nextId,
        type: 'next',
        strength: 0.8,
      });
    }
  }

  return { nodes: nodeMap, edges, coordinateIndex };
}

/**
 * Get region key for coordinate (for spatial indexing)
 */
function getRegionKey(coord: AstronomicalCoordinate): string {
  const raBucket = Math.floor(coord.ra / 10) * 10;
  const decBucket = Math.floor(coord.dec / 10) * 10;
  const altBucket = Math.floor(coord.alt / 100) * 100;
  return `${raBucket}_${decBucket}_${altBucket}`;
}

/**
 * Find nodes near a coordinate
 */
export function findNodesNearCoordinate(
  graph: KnowledgeGraph,
  coordinate: AstronomicalCoordinate,
  maxDistance: number = 10
): CurriculumNode[] {
  const regionKey = getRegionKey(coordinate);
  const candidates = graph.coordinateIndex.regions.get(regionKey) || [];

  const nearbyNodes: Array<{ node: CurriculumNode; distance: number }> = [];

  for (const nodeId of candidates) {
    const node = graph.nodes.get(nodeId);
    if (!node) continue;

    const distance = calculateCelestialDistance(coordinate, node.coordinate);
    if (distance <= maxDistance) {
      nearbyNodes.push({ node, distance });
    }
  }

  // Sort by distance
  nearbyNodes.sort((a, b) => a.distance - b.distance);

  return nearbyNodes.map(item => item.node);
}

/**
 * Calculate celestial distance
 */
function calculateCelestialDistance(
  coord1: AstronomicalCoordinate,
  coord2: AstronomicalCoordinate
): number {
  const ra1 = (coord1.ra * Math.PI) / 180;
  const dec1 = (coord1.dec * Math.PI) / 180;
  const ra2 = (coord2.ra * Math.PI) / 180;
  const dec2 = (coord2.dec * Math.PI) / 180;

  const deltaRA = ra2 - ra1;

  const a =
    Math.sin((dec2 - dec1) / 2) ** 2 +
    Math.cos(dec1) * Math.cos(dec2) * Math.sin(deltaRA / 2) ** 2;

  const angularDistance = 2 * Math.asin(Math.sqrt(a));

  return (angularDistance * 180) / Math.PI;
}

/**
 * Find prerequisite chain for a node
 */
export function getPrerequisiteChain(
  graph: KnowledgeGraph,
  nodeId: string
): CurriculumNode[] {
  const chain: CurriculumNode[] = [];
  const visited = new Set<string>();
  const queue: string[] = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = graph.nodes.get(currentId);
    if (!node) continue;

    chain.push(node);

    // Add prerequisites to queue
    for (const prereqId of node.prerequisites) {
      if (!visited.has(prereqId)) {
        queue.push(prereqId);
      }
    }
  }

  // Reverse to get from foundation to target
  return chain.reverse();
}

/**
 * Generate personalized curriculum path
 */
export function generatePersonalizedPath(
  graph: KnowledgeGraph,
  studentProgress: {
    masteredNodes: string[];
    inProgressNodes: string[];
    gradeLevel: number;
    preferredDomains: SubjectDomain[];
  },
  targetNode: string
): CurriculumPath {
  const masteredSet = new Set(studentProgress.masteredNodes);
  const inProgressSet = new Set(studentProgress.inProgressNodes);

  // Get prerequisite chain
  const chain = getPrerequisiteChain(graph, targetNode);

  // Filter to only nodes not yet mastered
  const pathNodes = chain.filter(
    node => !masteredSet.has(node.id) && !inProgressSet.has(node.id)
  );

  // Calculate total duration
  const totalDuration = pathNodes.reduce((sum, node) => sum + node.estimatedDuration, 0);

  // Identify milestones (every 3-4 nodes)
  const milestones: Milestone[] = [];
  for (let i = 0; i < pathNodes.length; i += 3) {
    const node = pathNodes[i];
    milestones.push({
      nodeId: node.id,
      title: node.title,
      description: `Complete ${node.title} and demonstrate understanding`,
      assessmentRequired: true,
      minimumScore: 0.7,
    });
  }

  const targetNodeObj = graph.nodes.get(targetNode)!;

  return {
    id: `path_${Date.now()}`,
    title: `Path to ${targetNodeObj.title}`,
    description: `Personalized learning path for ${studentProgress.gradeLevel}th grade`,
    gradeLevel: studentProgress.gradeLevel,
    domain: targetNodeObj.domain,
    nodes: pathNodes.map(n => n.id),
    estimatedTotalDuration: totalDuration,
    milestones,
  };
}

/**
 * Check if student is ready for a node
 */
export function isReadyForNode(
  graph: KnowledgeGraph,
  nodeId: string,
  masteredNodes: Set<string>
): boolean {
  const node = graph.nodes.get(nodeId);
  if (!node) return false;

  // Check if all prerequisites are mastered
  return node.prerequisites.every(prereqId => masteredNodes.has(prereqId));
}
