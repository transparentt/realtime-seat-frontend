import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../../../rethinkdb/logic/permission";
import { getUserByULID, deleteUser } from "../../../../rethinkdb/logic/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getUserHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteUserHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const getUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const user = await getUserByULID(conn, ulid);
    res.status(200).json(user);
  }
};

const deleteUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ulid } = req.query;
  const conn = await getConnectAdmin();
  if (typeof ulid == "string") {
    const result = await deleteUser(conn, ulid);
    res
      .status(200)
      .json({
        message: "Deleted the user matching given ULID.",
        ulid: ulid,
        success: true,
      });
  }
};
