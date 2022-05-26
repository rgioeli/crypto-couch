import { MongoClient } from "mongodb";
import bcryptjs from "bcryptjs";

export const hashPassword = async (password, verifyPassword) => {
  if (!password === verifyPassword) return false;
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  return hashedPassword;
};

export default async function handler(req, res) {
  try {
    const { displayName, handle, password, verifyPassword } = req.body;
    const client = await MongoClient.connect(process.env.MONGO_SERVER);
    const db = await client.db();
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword)
      return res.status(400).json({ error: "Password don't match" });
    await db
      .collection("users")
      .insertOne({ displayName, handle, hashedPassword });

    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Something went wrong, please try again." });
  }
}
