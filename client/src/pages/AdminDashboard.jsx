import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, FolderGit2, Plus, Edit, Trash2 } from "lucide-react";
import { authAPI, userAPI, projectsAPI } from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, projectsData] = await Promise.all([
        userAPI.getUser(),
        projectsAPI.getProjects(),
      ]);
      setUser(userData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/admin/login");
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dự án này?")) {
      try {
        await projectsAPI.deleteProject(id);
        setProjects(projects.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === "user"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <User size={20} />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === "projects"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            <FolderGit2 size={20} />
            Quản lý dự án
          </button>
        </div>

        <div className="p-6">
          {activeTab === "user" && (
            <UserEditor user={user} onUpdate={setUser} />
          )}
          {activeTab === "projects" && (
            <ProjectsManager
              projects={projects}
              onDelete={handleDeleteProject}
              onRefresh={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// User Editor Component
const UserEditor = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Text input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // File change
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1️⃣ Update user info (JSON)
      const updatedUser = await userAPI.updateUser(formData);

      // 2️⃣ Upload avatar nếu có file
      let finalUser = updatedUser;
      if (selectedFile) {
        const avatarRes = await userAPI.uploadAvatar(selectedFile);
        finalUser = {
          ...updatedUser,
          avatar: avatarRes.avatar, // tùy backend trả về
        };
      }

      onUpdate(finalUser);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jobs
          </label>
          <input
            type="text"
            value={formData.jobs || ""}
            onChange={(e) => setFormData({ ...formData, jobs: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>{" "}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Avatar
          </label>
          <input
            type="file"
            // value={formData.jobs || ""}
            onChange={(e) => {
              handleFileChange(e);
            }}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          GitHub
        </label>
        <input
          type="url"
          value={formData.contact?.github || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              contact: { ...formData.contact, github: e.target.value },
            })
          }
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
      >
        {saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
};

// Projects Manager Component
const ProjectsManager = ({ projects, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
      >
        <Plus size={20} />
        Thêm dự án mới
      </button>

      {showForm && (
        <ProjectForm
          onSuccess={() => {
            setShowForm(false);
            onRefresh();
          }}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{project.name}</h3>
              <p className="text-gray-600 text-sm">{project.type}</p>
            </div>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Project Form Component
const ProjectForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    maindesc: "",
    source: "",
    deployed: "",
    featured: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.createProject(formData);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 rounded-lg p-6 space-y-4"
    >
      <input
        type="text"
        placeholder="Tên dự án"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Loại dự án (web, mobile, ...)"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <textarea
        placeholder="Mô tả"
        value={formData.maindesc}
        onChange={(e) => setFormData({ ...formData, maindesc: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        rows="3"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Tạo dự án
      </button>
    </form>
  );
};

export default AdminDashboard;
