// User Routes
import User from "../models/User.js";
import { BASE_URL } from "../server.js";
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User(req.body);
    } else {
      Object.assign(user, req.body);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findOne();
    if (user) {
      user.avatar = `${BASE_URL}/uploads/${req.file.filename}`;
      await user.save();
      res.json({ avatar: user.avatar });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getUserInfo, updateUser, uploadAvatar };
