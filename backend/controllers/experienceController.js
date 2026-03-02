// backend/controllers/experienceController.js
import Experience from "../models/Experience.js";

export const getExperiences = async (req, res) => {
  const experiences = await Experience.find().sort({ createdAt: -1 });
  res.json(experiences);
};

export const createExperience = async (req, res) => {
  const experience = await Experience.create(req.body);
  res.status(201).json(experience);
};

export const updateExperience = async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json(experience);
};

export const deleteExperience = async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Experience deleted" });
};
