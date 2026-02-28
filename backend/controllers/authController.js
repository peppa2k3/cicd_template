import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
  console.log("jwt_secret is error in authController");
}

const adminAuth = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { adminAuth };
