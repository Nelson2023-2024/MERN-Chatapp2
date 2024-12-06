import { configDotenv } from "dotenv";
import cors from "cors";
import express from "express";
import cookieParse from "cookie-parser";
import { authRoutes } from "../routes/auth.route.js";
import { connectToMongoDB } from "../lib/db/connectToMongoDB.js";
import { messageRoutes } from "../routes/message.route.js";
import { app, server } from "../lib/socket.js";
configDotenv();

const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "100mb" }));
app.use(cookieParse());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
  connectToMongoDB();
});
