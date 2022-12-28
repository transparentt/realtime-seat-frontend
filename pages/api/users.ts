import type { NextApiRequest, NextApiResponse } from "next";
import { getConnectAdmin } from "../../rethinkdb/logic/permission";
import {
  newUser,
  createUser,
  UserZod,
  getUserByULID,
  getAllUsers,
} from "../../rethinkdb/logic/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getAllUserHandler(req, res);
  } else if (req.method === "POST") {
    await createUserHandler(req, res);
  } else if (req.method === "PUT") {
    await updateUserHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteUserHandler(req, res);
  } else {
    res.status(405).json({
      message: `${req.method}: Unavailable method.`,
      success: false,
    });
  }
}

const createUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate request with Zod
  try {
    UserZod.parse(req.body);
  } catch (e) {
    const failed = UserZod.safeParse(req.body);
    res.status(400).json(failed);
  }

  const parsed = UserZod.parse(req.body);
  const user = newUser(
    parsed.name,
    parsed.snsID,
    parsed.sns,
    parsed.role,
    parsed.accessToken,
    parsed.refreshToken
  );

  const conn = await getConnectAdmin();
  const created = await createUser(conn, user);

  if (user.id && created) {
    const created = await getUserByULID(conn, user.id);
    created ? res.status(200).json(created) : res.status(403);
  } else if (!created) {
    res.status(400).json({
      message: `There has been already the existing user with ${parsed.snsID} at ${parsed.sns}`,
      success: false,
    });
  } else {
    res.status(400).json({
      message: "Failed to create a user.",
      success: false,
    });
  }
};

const getAllUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const conn = await getConnectAdmin();
  const cursor = await getAllUsers(conn);
  const users = await cursor.toArray();
  console.log(users);
  if (users.length > 0) {
    res.status(200).json({ users: users });
  } else {
    res.status(404).json({
      message: "Not found.",
      success: false,
    });
  }
};

const updateUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(400).json({
    message: `${req.method}: not implemented!`,
    success: false,
  });
};

const deleteUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(400).json({
    message: `${req.method}: not implemented!`,
    success: false,
  });
};
