import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { User } from "../models/user.model.js";

const router = Router();

router.use(protectRoute);
//get users for the side bar except login user
router.get("/users", async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //find all the users whose id is not equal to logged in _id
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(`Error in getusersforsidebar controller`, error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as messageRoutes };
