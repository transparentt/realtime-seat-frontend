const dbName = "realtime-seat";
const userPath = "user_v1";
const cafePath = "cafe_v1";
const cafeStatusPath = "status_v1";

enum AvailableSNS {
  Twitter = "twitter",
}

enum Role {
  Root = "root",
  Admin = "admin",
  User = "user",
}

export { dbName, userPath, cafePath, cafeStatusPath, Role, AvailableSNS };
