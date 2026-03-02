// User Schema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: { type: String, maxlength: 30 },
  avatar: String,
  firstname: { type: String, maxlength: 30 },
  lastname: { type: String, maxlength: 30 },
  address: String,
  jobs: String,
  another: String,
  dayofbirth: String,
  contact: {
    github: String,
    linkedin: String,
    telegram: String,
    youtube: String,
    line: String,
    wechat: String,
    facebook: String,
    zalo: String,
    teams: String,
  },
  setting: {
    backgroundcolor: { type: String, default: "#f8fafc" },
    primarycolor: { type: String, default: "#1e3a8a" },
    secondarycolor: { type: String, default: "#fbbf24" },
  },
  cvs: [
    {
      filename: String,
      originalname: String,
      path: String,
      uploadedAt: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: false },
    },
  ],
  activeCV: String, // link nhanh để frontend dùng
});

const User = mongoose.model("User", userSchema);
export default User;
