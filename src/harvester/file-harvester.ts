/**
 * File Harvester - Automatic Content Discovery and Indexing
 *
 * Scans existing file systems, git repos, cloud storage, databases on install.
 * Automatically tags, categorizes, and assigns celestial coordinates.
 *
 * Run once during installation, or periodically to keep index fresh.
 */

import * as fs from "fs";
import * as path from "path";
import { hashToCoordinate } from "../utils/crypto";

/**
 * Harvester configuration
 */
export interface HarvesterConfig {
  harvesterId: string;
  name: string;

  // What to scan
  sources: HarvestSource[];

  // How to process
  processors: ContentProcessor[];

  // Where to index
  indexDestination: string; // Path to index database

  // Options
  options: {
    recursive: boolean;
    followSymlinks: boolean;
    ignoreHidden: boolean;
    maxFileSize?: number; // bytes, skip files larger than this
    maxDepth?: number; // directory depth limit
    excludePatterns?: string[]; // glob patterns to exclude
    includePatterns?: string[]; // glob patterns to include (if specified, ONLY these)
  };

  // Auto-tagging
  autoTagging: {
    enabled: boolean;
    extractFromFilename: boolean;
    extractFromPath: boolean;
    extractFromContent: boolean;
    useMetadata: boolean;
  };

  // Progress tracking
  progressCallback?: (progress: HarvestProgress) => void;
}

/**
 * Harvest source
 */
export interface HarvestSource {
  sourceId: string;
  sourceType: "filesystem" | "git" | "s3" | "database" | "http" | "custom";

  // Location
  path: string; // Filesystem path, git URL, S3 bucket, etc.

  // Authentication (for cloud/remote sources)
  credentials?: {
    accessKey?: string;
    secretKey?: string;
    token?: string;
  };

  // Source-specific options
  options?: Record<string, any>;
}

/**
 * Content processor
 * Analyzes files and generates metadata
 */
export interface ContentProcessor {
  processorId: string;
  name: string;

  // Which files to process
  fileTypes: string[]; // ['pdf', 'docx', 'md', 'txt', etc.]

  // What to extract
  extract: {
    text?: boolean; // Extract full text
    metadata?: boolean; // Extract file metadata
    embeddings?: boolean; // Generate semantic embeddings
    tags?: boolean; // Auto-generate tags
    summary?: boolean; // Generate summary
  };

  // Coordinate assignment strategy
  coordinateStrategy: "semantic" | "hierarchical" | "hash" | "manual" | "ml";

  // For semantic strategy
  semanticConfig?: {
    model: string; // 'text-embedding-ada-002', 'sentence-transformers', etc.
    raRange: [number, number];
    decRange: [number, number];
    altRange: [number, number];
  };

  // For hierarchical strategy
  hierarchicalConfig?: {
    raBase: number; // Base RA for this category
    decBase: number;
    altFormula: string; // e.g., 'depth * 0.5'
  };
}

/**
 * Harvested item
 */
export interface HarvestedItem {
  itemId: string;
  source: string; // Source ID

  // Location
  originalPath: string; // Original file path/URL
  storageMode: "integrated" | "pocket";
  pocketPath?: string; // If pocket mode

  // File info
  filename: string;
  extension: string;
  size: number; // bytes
  mimeType: string;

  // Timestamps
  created: Date;
  modified: Date;
  harvested: Date;

  // Content
  textContent?: string; // Extracted text
  summary?: string;

  // Metadata
  metadata: {
    title?: string;
    author?: string;
    description?: string;
    tags: string[];
    categories: string[];
    language?: string;
    [key: string]: any;
  };

  // Coordinates
  coordinate: {
    ra: number;
    dec: number;
    alt: number;
  };

  // Semantic
  embedding?: number[]; // Vector embedding

  // Access control
  tierRestriction?: number;
  roleRestriction?: string[];
}

/**
 * Harvest progress
 */
export interface HarvestProgress {
  harvesterId: string;
  status: "running" | "paused" | "completed" | "failed";

  startTime: Date;
  currentTime: Date;

  stats: {
    filesScanned: number;
    filesIndexed: number;
    filesSkipped: number;
    filesFailed: number;
    bytesProcessed: number;

    byType: Record<string, number>; // Count by file type
  };

