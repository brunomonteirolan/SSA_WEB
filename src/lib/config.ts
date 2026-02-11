export const mongo = {
  url: process.env.MONGO_URL || "mongodb://localhost:27017/myDatabase",
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:35000";

export const backend = {
  url: backendUrl,
  api: `${backendUrl}/api`,
};
