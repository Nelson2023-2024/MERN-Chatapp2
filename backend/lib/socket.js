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

//pass userId of a user and it should return the socketId of that user
export function getReceiverSockerId(userId){
    return userSocketMap[userId]
}

//store online users
const userSocketMap = {}; //{userId: socket.id}

//listen for incomming connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  //   query.userId needs to be paseed to the client
  const userId = socket.handshake.query.userId; //handshake query allows the server to know which user is associated with a particular connection

  //if the userId existed updated the socketMap
  if (userId) userSocketMap[userId] = socket.id;
  //{"6751dde30cfef99aa67ad702": "A1B2C3D4E5F6",}

  //used to send events to all connected clients (broadcast)
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //emit the keys of the socketMap to all users

  //listen for disconnection when one disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId]; //delete the key when a user disconnects and let every on eknow
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
}); //when ever someone connects the callback runs socket parameter is the user that just connected

export { io, app, server };