  currentFile?: string;
  estimatedTimeRemaining?: number; // seconds
  errors: HarvestError[];
}

/**
 * Harvest error
 */
export interface HarvestError {
  file: string;
  error: string;
  timestamp: Date;
}

/**
 * File Harvester
 */
export class FileHarvester {
  private config: HarvesterConfig;
  private progress: HarvestProgress;
  private harvestedItems: HarvestedItem[] = [];
  private shouldStop = false;

  constructor(config: HarvesterConfig) {
    this.config = config;
    this.progress = {
      harvesterId: config.harvesterId,
      status: "running",
      startTime: new Date(),
      currentTime: new Date(),
      stats: {
        filesScanned: 0,
        filesIndexed: 0,
        filesSkipped: 0,
        filesFailed: 0,
        bytesProcessed: 0,
        byType: {},
      },
      errors: [],
    };
  }

  /**
   * Start harvesting
   */
  async harvest(): Promise<HarvestedItem[]> {
    console.log(`[FileHarvester] Starting harvest: ${this.config.name}`);

    for (const source of this.config.sources) {
      if (this.shouldStop) break;

      await this.harvestSource(source);
    }

    this.progress.status = "completed";
    this.progress.currentTime = new Date();

    console.log(
      `[FileHarvester] Completed. Indexed ${this.progress.stats.filesIndexed} files.`,
    );

    return this.harvestedItems;
  }

  /**
   * Harvest a single source
   */
  private async harvestSource(source: HarvestSource): Promise<void> {
    console.log(
      `[FileHarvester] Harvesting source: ${source.sourceId} (${source.sourceType})`,
    );

    switch (source.sourceType) {
      case "filesystem":
        await this.harvestFilesystem(source);
        break;
      case "git":
        await this.harvestGit(source);
        break;
      case "s3":
        await this.harvestS3(source);
        break;
      default:
        console.log(
          `[FileHarvester] Unsupported source type: ${source.sourceType}`,
        );
    }
  }

  /**
   * Harvest filesystem
   */
  private async harvestFilesystem(source: HarvestSource): Promise<void> {
    const basePath = source.path;

    if (!fs.existsSync(basePath)) {
      this.progress.errors.push({
        file: basePath,
        error: "Path does not exist",
        timestamp: new Date(),
      });
      return;
    }

    await this.scanDirectory(basePath, basePath, 0);
  }

  /**
   * Recursively scan directory
   */
  private async scanDirectory(
    basePath: string,
    currentPath: string,
    depth: number,
  ): Promise<void> {
    if (this.shouldStop) return;

    // Check depth limit
    if (this.config.options.maxDepth && depth > this.config.options.maxDepth) {
      return;
    }

    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (this.shouldStop) break;

      const fullPath = path.join(currentPath, entry.name);

      // Skip hidden files if configured
      if (this.config.options.ignoreHidden && entry.name.startsWith(".")) {
        continue;
      }

      // Check exclusion patterns
      if (this.shouldExclude(fullPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (this.config.options.recursive) {
          await this.scanDirectory(basePath, fullPath, depth + 1);
        }
      } else if (entry.isFile()) {
        await this.processFile(basePath, fullPath);
      }
    }
  }

