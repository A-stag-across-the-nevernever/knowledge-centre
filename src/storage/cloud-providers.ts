/**
 * Cloud Provider Adapters for Pocket Storage
 *
 * Built-in support for multiple cloud storage providers.
 * Users can choose their preferred cloud or self-host.
 */

/**
 * Supported cloud providers
 */
export enum CloudProvider {
  // Self-hosted (preferred)
  SELF_HOSTED = 'self_hosted',

  // Object storage
  AWS_S3 = 'aws_s3',
  CLOUDFLARE_R2 = 'cloudflare_r2',
  BACKBLAZE_B2 = 'backblaze_b2',
  WASABI = 'wasabi',
  DIGITAL_OCEAN_SPACES = 'digitalocean_spaces',
  MINIO = 'minio',                    // Self-hosted S3-compatible

  // Traditional cloud storage
  DROPBOX = 'dropbox',
  GOOGLE_DRIVE = 'google_drive',
  MICROSOFT_ONEDRIVE = 'onedrive',
  BOX = 'box',
  MEGA = 'mega',
  PCLOUD = 'pcloud',
  SYNC_COM = 'sync_com',              // Privacy-focused

  // Specialized
  NEXTCLOUD = 'nextcloud',            // Self-hosted, open source
  OWNCLOUD = 'owncloud',              // Self-hosted, open source
  SEAFILE = 'seafile',                // Self-hosted, open source
  SYNCTHING = 'syncthing',            // P2P sync, no cloud

  // Git-based
  GITHUB = 'github',
  GITLAB = 'gitlab',
  GITEA = 'gitea',                    // Self-hosted
  FORGEJO = 'forgejo',                // Self-hosted

  // Academic/Research
  ZENODO = 'zenodo',
  FIGSHARE = 'figshare',
  OSF = 'osf',                        // Open Science Framework

  // IPFS (decentralized)
  IPFS = 'ipfs',
  FILECOIN = 'filecoin',

  // Custom
  CUSTOM_S3_COMPATIBLE = 'custom_s3',
  CUSTOM_WEBDAV = 'custom_webdav',
  CUSTOM_API = 'custom_api',
}

/**
 * Cloud provider configuration
 */
export interface CloudProviderConfig {
  provider: CloudProvider;

  // Authentication
  credentials: {
    // For most providers
    accessKey?: string;
    secretKey?: string;

    // For OAuth providers (Dropbox, Google Drive, etc.)
    oauthToken?: string;
    refreshToken?: string;

    // For username/password providers
    username?: string;
    password?: string;

    // For API key providers
    apiKey?: string;

    // For custom
    customAuth?: Record<string, any>;
  };

  // Endpoint configuration
  endpoint?: string;              // Custom endpoint URL
  region?: string;                // AWS region, etc.
  bucket?: string;                // S3 bucket name
  basePath?: string;              // Base path within storage

  // Options
  encrypted?: boolean;            // Client-side encryption
  compressionEnabled?: boolean;   // Compress before upload
  versioning?: boolean;           // Enable versioning

  // Performance
  maxConcurrentUploads?: number;
  maxConcurrentDownloads?: number;
  chunkSize?: number;             // For large files (bytes)

  // Privacy
  zeroKnowledge?: boolean;        // True zero-knowledge encryption
  e2eEncryption?: boolean;        // End-to-end encryption
}

/**
 * Cloud provider adapter interface
 */
export interface CloudProviderAdapter {
  provider: CloudProvider;
  config: CloudProviderConfig;

  // Core operations
  upload(localPath: string, remotePath: string): Promise<CloudUploadResult>;
  download(remotePath: string, localPath: string): Promise<CloudDownloadResult>;
  delete(remotePath: string): Promise<void>;
  exists(remotePath: string): Promise<boolean>;

  // Metadata
  getMetadata(remotePath: string): Promise<CloudFileMetadata>;
  listFiles(remotePath: string): Promise<CloudFileMetadata[]>;

  // Advanced
  getSignedUrl(remotePath: string, expiresIn: number): Promise<string>;
  copy(fromPath: string, toPath: string): Promise<void>;
  move(fromPath: string, toPath: string): Promise<void>;
}

