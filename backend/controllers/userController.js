// User Routes
import User from "../models/User.js";
import { BASE_URL } from "../server.js";
//cv lib
import path from "path";
import fs from "fs";

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

///CV manager
export const uploadCV = async (req, res) => {
  try {
    const user = await User.findOne(); // chỉ 1 user admin
    if (!user) return res.status(404).json({ message: "User not found" });

    const newCV = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `c/uploads/${req.file.filename}`,
      isActive: user.cvs.length === 0, // CV đầu tiên tự động active
    };

    user.cvs.push(newCV);
    if (newCV.isActive) user.activeCV = newCV.path;

    await user.save();
    res.json({ cvs: user.cvs, activeCV: user.activeCV });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const setActiveCV = async (req, res) => {
  const { filename } = req.body;
  const user = await User.findOne();
  user.cvs.forEach((cv) => {
    cv.isActive = cv.filename === filename;
  });
  user.activeCV = `${BASE_URL}/uploads/${filename}`;
  await user.save();
  res.json({ cvs: user.cvs, activeCV: user.activeCV });
};

export const deleteCV = async (req, res) => {
  const { filename } = req.params;
  const user = await User.findOne();

  const cvToDelete = user.cvs.find((cv) => cv.filename === filename);
  if (cvToDelete) {
    const filePath = path.join(process.cwd(), "uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    user.cvs = user.cvs.filter((cv) => cv.filename !== filename);
    if (cvToDelete.isActive && user.cvs.length > 0) {
      user.cvs[0].isActive = true;
      user.activeCV = user.cvs[0].path;
    } else if (user.cvs.length === 0) {
      user.activeCV = null;
    }
  }

  await user.save();
  res.json({ cvs: user.cvs, activeCV: user.activeCV });
};
export { getUserInfo, updateUser, uploadAvatar };
