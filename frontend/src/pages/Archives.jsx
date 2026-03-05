// pages/Archives.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Tag } from "lucide-react";
import { projectsAPI } from "../services/api";

const Archives = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  // Parse mọi dạng: 07/2025 | 07-2025 | 2025
  const parseStartDate = (project) => {
    const start = project?.duration?.start;
    if (!start) return new Date(0);

    // Replace - thành / để thống nhất
    const normalized = start.replace("-", "/");

    const parts = normalized.split("/");

    // Nếu có dạng MM/YYYY
    if (parts.length === 2) {
      const [month, year] = parts.map(Number);
      return new Date(year, month - 1);
    }

    // Nếu chỉ có YYYY
    if (parts.length === 1) {
      return new Date(Number(parts[0]), 0);
    }

    return new Date(0);
  };

  // 1️⃣ Sort trước
  const sortedProjects = [...projects].sort(
    (a, b) => parseStartDate(b) - parseStartDate(a),
  );

  // 2️⃣ Group theo year
  const projectsByYear = sortedProjects.reduce((acc, project) => {
    const date = parseStartDate(project);
    const year = date.getFullYear();

    if (!acc[year]) acc[year] = [];
    acc[year].push(project);

    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Archives
        </h1>
        <p className="text-gray-600 text-lg">
         Archive all projects by time
        </p>
      </div>

      <div className="space-y-12">
        {Object.keys(projectsByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="text-blue-600" />
                {year}
              </h2>

              <div className="space-y-4">
                {projectsByYear[year].map((project) => (
                  <div
                    key={project._id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{project.maindesc}</p>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                            <Tag size={14} />
                            {project.type}
                          </span>
                          {project.duration && (
                            <span className="text-sm text-gray-500">
                              {project.duration.start} - {project.duration.end}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Archives;
