import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../../../rethinkdb/logic/permission";
import {
  newCafe,
  createCafe,
  CafeZod,
  getCafeByULID,
  getAllCafes,
  updateCafe,
} from "../../../../rethinkdb/logic/cafe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getAllCafeHandler(req, res);
  } else if (req.method === "POST") {
    await createCafeHandler(req, res);
  } else if (req.method === "PUT") {
    await updateCafeHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const createCafeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request with Zod
  try {
    CafeZod.parse(req.body);
  } catch (e) {
    const failed = CafeZod.safeParse(req.body);
    res.status(400).json(failed);
  }

  const parsed = CafeZod.parse(req.body);
  const cafe = newCafe(
    parsed.name,
    parsed.address,
    parsed.access,
    parsed.tableNum,
    parsed.note
  );

  const conn = await getConnectAdmin();
  const result = await createCafe(conn, cafe);

  if (result && cafe.id !== undefined) {
    const created = await getCafeByULID(conn, cafe.id);
    created ? res.status(200).json(created) : res.status(403);
  } else {
    res.status(400).json({
      message: "Failed to create a cafe.",
      success: false,
    });
  }
};

const getAllCafeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const conn = await getConnectAdmin();
  const cursor = await getAllCafes(conn);
  const cafes = await cursor.toArray();
  console.log(cafes);
  if (cafes.length > 0) {
    res.status(200).json({ cafes: cafes });
  } else {
    res.status(404).json({
      message: "Not found.",
      success: false,
    });
  }
};

const updateCafeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request with Zod
  try {
    CafeZod.parse(req.body);
  } catch (e) {
    const failed = CafeZod.safeParse(req.body);
    res.status(400).json(failed);
  }
  const parsed = CafeZod.parse(req.body);

  const conn = await getConnectAdmin();
  const result = await updateCafe(conn, parsed);

  if (result && parsed.id !== undefined) {
    const updated = await getCafeByULID(conn, parsed.id);
    updated ? res.status(200).json(updated) : res.status(403);
  } else {
    res.status(400).json({
      message: "Failed to update the cafe.",
      success: false,
    });
  }
};
