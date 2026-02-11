import useSWR, { SWRConfiguration } from "swr";
import { Client } from "../models/clientModel";
import { fetcher } from "../utils/fetcher";

type UseClients = (options?: SWRConfiguration) => {
  clients: Client[] | null;
  isLoading: boolean;
  error: any;
  mutate: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
};

const useClients: UseClients = (options) => {
  const { data, error, mutate } = useSWR<{ clients: Client[] }>("/clients", fetcher, options);

  return {
    clients: data && !error ? data.clients : null,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useClients;
