import * as r from "rethinkdb";
import { ulid } from "ulid";
import { dbName, cafePath } from "./constant";
import { z } from "zod";

const CafeZod = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  tableNum: z.number(),
  note: z.optional(z.string()),
});
type Cafe = z.infer<typeof CafeZod>;

const newCafe = (
  name: string,
  address: string,
  access: string,
  tableNum: number,
  note?: string
): Cafe => {
  const cafe: Cafe = {
    id: ulid(),
    name: name,
    address: address,
    access: access,
    tableNum: tableNum,
    note: note,
  };

  return cafe;
};

const createCafe = async (conn: r.Connection, cafe: Cafe) => {
  return r.db(dbName).table(cafePath).insert(cafe).run(conn);
};

const updateCafe = (conn: r.Connection, cafe: Cafe) => {
  if (cafe.id) {
    return r.db(dbName).table(cafePath).get(cafe.id).update(cafe).run(conn);
  }
};

const deleteCafe = (conn: r.Connection, ulid: string) => {
  return r.db(dbName).table(cafePath).get(ulid).delete().run(conn);
};

const getCafeByULID = (conn: r.Connection, ulid: string) => {
  return r.db(dbName).table(cafePath).get<Cafe>(ulid).run(conn);
};

const getAllCafes = (conn: r.Connection) => {
  return r
    .db(dbName)
    .table(cafePath)
    .filter(() => {
      return true;
    })
    .run(conn);
};

export {
  newCafe,
  createCafe,
  getCafeByULID,
  getAllCafes,
  updateCafe,
  deleteCafe,
  CafeZod,
};
export type { Cafe };
