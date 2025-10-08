/** @format */
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  // 1. Token dhundo - ya to cookie me ya Authorization header me
  console.log("req.cookie-->", req.cookies);
  console.log("req.headers-->", req.headers);
  console.log("Authorization-->", req.headers.authorization);
  const token =
    req.cookies.token || req.headers("Authorization")?.split(" ")[1];

  // 2. Agar token nahi mila to reject karo
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 3. Token verify karo - valid hai ya fake?
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decode);

  // 4. User ko database se dhundo
  const user = await User.findById(decode._id);
  console.log(user);

  // 5. Request me user add kar do (next routes ke liye)
  req.user = user;

  // 6. Aage badh jao (next route pe)
  next();
};
