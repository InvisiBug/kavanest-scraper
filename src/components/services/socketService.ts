import { createServer } from "http";
import { Server } from "socket.io";

export const startSocket = () => {
  const socketServer = createServer();

  const io = new Server(socketServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  socketServer.listen(3100);

  io.on("connection", () => {
    console.log("Client connected");
  });

  console.log("📡  Socket server started");

  return io;
};
