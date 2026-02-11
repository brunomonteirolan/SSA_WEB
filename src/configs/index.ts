const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const backend = {
  url: backendUrl,
  api: `${backendUrl}/api`,
};