/**
 * Upload result
 */
export interface CloudUploadResult {
  success: boolean;
  remotePath: string;
  url?: string;
  etag?: string;
  versionId?: string;
  size: number;
  uploadTime: number;  // milliseconds
}

/**
 * Download result
 */
export interface CloudDownloadResult {
  success: boolean;
  localPath: string;
  size: number;
  downloadTime: number;
}

/**
 * Cloud file metadata
 */
export interface CloudFileMetadata {
  path: string;
  name: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag?: string;
  versionId?: string;
  isDirectory: boolean;
  customMetadata?: Record<string, string>;
}

/**
 * Provider comparison chart
 */
export const PROVIDER_COMPARISON = {
  // Self-hosted (RECOMMENDED)
  [CloudProvider.SELF_HOSTED]: {
    privacy: 'full',
    control: 'full',
    cost: 'hardware_only',
    setup: 'technical',
    encryption: 'your_keys',
    location: 'your_choice',
  },

  // Object Storage (BEST for programmatic access)
  [CloudProvider.AWS_S3]: {
    privacy: 'limited',
    control: 'limited',
    cost: '$0.023/GB',
    setup: 'easy',
    encryption: 'available',
    location: 'aws_regions',
  },
  [CloudProvider.CLOUDFLARE_R2]: {
    privacy: 'limited',
    control: 'limited',
    cost: '$0.015/GB (no egress)',
    setup: 'easy',
    encryption: 'available',
    location: 'cloudflare_network',
  },
  [CloudProvider.BACKBLAZE_B2]: {
    privacy: 'limited',
    control: 'limited',
    cost: '$0.005/GB',
    setup: 'easy',
    encryption: 'available',
    location: 'us_europe',
  },

  // Self-hosted open source (RECOMMENDED for institutions)
  [CloudProvider.NEXTCLOUD]: {
    privacy: 'full',
    control: 'full',
    cost: 'hardware_only',
    setup: 'moderate',
    encryption: 'e2e_available',
    location: 'your_choice',
  },
  [CloudProvider.MINIO]: {
    privacy: 'full',
    control: 'full',
    cost: 'hardware_only',
    setup: 'easy',
    encryption: 'your_keys',
    location: 'your_choice',
  },

  // Privacy-focused commercial
  [CloudProvider.SYNC_COM]: {
    privacy: 'high',
    control: 'limited',
    cost: '$8/month/TB',
    setup: 'easy',
    encryption: 'zero_knowledge',
    location: 'us_canada',
  },
  [CloudProvider.MEGA]: {
    privacy: 'high',
    control: 'limited',
    cost: '$5.50/month/400GB',
    setup: 'easy',
    encryption: 'e2e',
    location: 'global',
  },

  // Decentralized (FUTURE-PROOF)
  [CloudProvider.IPFS]: {
    privacy: 'public_by_default',
    control: 'distributed',
    cost: 'varies',
    setup: 'technical',
    encryption: 'manual',
    location: 'distributed',
  },
};

/**
 * Recommended providers by use case
 */
export const RECOMMENDED_BY_USE_CASE = {
  // Educational institutions
  education: {
    primary: CloudProvider.NEXTCLOUD,      // Self-hosted, full control
    alternative: CloudProvider.MINIO,      // S3-compatible, self-hosted
    cloud: CloudProvider.BACKBLAZE_B2,     // Cheap, reliable
  },

  // Healthcare (HIPAA compliance)
  healthcare: {
    primary: CloudProvider.SELF_HOSTED,    // Full control required
    alternative: CloudProvider.NEXTCLOUD,  // Self-hosted with encryption
    cloud: CloudProvider.AWS_S3,           // With HIPAA BAA
  },

  // Technology companies
  technology: {
    primary: CloudProvider.SELF_HOSTED,    // Full control
    alternative: CloudProvider.MINIO,      // S3-compatible
    cloud: CloudProvider.CLOUDFLARE_R2,    // No egress fees
  },

  // Small business
  small_business: {
    primary: CloudProvider.NEXTCLOUD,      // Easy self-hosted
    alternative: CloudProvider.BACKBLAZE_B2, // Cheap cloud
    cloud: CloudProvider.DROPBOX,          // Easy to use
  },

  // Solo/Freelance
  solo: {
    primary: CloudProvider.SYNC_COM,       // Privacy-focused, easy
    alternative: CloudProvider.MEGA,       // Privacy-focused, free tier
    cloud: CloudProvider.GOOGLE_DRIVE,     // Convenient
  },

  // Research/Academic
  research: {
    primary: CloudProvider.ZENODO,         // Academic standard
    alternative: CloudProvider.OSF,        // Open Science Framework
    cloud: CloudProvider.FIGSHARE,         // Research data
  },
};

