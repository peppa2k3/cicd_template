// services/api.js
import axios from "axios";
//
let BE_URL = import.meta.env.VITE_API_URL;
if (!BE_URL) {
  console.log("can not find be url");
  BE_URL = "https://api.profile.dangngochai.io.vn";
}
const API_URL = `${BE_URL}/api`;
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}
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
  uploadCV: (file) => {
    const form = new FormData();
    form.append("cv", file);
    return axios
      .post(`${API_URL}/user/cv`, form, {
        headers: { Authorization: `Bearer: ${getToken()}` },
      })
      .then((res) => res.data);
  },
  setActiveCV: (filename) =>
    axios
      .put(
        `${API_URL}/user/cv/active`,
        { filename },
        { headers: { Authorization: `Bearer: ${getToken()}` } },
      )
      .then((res) => res.data),
  deleteCV: (filename) =>
    axios
      .delete(`${API_URL}/user/cv/${filename}`, {
        headers: { Authorization: `Bearer: ${getToken()}` },
      })
      .then((res) => res.data),
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

// experiencesAPI
export const experiencesAPI = {
  getExperiences: () =>
    axios.get(`${API_URL}/experiences`).then((res) => res.data),
  createExperience: (data) => {
    axios
      .post(`${API_URL}/experiences`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // Lưu ý: Axios sẽ tự động thiết lập 'Content-Type': 'multipart/form-data'
          // khi bạn truyền một đối tượng FormData vào body.
        },
      })
      .then((res) => res.data);
  },

  updateExperience: (id, data) =>
    axios
      .put(`${API_URL}/experiences/${id}`, data, {
        headers: getAuthHeaders(),
      })
      .then((res) => res.data),
  deleteExperience: (id) => {
    axios.delete(`${API_URL}/experiences/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },
};
// === CONTACT API ===
export const contactAPI = {
  sendMessage: (data) =>
    axios.post(`${API_URL}/contact`, data).then((res) => res.data),
};
