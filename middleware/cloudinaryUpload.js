/** @format */

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.startsWith("video") ? "video" : "image";
    return {
      folder: "chat_app",
      resource_type: fileType,
      public_id: Date.now().toString(),
    };
  },
});

const uploadToCloudinary = multer({ storage });
export default uploadToCloudinary;
