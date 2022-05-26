import { MongoClient } from "mongodb";

export const mongoConnect = async () =>
  await MongoClient.connect(process.env.MONGO_SERVER);
