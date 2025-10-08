/** @format */

import Message from "../models/Message.model.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const text = req.body.text;
    const userId = req.user._id; //from token
    const reciverId = req.params.recieverId;
    let mediaUrl = null; //video/image url
    let mediaUrlPublicId = null; //video/image url
    let mediaType = null; // [video,image]

    if (req.file) {
      mediaUrl = req.file.path; //cloudinary url
      mediaUrlPublicId = req.file.filename; //public id genrated
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image"; //
    }

    const newMessage = new Message({
      senderId: userId,
      reciverId, //   sm-> reciverId: reciverId,
      text,
      mediaUrl,
      mediaType,
      mediaUrlPublicId,
    });
    await newMessage.save();
    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error while sending message " + error,
    });
  }
};

export const getUsersForChatting = async (req, res) => {
  const LogedinUserId = req.user._id;
  try {
    const filterdUsers = await User.find({ _id: { $ne: LogedinUserId } }); //
    if (!filterdUsers) {
      return res.status(400).json({
        message: "user not found ",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      users: filterdUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error  " + error,
    });
  }
};

export const getMessages = async (req, res) => {
  const { id: recieverId } = req.params;
  const senderId = req.user?._id;
  try {
    const messages = await Message({
      $or: [
        { senderId: senderId, recieverId: recieverId },
        { senderId: recieverId, recieverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " error  with getting user messaages " + error,
    });
  }
};