/**
 * Provider feature matrix
 */
export interface ProviderFeatures {
  s3Compatible: boolean;
  webdavCompatible: boolean;
  apiAvailable: boolean;
  versioningSupported: boolean;
  e2eEncryption: boolean;
  zeroKnowledge: boolean;
  selfHostable: boolean;
  openSource: boolean;
}

export const PROVIDER_FEATURES: Record<CloudProvider, ProviderFeatures> = {
  [CloudProvider.SELF_HOSTED]: {
    s3Compatible: false,
    webdavCompatible: true,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: true,
    zeroKnowledge: true,
    selfHostable: true,
    openSource: true,
  },

  [CloudProvider.AWS_S3]: {
    s3Compatible: true,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: false,
    zeroKnowledge: false,
    selfHostable: false,
    openSource: false,
  },

  [CloudProvider.CLOUDFLARE_R2]: {
    s3Compatible: true,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: false,
    zeroKnowledge: false,
    selfHostable: false,
    openSource: false,
  },

  [CloudProvider.BACKBLAZE_B2]: {
    s3Compatible: true,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: false,
    zeroKnowledge: false,
    selfHostable: false,
    openSource: false,
  },

  [CloudProvider.MINIO]: {
    s3Compatible: true,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: true,
    zeroKnowledge: true,
    selfHostable: true,
    openSource: true,
  },

  [CloudProvider.NEXTCLOUD]: {
    s3Compatible: false,
    webdavCompatible: true,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: true,
    zeroKnowledge: false,
    selfHostable: true,
    openSource: true,
  },

  [CloudProvider.DROPBOX]: {
    s3Compatible: false,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: false,
    zeroKnowledge: false,
    selfHostable: false,
    openSource: false,
  },

  [CloudProvider.SYNC_COM]: {
    s3Compatible: false,
    webdavCompatible: true,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: true,
    zeroKnowledge: true,
    selfHostable: false,
    openSource: false,
  },

  [CloudProvider.IPFS]: {
    s3Compatible: false,
    webdavCompatible: false,
    apiAvailable: true,
    versioningSupported: true,
    e2eEncryption: false,
    zeroKnowledge: false,
    selfHostable: true,
    openSource: true,
  },

  // ... more providers
};

/**
 * Configuration examples
 */
