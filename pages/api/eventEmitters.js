import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGO_SERVER);
  const db = await (await client.connect()).db();

  const changeStream = db.collection("messages").watch([]);

  changeStream.on("change", (next) => {
    return res.json({ data: next.fullDocument });
  });

  res.json({ message: "I can be here ALL day bitch." });
}
