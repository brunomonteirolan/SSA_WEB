import { api } from "./api/externalApi";

export const fetcher = async (url: string) => {
  try {
    const { data } = await api.get(url);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
