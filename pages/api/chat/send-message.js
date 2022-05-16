import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGO_SERVER);
  const db = await (await client.connect()).db();
  const session = JSON.parse(req.headers["x-session"]);

  if (session && session.name && req.method == "POST") {
    const insertMessage = await db.collection("messages").insertOne({
      user: session.name,
      message: req.body,
    });

    return res.json({ user: session.name, message: req.body });
  }
}
