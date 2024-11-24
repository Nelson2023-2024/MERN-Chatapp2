//@ts-ignore
//@ts-nocheck
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      res.status(401).json({ message: "Unauthorized - not token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECTET);

    if (!decoded)
      req.status(401).json({ message: "Unauthorized - Invalid Token" });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) res.ststus(404).json({ mesage: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
