export const projectGroups = [
  {
    name: "CAIRO",
    projects: [
      {
        id: "cairo-fe",
        name: "cairo-frontend",
        version: "2.14.0",
        lastScanned: "Feb 9, 2026, 10:17 AM",
        scanDuration: "3.4s",
        fileSize: "2,841 entries",
        directDeps: 64,
        indirectDeps: 760,
        vulnerabilities: { critical: 1, high: 3, medium: 0, low: 2 },
        malware: 2,
        licenses: { compliant: 812, nonCompliant: 2, unknown: 10 },
        status: "failing",
      },
      {
        id: "cairo-api",
        name: "cairo-api",
        version: "1.8.3",
        lastScanned: "Feb 9, 2026, 9:45 AM",
        scanDuration: "2.1s",
        fileSize: "1,204 entries",
        directDeps: 38,
        indirectDeps: 312,
        vulnerabilities: { critical: 0, high: 1, medium: 2, low: 5 },
        malware: 0,
        licenses: { compliant: 345, nonCompliant: 0, unknown: 5 },
        status: "warning",
      },
      {
        id: "cairo-infra",
        name: "cairo-infra",
        version: "0.9.1",
        lastScanned: "Feb 8, 2026, 4:32 PM",
        scanDuration: "1.8s",
        fileSize: "487 entries",
        directDeps: 12,
        indirectDeps: 89,
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        malware: 0,
        licenses: { compliant: 101, nonCompliant: 0, unknown: 0 },
        status: "passing",
      },
    ],
  },
  {
    name: "DEEPVIEW",
    projects: [
      {
        id: "dv-api-gw",
        name: "deepview-api-gateway",
        version: "3.2.0",
        lastScanned: "Feb 9, 2026, 8:00 AM",
        scanDuration: "4.2s",
        fileSize: "3,490 entries",
        directDeps: 37,
        indirectDeps: 433,
        vulnerabilities: { critical: 3, high: 3, medium: 0, low: 1 },
        malware: 1,
        licenses: { compliant: 460, nonCompliant: 1, unknown: 9 },
        status: "failing",
      },
      {
        id: "dv-worker",
        name: "deepview-worker",
        version: "1.1.7",
        lastScanned: "Feb 8, 2026, 11:22 PM",
        scanDuration: "2.9s",
        fileSize: "1,872 entries",
        directDeps: 29,
        indirectDeps: 210,
        vulnerabilities: { critical: 0, high: 0, medium: 1, low: 3 },
        malware: 0,
        licenses: { compliant: 236, nonCompliant: 0, unknown: 3 },
        status: "passing",
      },
    ],
  },
  {
    name: "PLATFORM",
    projects: [
      {
        id: "plat-auth",
        name: "platform-auth-service",
        version: "2.0.4",
        lastScanned: "Feb 9, 2026, 7:15 AM",
        scanDuration: "1.5s",
        fileSize: "952 entries",
        directDeps: 22,
        indirectDeps: 178,
        vulnerabilities: { critical: 2, high: 5, medium: 1, low: 0 },
        malware: 3,
        licenses: { compliant: 195, nonCompliant: 3, unknown: 2 },
        status: "failing",
      },
      {
        id: "plat-ui",
        name: "platform-ui",
        version: "4.7.1",
        lastScanned: "Feb 9, 2026, 10:02 AM",
        scanDuration: "5.1s",
        fileSize: "4,210 entries",
        directDeps: 87,
        indirectDeps: 1024,
        vulnerabilities: { critical: 0, high: 2, medium: 4, low: 8 },
        malware: 0,
        licenses: { compliant: 1098, nonCompliant: 1, unknown: 12 },
        status: "warning",
      },
    ],
  },
];

/** Flat lookup for project by ID */
export function findProjectById(id) {
  for (const g of projectGroups) {
    const p = g.projects.find((proj) => proj.id === id);
    if (p) return { project: p, group: g.name };
  }
  return null;
}

