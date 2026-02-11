export type SupportedApps = "console" | "roamer" | "tpi" | "reportCollector";

interface SupportedAppInfo {
  name: SupportedApps;
  displayName: string;
  minClientVersion: string;
}

export const supportedApps: Record<SupportedApps, SupportedAppInfo> = {
  console: { name: "console", displayName: "DCS Console", minClientVersion: "1.0.0" },
  reportCollector: {
    name: "reportCollector",
    displayName: "DCS Report Collector",
    minClientVersion: "1.3.0",
  },
  roamer: { name: "roamer", displayName: "DCS Roamer", minClientVersion: "1.2.0" },
  tpi: { name: "tpi", displayName: "DCS TPI", minClientVersion: "1.0.0" },
};

export const client = {
  version: "1.6.0",
};
