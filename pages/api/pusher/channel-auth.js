import Pusher from "pusher";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    useTLS: true,
  });

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  // Primitive auth: the client self-identifies. In your production app,
  // the client should provide a proof of identity, like a session cookie.

  const authResponse = pusher.authorizeChannel(socketId, channel, {
    user_id: session.user.name.handle,
    user_info: {
      name: session.user.name,
      handle: session.user.handle,
    },
  });
  res.send(authResponse);
}
