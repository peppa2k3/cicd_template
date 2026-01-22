// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config();

const app = express();

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

// User Schema
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
});

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    ownerid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    type: String,
    images: {
      image1: String,
      image2: String,
      image3: String,
      image4: String,
    },
    source: String,
    deployed: String,
    duration: {
      start: String,
      end: String,
    },
    maindesc: { type: String, maxlength: 300 },
    subdesc: [
      {
        desc: { type: String, maxlength: 300 },
        content: String,
      },
    ],
    another: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);
const Admin = mongoose.model("Admin", adminSchema);

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Initialize Admin (run once)
const initAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("password", 10);
      await Admin.create({ username: "admin", password: hashedPassword });
      console.log("Default admin created: admin/password");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};

// Routes

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
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
});

// User Routes
app.get("/api/user", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/user", authenticateToken, async (req, res) => {
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
});

app.post(
  "/api/user/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findOne();
      if (user) {
        user.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
        await user.save();
        res.json({ avatar: user.avatar });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Project Routes
app.get("/api/projects", async (req, res) => {
  try {
    const { featured, limit } = req.query;
    let query = {};

    if (featured === "true") {
      query.featured = true;
    }

    let projects = Project.find(query).sort({ createdAt: -1 });

    if (limit) {
      projects = projects.limit(parseInt(limit));
    }

    const result = await projects;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/projects", authenticateToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post(
  "/api/projects/:id/images",
  authenticateToken,
  upload.array("images", 4),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      req.files.forEach((file, index) => {
        const key = `image${index + 1}`;
        project.images[key] = `/uploads/${file.filename}`;
      });

      await project.save();
      res.json({ images: project.images });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initAdmin();
});
