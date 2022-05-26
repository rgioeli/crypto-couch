import Pusher from "pusher";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      useTLS: true,
    });
    const socketId = req.body.socket_id;
    const user = { id: session.user.name.handle }; // Replace this with code to retrieve the actual user id
    const authResponse = pusher.authenticateUser(socketId, user);

    res.send(authResponse);
  }
}
