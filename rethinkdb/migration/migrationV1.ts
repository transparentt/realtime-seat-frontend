import * as r from "rethinkdb";
import { dbName, userPath, cafePath, cafeStatusPath } from "../logic/constant";

const migrationV1 = (
  conn: r.Connection,
  callback?: (conn: r.Connection) => void
) => {
  r.dbCreate(dbName).run(conn, (err, result) => {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));

    r.db(dbName)
      .tableCreate(userPath)
      .run(conn, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));

        r.db(dbName)
          .tableCreate(cafePath)
          .run(conn, (err, result) => {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));

            r.db(dbName)
              .tableCreate(cafeStatusPath)
              .run(conn, (err, result) => {
                if (err) throw err;
                console.log(JSON.stringify(result, null, 2));
              });
          });
      });
  });
};

export { migrationV1 };
