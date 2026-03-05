// client/src/components/ProjectsManager.jsx
import React, { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import ProjectForm from "./ProjectForm";
import { projectsAPI } from "../services/api";

const ProjectsManager = ({ projects, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const openCreate = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingProject(null);
    onRefresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Danh sách dự án</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition"
        >
          <Plus size={24} />
          Thêm dự án mới
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-3xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-xl">{p.name}</h3>
              <p className="text-gray-500">{p.type}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openEdit(p)}
                className="p-3 hover:bg-gray-100 rounded-2xl text-blue-600"
              >
                <Edit2 size={22} />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("Xóa dự án này?")) {
                    await projectsAPI.deleteProject(p._id);
                    onRefresh();
                  }
                }}
                className="p-3 hover:bg-gray-100 rounded-2xl text-red-600"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectForm
          project={editingProject}
          onSuccess={handleSuccess}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsManager;
