export default async function handler(req, res) {
  if (res.socket.server.io) {
    const socket = res.socket.server.io;
  }

  res.end();
}