  /**
   * Process individual file
   */
  private async processFile(basePath: string, filePath: string): Promise<void> {
    this.progress.stats.filesScanned++;
    this.progress.currentFile = filePath;
    this.progress.currentTime = new Date();

    try {
      const stats = fs.statSync(filePath);

      // Check file size limit
      if (
        this.config.options.maxFileSize &&
        stats.size > this.config.options.maxFileSize
      ) {
        this.progress.stats.filesSkipped++;
        return;
      }

      const ext = path.extname(filePath).substring(1).toLowerCase();

      // Find appropriate processor
      const processor = this.findProcessor(ext);
      if (!processor) {
        this.progress.stats.filesSkipped++;
        return;
      }

      // Extract content and metadata
      const item = await this.extractContent(filePath, stats, processor);

      // Assign coordinates
      item.coordinate = await this.assignCoordinates(item, processor);

      // Auto-tag
      if (this.config.autoTagging.enabled) {
        await this.autoTag(item);
      }

      this.harvestedItems.push(item);
      this.progress.stats.filesIndexed++;
      this.progress.stats.bytesProcessed += stats.size;

      // Track by type
      this.progress.stats.byType[ext] =
        (this.progress.stats.byType[ext] || 0) + 1;

      // Progress callback
      if (this.config.progressCallback) {
        this.config.progressCallback(this.progress);
      }
    } catch (error) {
      this.progress.stats.filesFailed++;
      this.progress.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      });
    }
  }

  /**
   * Extract content from file
   */
  private async extractContent(
    filePath: string,
    stats: fs.Stats,
    processor: ContentProcessor,
  ): Promise<HarvestedItem> {
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).substring(1).toLowerCase();

    const item: HarvestedItem = {
      itemId: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      source: this.config.harvesterId,
      originalPath: filePath,
      storageMode: "pocket", // Default to pocket for harvested files
      pocketPath: filePath,
      filename,
      extension: ext,
      size: stats.size,
      mimeType: this.getMimeType(ext),
      created: stats.birthtime,
      modified: stats.mtime,
      harvested: new Date(),
      metadata: {
        tags: [],
        categories: [],
      },
      coordinate: { ra: 0, dec: 0, alt: 0 }, // Will be assigned later
    };

    // Extract text content for text files
    if (processor.extract.text && this.isTextFile(ext)) {
      try {
        item.textContent = fs.readFileSync(filePath, "utf8");

        // Generate summary if requested
        if (processor.extract.summary) {
          item.summary = this.generateSummary(item.textContent);
        }
      } catch (error) {
        // Binary file or encoding issue, skip text extraction
      }
    }

    return item;
  }

  /**
   * Assign celestial coordinates based on strategy
   */
  private async assignCoordinates(
    item: HarvestedItem,
    processor: ContentProcessor,
  ): Promise<{ ra: number; dec: number; alt: number }> {
    switch (processor.coordinateStrategy) {
      case "hash":
        return hashToCoordinate(item.originalPath);

      case "hierarchical":
        return this.assignHierarchicalCoordinate(item, processor);

      case "semantic":
        return this.assignSemanticCoordinate(item, processor);

      default:
        // Default: hash-based
        return hashToCoordinate(item.originalPath);
    }
  }

  /**
   * Assign hierarchical coordinate based on directory structure
   */
  private assignHierarchicalCoordinate(
    item: HarvestedItem,
    processor: ContentProcessor,
  ): { ra: number; dec: number; alt: number } {
    const config = processor.hierarchicalConfig;
    if (!config) {
      return hashToCoordinate(item.originalPath);
    }

    const depth = item.originalPath.split(path.sep).length;

    // Calculate altitude from depth using formula
    let alt = 0;
    try {
      // Simple formula evaluation (depth * multiplier)
      const match = config.altFormula.match(/depth\s*\*\s*([\d.]+)/);
      if (match) {
        alt = depth * parseFloat(match[1]);
      }
    } catch {
      alt = depth * 0.5; // Default
    }

    return {
      ra: config.raBase,
      dec: config.decBase,
      alt: Math.min(alt, 20), // Cap at 20 light-years
    };
  }

  /**
   * Assign semantic coordinate using embeddings
   */
  private async assignSemanticCoordinate(
    item: HarvestedItem,
    processor: ContentProcessor,
  ): Promise<{ ra: number; dec: number; alt: number }> {
    const config = processor.semanticConfig;
    if (!config || !item.textContent) {
      return hashToCoordinate(item.originalPath);
    }

    // TODO: Generate actual embeddings using specified model
    // For now, use hash as fallback
    return hashToCoordinate(item.textContent.substring(0, 1000));
  }

  /**
   * Auto-tag item based on content
   */
  private async autoTag(item: HarvestedItem): Promise<void> {
    // Extract from filename
    if (this.config.autoTagging.extractFromFilename) {
      const nameTags = item.filename
        .replace(path.extname(item.filename), "")
        .split(/[-_\s]+/)
        .filter((tag) => tag.length > 2)
        .map((tag) => tag.toLowerCase());

      item.metadata.tags.push(...nameTags);
    }

    // Extract from path
    if (this.config.autoTagging.extractFromPath) {
      const pathParts = item.originalPath.split(path.sep);
      item.metadata.tags.push(...pathParts.slice(-3, -1)); // Last 2 directories
    }

    // Extract from content (simple keyword extraction)
    if (this.config.autoTagging.extractFromContent && item.textContent) {
      const contentTags = this.extractKeywords(item.textContent);
      item.metadata.tags.push(...contentTags.slice(0, 10)); // Top 10 keywords
    }

    // Deduplicate tags
    item.metadata.tags = [...new Set(item.metadata.tags)];
  }

  /**
   * Simple keyword extraction (frequency-based)
   */
  private extractKeywords(text: string, topN: number = 10): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 4); // Only words > 4 chars

    const frequency: Record<string, number> = {};
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word);
  }

  /**
   * Generate simple summary (first N characters)
   */
  private generateSummary(text: string, maxLength: number = 500): string {
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    return cleaned.substring(0, maxLength) + "...";
  }

  /**
   * Find appropriate processor for file type
   */
  private findProcessor(extension: string): ContentProcessor | undefined {
    return this.config.processors.find((p) => p.fileTypes.includes(extension));
  }

  /**
   * Check if file should be excluded
   */
  private shouldExclude(filePath: string): boolean {
    if (!this.config.options.excludePatterns) return false;

    // Simple pattern matching (would use micromatch in production)
    for (const pattern of this.config.options.excludePatterns) {
      if (filePath.includes(pattern.replace("*", ""))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if file is text-based
   */
  private isTextFile(ext: string): boolean {
    const textExts = [
      "txt",
      "md",
      "js",
      "ts",
      "py",
      "java",
      "c",
      "cpp",
      "h",
      "json",
      "xml",
      "html",
      "css",
      "sql",
      "sh",
      "yaml",
      "yml",
    ];
    return textExts.includes(ext);
  }

  /**
   * Get MIME type for extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      txt: "text/plain",
      md: "text/markdown",
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      zip: "application/zip",
      json: "application/json",
      xml: "application/xml",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      ts: "application/typescript",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Harvest git repository
   */
  private async harvestGit(source: HarvestSource): Promise<void> {
    // TODO: Clone repo to temp directory and harvest
    console.log(
      `[FileHarvester] Git harvesting not yet implemented: ${source.path}`,
    );
  }

  /**
   * Harvest S3 bucket
   */
  private async harvestS3(source: HarvestSource): Promise<void> {
    // TODO: List S3 objects and harvest
    console.log(
      `[FileHarvester] S3 harvesting not yet implemented: ${source.path}`,
    );
  }

  /**
   * Stop harvesting
   */
  stop(): void {
    this.shouldStop = true;
    this.progress.status = "paused";
  }

  /**
   * Get current progress
   */
  getProgress(): HarvestProgress {
    return { ...this.progress };
  }

  /**
   * Get harvested items
   */
  getItems(): HarvestedItem[] {
    return [...this.harvestedItems];
  }
}

/**
 * Quick harvest helper
 */
export async function quickHarvest(
  directory: string,
  domain: string,
): Promise<HarvestedItem[]> {
  const config: HarvesterConfig = {
    harvesterId: `harvest-${Date.now()}`,
    name: `Quick harvest of ${directory}`,
    sources: [
      {
        sourceId: "source-1",
        sourceType: "filesystem",
        path: directory,
      },
    ],
    processors: [
      {
        processorId: "proc-text",
        name: "Text Files",
        fileTypes: [
          "txt",
          "md",
          "js",
          "ts",
          "py",
          "java",
          "c",
          "cpp",
          "html",
          "css",
          "json",
        ],
        extract: {
          text: true,
          metadata: true,
          tags: true,
          summary: true,
        },
        coordinateStrategy: "hierarchical",
        hierarchicalConfig: {
          raBase: 0,
          decBase: 0,
          altFormula: "depth * 0.5",
        },
      },
      {
        processorId: "proc-docs",
        name: "Documents",
        fileTypes: ["pdf", "docx", "xlsx"],
        extract: {
          metadata: true,
          tags: true,
        },
        coordinateStrategy: "hash",
      },
    ],
    indexDestination: "./harvest-index.json",
    options: {
      recursive: true,
      followSymlinks: false,
      ignoreHidden: true,
      excludePatterns: ["node_modules", ".git", "dist", "build"],
    },
    autoTagging: {
      enabled: true,
      extractFromFilename: true,
      extractFromPath: true,
      extractFromContent: true,
      useMetadata: true,
    },
  };

  const harvester = new FileHarvester(config);
  return await harvester.harvest();
}
