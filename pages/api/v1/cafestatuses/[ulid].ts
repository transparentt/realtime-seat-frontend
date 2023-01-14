import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../../../rethinkdb/logic/permission";
import {
  getCafeStatusByULID,
  deleteCafeStatus,
} from "../../../../rethinkdb/logic/status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getCafeStatusHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteCafeStatusHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const getCafeStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const cafeStatus = await getCafeStatusByULID(conn, ulid);
    res.status(200).json(cafeStatus);
  }
};

const deleteCafeStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const result = await deleteCafeStatus(conn, ulid);
    res.status(200).json({
      message: "Deleted the cafeStatus matching given ULID.",
      ulid: ulid,
      success: true,
    });
  }
};
