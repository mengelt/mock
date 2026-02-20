export type Severity = "critical" | "high" | "medium" | "low";

export interface VulnerabilityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ProjectScan {
  id: string;
  name: string;
  version: string;
  lastScanned: string;
  scanDuration: string;
  fileSize: string;
  directDeps: number;
  indirectDeps: number;
  vulnerabilities: VulnerabilityCounts;
  licenses: { compliant: number; nonCompliant: number; unknown: number };
  status: "passing" | "failing" | "warning";
}

export interface ProjectGroup {
  name: string;
  projects: ProjectScan[];
}

export interface Dependency {
  name: string;
  installedVersion: string;
  latestVersion: string;
  isDirect: boolean;
  license: string;
  licenseCompliant: boolean;
  cves: CveEntry[];
}

export interface CveEntry {
  id: string;
  severity: Severity;
  score: number;
  fixVersion: string | null;
  published: string;
}
