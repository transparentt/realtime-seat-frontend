import * as r from "rethinkdb";
import { ulid } from "ulid";
import { AvailableSNS, dbName, Role, userPath } from "./constant";
import { z } from "zod";

const UserZod = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  snsID: z.string(), // Twitter account is only available now.
  sns: z.nativeEnum(AvailableSNS),
  role: z.nativeEnum(Role),
  cafeID: z.array(z.string()),
  accessToken: z.string(),
  refreshToken: z.string(),
});
type User = z.infer<typeof UserZod>;

const newUser = (
  name: string,
  snsID: string,
  sns: AvailableSNS,
  role: Role,
  accessToken: string,
  refreshToken: string
): User => {
  const user: User = {
    id: ulid(),
    name: name,
    snsID: snsID,
    sns: sns,
    role: role,
    cafeID: [],
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return user;
};

// Create a user if there is no user matched with snsID in sns.
const createUser = async (conn: r.Connection, user: User) => {
  const cursor = await getUserBySnsID(conn, user.snsID, user.sns);
  const existing = await cursor.toArray();
  if (existing.length > 0) {
    return null;
  } else {
    return r.db(dbName).table(userPath).insert(user).run(conn);
  }
};

const updateUser = (conn: r.Connection, user: User) => {
  if (user.id) {
    return r.db(dbName).table(userPath).get(user.id).update(user).run(conn);
  }
};

const deleteUser = (conn: r.Connection, user: User) => {
  if (user.id) {
    return r.db(dbName).table(userPath).get(user.id).delete().run(conn);
  }
};

const getUserByULID = (conn: r.Connection, ulid: string) => {
  return r.db(dbName).table(userPath).get<User>(ulid).run(conn);
};

const getUserByAccessToken = (conn: r.Connection, accessToken: string) => {
  return r
    .db(dbName)
    .table(userPath)
    .filter(r.row("accessToken").eq(accessToken))
    .run(conn);
};

const getUserBySnsID = (
  conn: r.Connection,
  snsID: string,
  sns: AvailableSNS
) => {
  return r
    .db(dbName)
    .table(userPath)
    .filter(r.row("snsID").eq(snsID).and(r.row("sns").eq(sns)))
    .run(conn);
};

const getAllUsers = (conn: r.Connection) => {
  return r
    .db(dbName)
    .table(userPath)
    .filter(() => {
      return true;
    })
    .run(conn);
};

export {
  newUser,
  createUser,
  getUserByULID,
  getUserByAccessToken,
  getAllUsers,
  updateUser,
  deleteUser,
  UserZod,
};
export type { User };
