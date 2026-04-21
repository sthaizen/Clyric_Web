import User from "../models/User.js";

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ clerkId }).select("-__v");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// PATCH /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, nickname, description } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { name, nickname, description },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
