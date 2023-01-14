import * as r from "rethinkdb";
import { ulid } from "ulid";
import { dbName, cafeStatusPath } from "./constant";
import { z } from "zod";

const TableZod = z.object({
  tableName: z.string(),
  empty: z.union([z.boolean(), z.string()]),
  startTime: z.optional(z.date()),
});
type Table = z.infer<typeof TableZod>;

const ReservedPersonStatusZod = z.object({
  reservedTime: z.optional(z.date()),
  enter: z.boolean(),
});
type ReservedPersonStatus = z.infer<typeof ReservedPersonStatusZod>;

const ReservedPersonZod = z.record(z.string().min(1), ReservedPersonStatusZod);
type ReservedPerson = z.infer<typeof ReservedPersonZod>;

const ReservedZod = z.object({
  reservedPerson: ReservedPersonZod,
  waitingMinutes: z.optional(z.number()),
});
type Reserved = z.infer<typeof ReservedZod>;

const CafeStatusZod = z.object({
  id: z.optional(z.string()),
  cafeID: z.string(),
  tables: z.array(TableZod),
  reserved: z.optional(ReservedZod),
});
type CafeStatus = z.infer<typeof CafeStatusZod>;

const newCafeStatus = (cafeID: string): CafeStatus => {
  const cafeStatus: CafeStatus = {
    id: ulid(),
    cafeID: cafeID,
    tables: [],
  };
  return cafeStatus;
};

// Create a cafeStatus if there is not already existing CafeStatus matching with the CafeID.
const createCafeStatus = async (conn: r.Connection, cafeStatus: CafeStatus) => {
  const cursor = await getCafeStatusByCafeID(conn, cafeStatus.cafeID);
  const existing = await cursor.toArray();
  if (existing.length > 0) {
    return null;
  } else {
    return r.db(dbName).table(cafeStatusPath).insert(cafeStatus).run(conn);
  }
};

const updateCafeStatus = (conn: r.Connection, cafeStatus: CafeStatus) => {
  if (cafeStatus.id) {
    return r
      .db(dbName)
      .table(cafeStatusPath)
      .get(cafeStatus.id)
      .update(cafeStatus)
      .run(conn);
  }
};

const deleteCafeStatus = (conn: r.Connection, ulid: string) => {
  return r.db(dbName).table(cafeStatusPath).get(ulid).delete().run(conn);
};

const getCafeStatusByULID = (conn: r.Connection, ulid: string) => {
  return r.db(dbName).table(cafeStatusPath).get<CafeStatus>(ulid).run(conn);
};

const getCafeStatusByCafeID = (conn: r.Connection, cafeID: string) => {
  return r
    .db(dbName)
    .table(cafeStatusPath)
    .filter(r.row("cafeID").eq(cafeID))
    .run(conn);
};

const getAllCafeStatuses = (conn: r.Connection) => {
  return r
    .db(dbName)
    .table(cafeStatusPath)
    .filter(() => {
      return true;
    })
    .run(conn);
};

export {
  newCafeStatus,
  createCafeStatus,
  getCafeStatusByULID,
  getAllCafeStatuses,
  updateCafeStatus,
  deleteCafeStatus,
  CafeStatusZod,
};
export type {
  CafeStatus,
  Reserved,
  ReservedPerson,
  ReservedPersonStatus,
  Table,
};
