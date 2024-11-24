import { configDotenv } from "dotenv";
import express from "express";
import { authRoutes } from "../routes/auth.route.js";
import { connectToMongoDB } from "../lib/db/connectToMongoDB.js";
configDotenv()

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () =>{
    console.log(`Server is runing on http://localhost:${PORT}`)
    connectToMongoDB()
})