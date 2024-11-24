import { configDotenv } from "dotenv";
import express from "express";
import { authRoutes } from "../routes/auth.route.js";
configDotenv()

const app = express();
const PORT = process.env.PORT || 8000

app.use('/api/auth', authRoutes)

app.listen(PORT, () =>{
    console.log(`Server is runing on http://localhost${PORT}`)
})