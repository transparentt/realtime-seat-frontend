// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Health = {
  health: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Health>
) {
  res.status(200).json({ health: "ok" });
}
