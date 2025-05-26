import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params; // Get companyId from the request parameters

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Find the emergency provider by companyId

    const user = await User.findById(userId);

    // If no provider found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send back the company details
    res.status(200).json({
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      phone: user.phone,
      latitude: user.latitude,
      longitude: user.longitude,
      password: user.password,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
