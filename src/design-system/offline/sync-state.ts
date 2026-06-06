export type OfflineOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface OfflineQueueItem {
  id: string; // Unique GUID for tracking
  timestamp: string; // ISO String
  table: string; // Database table name
  operation: OfflineOperationType;
  payload: Record<string, any>;
  retries: number;
  lastAttemptAt?: string;
  error?: string;
}

export enum SyncState {
  IDLE = 'IDLE',
  SYNCING = 'SYNCING',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR'
}

export interface RetryPolicy {
  maxRetries: number;
  backoffFactorMs: number; // Exponential backoff scaling base (e.g. 1000 * 2^retries)
  timeoutMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 5,
  backoffFactorMs: 1500,
  timeoutMs: 10000
};

/**
 * Placeholder function for detecting sync conflicts.
 * In a real implementation, this compares updated_at timestamps or checksums.
 * Returns true if a conflict is detected, false otherwise.
 */
export function detectConflict(
  localData: Record<string, any>,
  serverData: Record<string, any>
): boolean {
  if (!localData || !serverData) return false;
  
  // Strict check on concurrency control timestamps
  if (localData.updated_at && serverData.updated_at) {
    return new Date(localData.updated_at).getTime() < new Date(serverData.updated_at).getTime();
  }
  
  return false;
}
