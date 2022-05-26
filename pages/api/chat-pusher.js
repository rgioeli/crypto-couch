import Pusher from "pusher";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const message = req.body;
  const session = await getSession({ req });
  if (!session || req.method !== "POST")
    return res.status(400).json({ error: "Not authorized" });

  //get crypto symbol from the req header-referer url
  const symbol = req.headers.referer.split("/")[4];

  if (!symbol)
    return res.status(500).json({ error: "No ticker symbol to display." });

  const reply = checkMessage(message, session.user.image);

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    useTLS: true,
  });

  const response = await pusher.trigger(`presence-${symbol}`, "chat-event", {
    user: session.user.name.username,
    handle: session.user.name.handle,
    image: session.user.image,
    message: reply.responseMsg ? reply.responseMsg : message,
    replyTo: {
      username: reply.username || null,
      message: reply.replyMsg || null,
    },
  });

  res.json({ message: "completed" });
}

const checkMessage = (message, image) => {
  if (message.includes("[reply to=") && message.includes("[/reply]")) {
    try {
      //get username from the message body
      const indexOfTo = message.indexOf("=");
      const firstSegment = message.slice(indexOfTo, message.length);
      const indexOfFirstBracket = firstSegment.indexOf("]");
      const extractTo = firstSegment.slice(0, indexOfFirstBracket);
      const username = extractTo.split("=")[1].trim();

      //get the message we're replying to
      const firstBracketIndex = message.indexOf("]") + 1;
      const getRestOfMessage = message.slice(firstBracketIndex, message.length);
      const indexOfLastReply = getRestOfMessage.indexOf("[/reply]");
      const replyMsg = getRestOfMessage.slice(0, indexOfLastReply).trim();

      //get our response message
      const getLastReplyIndex = message.lastIndexOf("[/reply]") + 8;
      const responseMsg = message
        .slice(getLastReplyIndex, message.length)
        .trim();

      console.log(username, replyMsg, responseMsg);
      return { username, responseMsg, replyMsg, image };
    } catch (err) {
      console.log(err);
      return {
        error: "There was an error sending the messag. Please try again.",
      };
    }
  }

  return message;
};
