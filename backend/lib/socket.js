import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

//socket server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], //reference our frontend to connect to the socket
  },
});

//listen for incomming connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  //listen for disconnection when one disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
}); //when ever someone connects the callback runs socket parameter is the user that just connected

export { io, app, server };