/** Mock dependency list keyed by project ID */
export const projectDependencies = {
  "cairo-fe": [
    { name: "lodash", installedVersion: "4.17.20", latestVersion: "4.17.21", isDirect: true, license: "MIT", licenseCompliant: true, cves: [{ id: "CVE-2021-23337", severity: "critical", score: 9.8, fixVersion: "4.17.21", published: "2021-02-15" }] },
    { name: "axios", installedVersion: "0.21.1", latestVersion: "1.7.2", isDirect: true, license: "MIT", licenseCompliant: true, cves: [{ id: "CVE-2023-45857", severity: "high", score: 7.5, fixVersion: "1.6.0", published: "2023-11-08" }] },
    { name: "express", installedVersion: "4.17.1", latestVersion: "4.21.0", isDirect: true, license: "MIT", licenseCompliant: true, cves: [{ id: "CVE-2024-29041", severity: "high", score: 7.1, fixVersion: "4.19.2", published: "2024-03-25" }] },
    { name: "json5", installedVersion: "1.0.1", latestVersion: "2.2.3", isDirect: false, license: "MIT", licenseCompliant: true, cves: [{ id: "CVE-2022-46175", severity: "high", score: 7.1, fixVersion: "1.0.2", published: "2022-12-24" }] },
    { name: "react", installedVersion: "18.3.1", latestVersion: "18.3.1", isDirect: true, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "react-dom", installedVersion: "18.3.1", latestVersion: "18.3.1", isDirect: true, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "typescript", installedVersion: "5.6.2", latestVersion: "5.6.2", isDirect: true, license: "Apache-2.0", licenseCompliant: true, cves: [] },
    { name: "@mui/material", installedVersion: "7.3.7", latestVersion: "7.3.7", isDirect: true, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "semver", installedVersion: "7.5.3", latestVersion: "7.6.3", isDirect: false, license: "ISC", licenseCompliant: true, cves: [{ id: "CVE-2022-25883", severity: "low", score: 3.7, fixVersion: "7.5.4", published: "2022-06-20" }] },
    { name: "postcss", installedVersion: "8.4.31", latestVersion: "8.4.47", isDirect: false, license: "MIT", licenseCompliant: true, cves: [{ id: "CVE-2023-44270", severity: "low", score: 3.1, fixVersion: "8.4.32", published: "2023-09-29" }] },
    { name: "minimatch", installedVersion: "3.0.4", latestVersion: "9.0.5", isDirect: false, license: "ISC", licenseCompliant: true, cves: [] },
    { name: "debug", installedVersion: "4.3.4", latestVersion: "4.3.7", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "chalk", installedVersion: "4.1.2", latestVersion: "5.3.0", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "glob", installedVersion: "7.2.3", latestVersion: "11.0.0", isDirect: false, license: "ISC", licenseCompliant: true, cves: [] },
    { name: "node-fetch", installedVersion: "2.6.7", latestVersion: "3.3.2", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "ws", installedVersion: "8.13.0", latestVersion: "8.18.0", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "nanoid", installedVersion: "3.3.6", latestVersion: "5.0.7", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "css-what", installedVersion: "6.1.0", latestVersion: "6.1.0", isDirect: false, license: "BSD-2-Clause", licenseCompliant: true, cves: [] },
    { name: "color-convert", installedVersion: "2.0.1", latestVersion: "2.0.1", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "ssri", installedVersion: "10.0.4", latestVersion: "10.0.6", isDirect: false, license: "ISC", licenseCompliant: true, cves: [] },
    { name: "crypto-js", installedVersion: "4.1.1", latestVersion: "4.2.0", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "pac-resolver", installedVersion: "5.0.0", latestVersion: "7.0.1", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
    { name: "ua-parser-js", installedVersion: "0.7.32", latestVersion: "1.0.38", isDirect: false, license: "AGPL-3.0", licenseCompliant: false, cves: [] },
    { name: "jsdom", installedVersion: "20.0.3", latestVersion: "25.0.0", isDirect: false, license: "MIT", licenseCompliant: true, cves: [] },
  ],
};

export const summaryStats = {
  totalProjects: 7,
  totalVulnerabilities: 47,
  criticalCount: 6,
  outdatedDeps: 23,
  licenseIssues: 7,
};