export const CONFIGURATION_EXAMPLES = {
  // Self-hosted MinIO
  minio: {
    provider: CloudProvider.MINIO,
    credentials: {
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    },
    endpoint: 'http://localhost:9000',
    bucket: 'knowledge-centre',
    encrypted: true,
    e2eEncryption: true,
  },

  // Cloudflare R2
  cloudflare_r2: {
    provider: CloudProvider.CLOUDFLARE_R2,
    credentials: {
      accessKey: process.env.R2_ACCESS_KEY,
      secretKey: process.env.R2_SECRET_KEY,
    },
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    bucket: 'techcorp-knowledge',
    encrypted: true,
  },

  // Backblaze B2
  backblaze_b2: {
    provider: CloudProvider.BACKBLAZE_B2,
    credentials: {
      accessKey: process.env.B2_KEY_ID,
      secretKey: process.env.B2_APPLICATION_KEY,
    },
    endpoint: 's3.us-west-004.backblazeb2.com',
    bucket: 'school-curriculum',
    encrypted: true,
  },

  // Nextcloud (self-hosted)
  nextcloud: {
    provider: CloudProvider.NEXTCLOUD,
    credentials: {
      username: 'admin',
      password: process.env.NEXTCLOUD_PASSWORD,
    },
    endpoint: 'https://cloud.myschool.edu',
    basePath: '/remote.php/dav/files/admin',
    encrypted: true,
    e2eEncryption: true,
  },

  // Sync.com (privacy-focused)
  sync_com: {
    provider: CloudProvider.SYNC_COM,
    credentials: {
      username: 'user@example.com',
      password: process.env.SYNC_PASSWORD,
    },
    endpoint: 'https://api.sync.com',
    basePath: '/knowledge-centre',
    zeroKnowledge: true,
  },

  // IPFS (decentralized)
  ipfs: {
    provider: CloudProvider.IPFS,
    endpoint: 'http://localhost:5001',  // Local IPFS node
    credentials: {
      apiKey: process.env.IPFS_API_KEY,  // Optional, for pinning services
    },
  },
};

/**
 * Migration helper
 */
export interface MigrationPlan {
  from: CloudProvider;
  to: CloudProvider;
  estimatedTime: string;
  steps: string[];
  risks: string[];
  recommendations: string[];
}

export function planMigration(from: CloudProvider, to: CloudProvider, dataSize: number): MigrationPlan {
  // Calculate migration time based on typical bandwidth
  const gbSize = dataSize / (1024 * 1024 * 1024);
  const hoursEstimate = Math.ceil(gbSize / 10);  // Assume 10 GB/hour

  return {
    from,
    to,
    estimatedTime: `${hoursEstimate} hours for ${gbSize.toFixed(2)} GB`,
    steps: [
      `1. Set up ${to} provider`,
      '2. Enable versioning on new provider',
      '3. Run parallel sync (read from old, write to new)',
      '4. Verify data integrity (checksums)',
      '5. Update Knowledge Centre pocket paths',
      '6. Switch traffic to new provider',
      '7. Monitor for 1 week',
      '8. Decommission old provider',
    ],
    risks: [
      'Data loss during transfer',
      'Downtime during switchover',
      'Cost of running both providers during migration',
    ],
    recommendations: [
      'Migrate during low-usage period',
      'Keep old provider active for 1 month as backup',
      'Use incremental sync to minimize downtime',
    ],
  };
}

/**
 * Cost calculator
 */
export interface CostEstimate {
  provider: CloudProvider;
  storage: number;  // GB
  monthlyCost: number;
  yearlyYCost: number;
  breakdown: {
    storage: number;
    egress: number;
    operations: number;
  };
}

export function estimateCost(
  provider: CloudProvider,
  storageGB: number,
  monthlyDownloadsGB: number = 0,
  monthlyOperations: number = 0
): CostEstimate {
  // Simplified cost calculation
  const costs = {
    [CloudProvider.AWS_S3]: { storage: 0.023, egress: 0.09, operations: 0.0004 },
    [CloudProvider.CLOUDFLARE_R2]: { storage: 0.015, egress: 0, operations: 0.00036 },
    [CloudProvider.BACKBLAZE_B2]: { storage: 0.005, egress: 0.01, operations: 0.0004 },
    [CloudProvider.SELF_HOSTED]: { storage: 0, egress: 0, operations: 0 },
    [CloudProvider.MINIO]: { storage: 0, egress: 0, operations: 0 },
  };

  const providerCosts = costs[provider] || { storage: 0, egress: 0, operations: 0 };

  const storageCost = storageGB * providerCosts.storage;
  const egressCost = monthlyDownloadsGB * providerCosts.egress;
  const operationsCost = monthlyOperations * providerCosts.operations;

  const monthlyCost = storageCost + egressCost + operationsCost;

  return {
    provider,
    storage: storageGB,
    monthlyCost,
    yearlyCost: monthlyCost * 12,
    breakdown: {
      storage: storageCost,
      egress: egressCost,
      operations: operationsCost,
    },
  };
}
