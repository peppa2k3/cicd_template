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
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    telegram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    line: { type: String, default: "" },
    wechat: { type: String, default: "" },
    facebook: { type: String, default: "" },
    zalo: { type: String, default: "" },
    teams: { type: String, default: "" },
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
