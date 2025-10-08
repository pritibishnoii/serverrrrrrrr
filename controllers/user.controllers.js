/** @format */

import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
dotenv.config();

const generatedToken = (res, user) => {
  // 1. JWT token creat..
  const token = jwt.sign(
    { _id: user._id }, // Payload: user ki ID store ki
    process.env.JWT_SECRET,
    { expiresIn: "5y" }
  );

  // 2. Token ko cookie me store kiya
  res.cookie("token", token, {
    httpOnly: true, // JavaScript se access nahi hoga (XSS attack se bachav)
    secure: true, // HTTPS me hi chalega (production me)
    sameSite: "strict", // CSRF attack se bachav
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
  });
  return token;
};
export const registerUser = async (req, res) => {
  console.log("Register user...", req.body);

  try {
    const { username, email, password } = req.body;
    console.log("register route hitttttt");
    if (!username)
      return res.status(422).json({ message: "Username is required!" });
    if (!password)
      return res.status(422).json({ message: "Password is required!" });
    if (!email) return res.status(422).json({ message: "Email is required!" });

    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({
        message: "User already exist !!",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const userData = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const user = await userData.save();

    generatedToken(res, user);
    // console.log("token --->", token);

    const { password: pass, ...rest } = user._doc;
    return res.status(200).json({
      success: true,
      message: `${user.username} you registered successfully`,
      user: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error with Registration😐`,
    });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login...........", req.body);
  try {
    console.log("login route hitttttt");
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: `Email is required .` });
    if (!password)
      return res.status(400).json({ message: `Password is required .` });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(500)
        .json({ message: "User Not Found with this Email" });

    const isMatchPassword = await bcryptjs.compare(password, user.password);
    if (!isMatchPassword)
      return res.status(400).json({ message: "Password doesn't match" });

    const token = generatedToken(res, user);
    const { password: pass, ...rest } = user._doc;
    return res.status(200).json({
      success: true,
      message: `${user.username} you logedIn successfully🎈`,
      user: rest,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error with Login😐😐`,
    });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: `Loged out successfully` });
};

export const getUserProfile = async (req, res) => {
  try {
    console.log("get user profile route hitttttt");
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "user not found" });

    res.status(200).json({
      message: "user fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `profile not found`,
    });
  }
};

export const getProfileById = async (req, res) => {
  console.log("profile", req.body);
  try {
    console.log("profile by id route hitttttt");
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "user not found" });

    res.status(200).json({
      message: "",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something wrong with get user by id`,
    });
  }
};

export const updateProfile = async (req, res) => {
  console.log("update profile ", req.body);
  try {
    console.log("update profile route hitttttt");
    const userId = req.user._id;

    const { name, username, email, phone, bio } = req.body;
    // Find user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // 1  way to update without mongoose method findbyidAndUodate
    // Update fields conditionally
    // if (name) user.name = name;
    // if (email) user.email = email;
    // if (username) user.username = username;
    // if (bio) user.bio = bio;
    // if (phone) user.phone = phone;

    // await user.save();

    // Remove password before sending
    // user.password = undefined;

    // const updatedData = {};
    // if (name) updatedData.name = name;
    // if (email) updatedData.email = email;
    // if (username) updatedData.username;
    // if (bio) updatedData.bio = bio;
    // if (phone) updatedData.phone = phone;

    // Only pick fields that are defined
    const allowedFields = { name, username, email, phone, bio };
    const updatedData = Object.keys(allowedFields).reduce((acc, key) => {
      if (allowedFields[key] !== undefined && allowedFields[key] !== null) {
        acc[key] = allowedFields[key];
      }
      return acc;
    }, {});
    // updateOne()method  (No Return Document)    ---- count
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData }, //update user dats
      {
        new: true,
      }
    ).select("-password"); //not includ password filed

    res.status(200).json({
      message: "user profile updated ",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something wrong with update profile`,
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    console.log("profile image  route hitttttt");
    console.log("req.file--->", req.file);
    const userId = req.user._id;
    const profileImage = req.file?.path;
    const profileImagePublicId = req.file?.filename || req.file?.public_id;

    if (!profileImage || !profileImagePublicId) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password");
    //  Delete previous image from Cloudinary if exists
    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    //  Update new image details
    user.profileImage = profileImage;
    user.profileImagePublicId = profileImagePublicId;
    await user.save();
    return res.status(200).json({
      message: "user profile updated successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something wrong with update profile`,
    });
  }
};
