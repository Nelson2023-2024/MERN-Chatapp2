import { Router } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    //hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate JWT
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email not found" });

    //if email existed
    const comparePassword = await bcryptjs.compare(password, user.password);

    if (!comparePassword)
      return res
        .status(400)
        .json({ message: "Password didn't match our records" });

    //if all the checks are passed
    await generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      prefilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Loged out successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.use(protectRoute)

router.put("/update-profile", async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in update controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export { router as authRoutes };
