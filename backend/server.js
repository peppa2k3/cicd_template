// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// app.use(cors(corsOptions));
// Kết nối tới MongoDB
console.log("MONGO_URI env :", process.env.MONGODB_URI);
// mongoose.connect("mongodb://root:root@mongo:27017/?authSource=admin", {
//   dbName: "viesocial",
// });
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: "viesocial",
//   })
//   .then(() => console.log("✅ Connected to MongoDB x"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
async function ConnectDB() {
  try {
    await mongoose
      .connect(
        process.env.MONGODB_URI ||
          "mongodb://localhost:27017?authSource=admin/portfolio",
      )
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => console.error("MongoDB connection error:", error));
  } catch (err) {
    console.log("error:", err);
  }
}
ConnectDB();
// MongoDB Connection
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
// );

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Initialize Admin (run once)
const initAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("1234", 10);
      await Admin.create({ username: "admin", password: hashedPassword });
      console.log("Default admin created: admin/password");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

// Routes
app.use("/api/user", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/auth", authRouter);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initAdmin();
});
const BASE_URL = process.env.BASE_URL
export {BASE_URL}