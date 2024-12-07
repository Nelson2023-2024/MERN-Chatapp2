import { configDotenv } from "dotenv";
import cors from "cors";
import express from "express";
import cookieParse from "cookie-parser";
import { authRoutes } from "../routes/auth.route.js";
import { connectToMongoDB } from "../lib/db/connectToMongoDB.js";
import { messageRoutes } from "../routes/message.route.js";
import { app, server } from "../lib/socket.js";
configDotenv();

import path from "path";

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

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

//we are in production make the dist be our static assest
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..frontend", "dist", "indez.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
  connectToMongoDB();
});
