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

export { io, app, server };
