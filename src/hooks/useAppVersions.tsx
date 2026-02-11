import useSWR from "swr";
import { AppVersion } from "../@types/appVersion";
import { fetcher } from "../utils/fetcher";
import { SupportedApps } from "../utils/supportedApps";

type UseAppVersions = <T extends SupportedApps | null>(
  app: T
) => {
  data?: { versions: AppVersion[] };
  isLoading: boolean;
  error: string;
  mutate: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
};

const useAppVersions: UseAppVersions = (app) => {
  const url = `/appVersions${app ? "?app=" + app : ""}`;
  const { data, error, mutate } = useSWR(url, fetcher);

  return { data, isLoading: !error && !data, error, mutate };
};

export default useAppVersions;
