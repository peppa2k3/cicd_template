// Project Routes
import Project from "../models/Project.js";
import { BASE_URL } from "../server.js";

const getProjects = async (req, res) => {
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
};

const getProjectDetail = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const postProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const putProjectDetail = async (req, res) => {
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
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const postProjectImages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    req.files.forEach((file, index) => {
      const key = `image${index + 1}`;
      project.images[key] = ` ${BASE_URL}/uploads/${file.filename}`;
    });

    await project.save();
    res.json({ images: project.images });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getProjects,
  getProjectDetail,
  putProjectDetail,
  postProject,
  postProjectImages,
  deleteProject,
};
