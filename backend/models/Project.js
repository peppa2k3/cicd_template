// Project Schema
import mongoose from "mongoose";
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
const Project = mongoose.model("Project", projectSchema);
export default Project;
