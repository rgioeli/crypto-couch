import Pusher from "pusher";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const message = req.body;
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: "Not authorized" });

  const symbol = req.headers.referer.split("/")[4];
  if (!symbol)
    return res.status(500).json({ error: "No ticker symbol to display." });

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    useTLS: true,
  });

  const response = await pusher.trigger(symbol, "chat-event", {
    user: session.user.name,
    message,
  });

  res.json({ message: "completed" });
}
