/** @format */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/index.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Cookies:", req.cookies);
  next();
});
app.get("/", () => {
  res.send("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
});
// Routers
app.use("/user", userRouter);
app.use("/message", messageRouter);

//Database connection + start server
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
