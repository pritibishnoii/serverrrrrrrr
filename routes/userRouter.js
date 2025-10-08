/** @format */

import express from "express";
import {
  registerUser,
  loginUser,
  // logoutUser,
  // getProfileById,
  // updateProfile,
  // updateProfileImage,
  getUserProfile,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
// import uploadToCloudinary from "../middleware/cloudinaryUpload.js";

// dekh rhe ho  ??
const userRouter = express.Router();

userRouter.get("/health", (req, res) => {
  res.send("hello");
  console.log(res);
});
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", auth, getUserProfile);
// userRouter.get("/logout", auth, logoutUser);
// userRouter.get("/:id", auth, getProfileById);
// userRouter.put("/update", auth, updateProfile);
// userRouter.post(
//   "/update",
//   auth,
//   uploadToCloudinary.single("profileImage"),
//   updateProfileImage
// );

export default userRouter;
