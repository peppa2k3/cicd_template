import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github } from "lucide-react";
import { projectsAPI } from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const types = ["all", ...new Set(projects.map((p) => p.type))];
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.type === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá các dự án tôi đã xây dựng với đam mê và sáng tạo
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filter === type
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Link to={`/projects/${project._id}`}>
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden relative">
                  {project.images?.image1 ? (
                    <img
                      src={project.images.image1}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {project.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>
              </Link>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold uppercase">
                      {project.type}
                    </span>
                    <Link to={`/projects/${project._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                        {project.name}
                      </h3>
                    </Link>
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-3">{project.maindesc}</p>

                {project.duration && (
                  <p className="text-sm text-gray-400">
                    {project.duration.start} - {project.duration.end}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  {project.source && (
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <Github size={18} />
                      <span className="text-sm font-medium">Code</span>
                    </a>
                  )}
                  {project.deployed && (
                    <a
                      href={project.deployed}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
                    >
                      <ExternalLink size={18} />
                      <span className="text-sm font-medium">Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Không tìm thấy dự án nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
