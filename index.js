/** @format */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/index.js";
import userRouter from "./routes/user.routes.js";
// import messageRouter from "./routes/message.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser);

app.use("/", () => {
  res.send("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
});
//Database connection + start server
const PORT = process.env.PORT || 8000;

// Routers
app.use("/user", userRouter);
// app.use("/message", messageRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
