import { SupportedApps } from "../utils/supportedApps";

export interface AppVersion<T = null> {
  _id: string;
  version: string;
  name: string;
  app: SupportedApps;
  url: string;
  releaseDate: string;
  versionDependencies?: Array<T extends null ? AppVersion : T>;
}
