import * as r from "rethinkdb";

const getConnectAdmin = () => {
  return r.connect({
    host: "localhost",
    port: 28015,
    db: "realtime-seat",
    user: "admin",
  });
};

export { getConnectAdmin };
