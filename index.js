/** @format */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/index.js";
import userRouter from "./routes/user.routes.js";
// import messageRouter from "./routes/message.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routers
app.use("/user", userRouter);
// app.use("/message", messageRouter);

//Database connection + start server
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
