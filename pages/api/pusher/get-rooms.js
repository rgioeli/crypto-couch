import ServerPusher from "pusher";
import { v4 } from "uuid";

export default async function handler(req, res) {
  try {
    const pusher = new ServerPusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      useTLS: true,
    });
    const response = await pusher.get({
      path: "/channels",
      params: {
        filter_by_prefix: "presence-",
        info: "user_count",
      },
    });
    if (response.status == 200) {
      const data = await response.json();
      //create empty room data array to put how many users are in each channel
      let rooms = [];
      for (const key in data.channels) {
        const pos = key.indexOf("-");
        rooms.push({
          id: v4(),
          name: key.substring(pos + 1, key.length),
          user_count: data.channels[key].user_count,
        });
      }
      return res.status(200).json({ rooms });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
}
