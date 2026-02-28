// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, FolderGit2 } from "lucide-react";
import { authAPI, userAPI, projectsAPI } from "../services/api";

import UserEditor from "../components/UserEditor";
import ProjectsManager from "../components/ProjectsManager";

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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Quản lý toàn bộ portfolio</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-6 flex items-center justify-center gap-3 font-semibold text-lg transition-all ${
                activeTab === "user"
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User size={24} />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 py-6 flex items-center justify-center gap-3 font-semibold text-lg transition-all ${
                activeTab === "projects"
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FolderGit2 size={24} />
              Quản lý Dự án ({projects.length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === "user" && user && (
              <UserEditor user={user} onUpdate={setUser} />
            )}
            {activeTab === "projects" && (
              <ProjectsManager projects={projects} onRefresh={fetchData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
