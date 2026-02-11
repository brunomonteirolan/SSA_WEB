import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import * as yup from "yup";

import { api } from "../../../utils/api/externalApi";
import { validate } from "../../../utils/api/middleware";
import { SupportedApps, supportedApps } from "../../../utils/supportedApps";

const bodySchema = yup.object({
  name: yup.string().trim().required(),
  version: yup.string().trim().required(),
  app: yup.string().oneOf(Object.keys(supportedApps)).required(),
  url: yup.string().url().trim().required(),
  releaseDate: yup
    .string()
    .matches(/\d{4}\-\d{2}\-\d{2}/, "Invalid date format")
    .trim()
    .required(),
});

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.status(403).json({ message: "You must be authenticated to view this content" });

  if (req.method === "POST") {
    try {
      const { data } = await api.post("/appVersions", req.body);
      return res.json(data);
    } catch (err: any) {
      return res
        .status(err.response?.status || 500)
        .json({ message: err.response?.data?.message || err.message });
    }
  } else if (req.method === "GET") {
    try {
      const { app } = req.query as { app?: SupportedApps };
      const { data } = await api.get(`/appVersions${app ? "?app=" + app : ""}`, req.body);
      return res.json(data);
    } catch (err: any) {
      return res
        .status(err.response?.status || 500)
        .json({ message: err.response?.data?.message || err.message });
    }
  }
};

export default validate(handler, bodySchema, "body");
