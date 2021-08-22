import { MongoClient } from "mongodb";
import { ENV_VARIABLES } from "../utils/env";
import { Database, User } from "./dbTypes";

export const connectToDB = async (): Promise<Database> => {
  if (!ENV_VARIABLES.MONGO_URL) {
    throw new Error("database url is not defined");
  }
  const client = new MongoClient(ENV_VARIABLES.MONGO_URL);
  await client.connect();
  const db = client.db(ENV_VARIABLES.MONGO_DB);

  return {
    users: db.collection("users"),
    bookings: db.collection("bookins"),
    listings: db.collection("listings"),
  };
};
