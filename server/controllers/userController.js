import User from "../models/User.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImgUrl: req.file.path },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImgUrl: updatedUser.profileImgUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed", error: err.message });
  }
};
