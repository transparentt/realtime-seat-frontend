import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../../../rethinkdb/logic/permission";
import {
  newCafeStatus,
  createCafeStatus,
  CafeStatusZod,
  getCafeStatusByULID,
  getAllCafeStatuses,
  updateCafeStatus,
} from "../../../../rethinkdb/logic/status";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getAllCafeStatusHandler(req, res);
  } else if (req.method === "POST") {
    await createCafeStatusHandler(req, res);
  } else if (req.method === "PUT") {
    await updateCafeStatusHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const createCafeStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Validate request with Zod
  try {
    CafeStatusZod.pick({ cafeID: true }).parse(req.body);
  } catch (e) {
    const failed = CafeStatusZod.pick({ cafeID: true }).safeParse(req.body);
    res.status(400).json(failed);
    return;
  }

  const parsed = CafeStatusZod.pick({ cafeID: true }).parse(req.body);
  const cafeStatus = newCafeStatus(parsed.cafeID);

  const conn = await getConnectAdmin();
  const result = await createCafeStatus(conn, cafeStatus);

  if (result && cafeStatus.id !== undefined) {
    const created = await getCafeStatusByULID(conn, cafeStatus.id);
    created ? res.status(200).json(created) : res.status(403);
  } else if (!result) {
    res.status(400).json({
      message: `There has been already the existing cafeStatus with ${parsed.cafeID}`,
      success: false,
    });
  } else {
    res.status(400).json({
      message: "Failed to create a cafeStatus.",
      success: false,
    });
  }
};

const getAllCafeStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const conn = await getConnectAdmin();
  const cursor = await getAllCafeStatuses(conn);
  const cafeStatuses = await cursor.toArray();
  console.log(cafeStatuses);
  if (cafeStatuses.length > 0) {
    res.status(200).json({ cafeStatuses: cafeStatuses });
  } else {
    res.status(404).json({
      message: "Not found.",
      success: false,
    });
  }
};

const updateCafeStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Validate request with Zod
  try {
    CafeStatusZod.parse(req.body);
  } catch (e) {
    const failed = CafeStatusZod.safeParse(req.body);
    res.status(400).json(failed);
    return;
  }
  const parsed = CafeStatusZod.parse(req.body);

  const conn = await getConnectAdmin();
  const result = await updateCafeStatus(conn, parsed);

  if (result && parsed.id !== undefined) {
    const updated = await getCafeStatusByULID(conn, parsed.id);
    updated ? res.status(200).json(updated) : res.status(403);
  } else {
    res.status(400).json({
      message: "Failed to update the cafeStatus.",
      success: false,
    });
  }
};
