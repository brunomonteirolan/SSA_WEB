import { NextApiHandler } from "next";
import { Schema } from "yup";

type Validate = (
  handler: NextApiHandler,
  schema: Schema,
  property: "body" | "query",
  options?: {
    skipMethods: string[];
  }
) => NextApiHandler;

export const validate: Validate = (
  handler,
  schema,
  property,
  options = { skipMethods: ["GET", "DELETE"] }
): NextApiHandler => async (req, res) => {
  try {
    if (!options.skipMethods.includes(req.method ?? ""))
      req[property] = await schema.validate(req[property]);

    return handler(req, res);
  } catch (err: any) {
    res.status(400).send({ message: err.message });
  }
};
