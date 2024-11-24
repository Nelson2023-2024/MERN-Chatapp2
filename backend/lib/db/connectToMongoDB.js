import mongoose from "mongoose";

export async function connectToMongoDB(params) {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB`, error.message);
  }
}
