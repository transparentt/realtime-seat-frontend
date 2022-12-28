import * as r from "rethinkdb";
import { migrationV1 } from "./migrationV1";

r.connect({ host: "localhost", port: 28015 }, (err, conn) => {
  if (err) throw err;
  migrationV1(conn);
});
