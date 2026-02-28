// services/api.js
const API_URL =
  `${import.meta.env.VITE_API_URL}/api` || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

// User API
export const userAPI = {
  getUser: async () => {
    const response = await fetch(`${API_URL}/user`);
    return response.json();
  },

  updateUser: async (userData) => {
    const response = await fetch(`${API_URL}/user`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async (featured = false, limit = null) => {
    let url = `${API_URL}/projects?`;
    if (featured) url += "featured=true&";
    if (limit) url += `limit=${limit}`;

    const response = await fetch(url);
    return response.json();
  },

  getProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    return response.json();
  },

  createProject: async (projectData) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  },

  updateProject: async (id, projectData) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return response.json();
  },

  deleteProject: async (id) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/projects/${id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};
