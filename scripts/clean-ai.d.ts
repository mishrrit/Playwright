export interface CleanupOptions {
  rootDir?: string;
  includeTestResults?: boolean;
  keepRuns?: string;
}

export interface CleanupResult {
  cleaned: string[];
  archivedTo?: string;
  removedArchives: string[];
  keepRuns: number;
  warnings: string[];
}

export function cleanRunArtifacts(options?: CleanupOptions): CleanupResult;
