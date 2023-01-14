import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../../../rethinkdb/logic/permission";
import { getCafeByULID, deleteCafe } from "../../../../rethinkdb/logic/cafe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getCafeHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteCafeHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const getCafeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const user = await getCafeByULID(conn, ulid);
    res.status(200).json(user);
  }
};

const deleteCafeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const result = await deleteCafe(conn, ulid);
    res.status(200).json({
      message: "Deleted the cafe matching given ULID.",
      ulid: ulid,
      success: true,
    });
  }
};
