import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { projectsAPI } from "../services/api";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getProject(id);
        setProject(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Không tìm thấy dự án
        </h2>
        <Link
          to="/projects"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Quay lại danh sách dự án
        </Link>
      </div>
    );
  }

  const images = Object.values(project.images || {}).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition"
      >
        <ArrowLeft size={20} />
        Quay lại
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-1 shadow-2xl mb-8">
        <div className="bg-white rounded-3xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold uppercase mb-4">
                {project.type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {project.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{project.maindesc}</p>

              {project.duration && (
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <Calendar size={18} />
                  <span>
                    {project.duration.start} - {project.duration.end}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                {project.source && (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                  >
                    <Github size={20} />
                    Source Code
                  </a>
                )}
                {project.deployed && (
                  <a
                    href={project.deployed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images Gallery */}
      {images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={img}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      {project.subdesc && project.subdesc.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chi tiết dự án
          </h2>
          <div className="space-y-6">
            {project.subdesc.map((section, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {section.desc}
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.another && (
        <div className="mt-8 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Thông tin bổ sung
          </h3>
          <p className="text-gray-600 whitespace-pre-wrap">{project.another}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
