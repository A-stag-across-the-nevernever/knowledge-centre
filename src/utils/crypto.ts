/**
 * Cryptographic Utilities for KnowledgeCentre
 * Self-contained - no dependencies on other components
 */

import * as crypto from 'crypto';

/**
 * Hash data with SHA-256
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Derive deterministic celestial coordinate from content hash
 * Used for automatic coordinate assignment during content harvesting
 */
export function hashToCoordinate(data: string): { ra: number; dec: number; alt: number } {
  const hashValue = hash(data);

  // Use different parts of hash for each coordinate
  const raPart = hashValue.substring(0, 8);
  const decPart = hashValue.substring(8, 16);
  const altPart = hashValue.substring(16, 24);

  // Convert hex to numbers in appropriate ranges
  const ra = (parseInt(raPart, 16) % 36000) / 100;  // 0-360 degrees
  const dec = ((parseInt(decPart, 16) % 18000) / 100) - 90;  // -90 to +90 degrees
  const alt = (parseInt(altPart, 16) % 2000) / 100;  // 0-20 altitude

  return { ra, dec, alt };
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return prefix ? `${prefix}-${randomBytes}` : randomBytes;
}
