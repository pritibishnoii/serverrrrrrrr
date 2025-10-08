/** @format */
import express from "express";
import {
  getMessages,
  getUsersForChatting,
  sendMessage,
} from "../controllers/message.controllers.js";
import { auth } from "../middleware/auth.js";
import uploadToCloudinary from "../middleware/cloudinaryUpload.js";

const messageRouter = express.Router();

messageRouter.post("/users", auth, getUsersForChatting);
messageRouter.post("/:id", auth, getMessages);

messageRouter.post(
  "/send/:reciverId",
  auth,
  uploadToCloudinary.single("media"),
  sendMessage
);

export default messageRouter;
