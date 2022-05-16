import { Server } from "socket.io";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    if (!res.socket.server.io) {
      const io = new Server(res.socket.server);
      res.socket.server.io = io;
      io.on("connection", async (socket) => {
        socket.on("send-chat-message", async (message, user) => {
          socket.broadcast.emit("recieve-chat-message", {
            message,
            name: user && user.name,
          });
        });
      });
    }
  } else {
    console.log("we don't have a user yet.");
  }
  res.end();
}
