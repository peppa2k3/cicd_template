// client/src/components/UserEditor.jsx
import React, { useState, useEffect } from "react";
import { Upload, Save } from "lucide-react";
import { userAPI } from "../services/api";

const UserEditor = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        address: user.address || "",
        jobs: user.jobs || "",
        another: user.another || "",
        dayofbirth: user.dayofbirth || "",
        contact: user.contact || {},
        setting: user.setting || {},
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [e.target.name]: e.target.value },
    }));
  };

  const handleSettingChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      setting: { ...prev.setting, [e.target.name]: e.target.value },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await userAPI.updateUser({
        nickname: formData.nickname,
        firstname: formData.firstname,
        lastname: formData.lastname,
        address: formData.address,
        jobs: formData.jobs,
        another: formData.another,
        dayofbirth: formData.dayofbirth,
        contact: formData.contact,
        setting: formData.setting,
      });

      let finalUser = updatedUser;
      if (selectedAvatar) {
        const res = await userAPI.uploadAvatar(selectedAvatar);
        finalUser = { ...updatedUser, avatar: res.avatar };
      }

      onUpdate(finalUser);
      alert("✅ Cập nhật thành công!");
      setSelectedAvatar(null);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <img
            src={avatarPreview || "/profile-circle-svgrepo-com.svg"}
            alt="Avatar"
            className="w-36 h-36 rounded-3xl object-cover border-4 border-white shadow-2xl"
          />
          <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-3 rounded-2xl cursor-pointer hover:bg-blue-700 transition">
            <Upload size={22} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 border-b pb-3">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* nickname, firstname, lastname, dayofbirth, jobs, address, another */}
          {[
            "nickname",
            "firstname",
            "lastname",
            "dayofbirth",
            "jobs",
            "address",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {field}
              </label>
              <input
                type={field === "dayofbirth" ? "text" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 outline-none"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thông tin khác
            </label>
            <textarea
              name="another"
              value={formData.another || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 border-b pb-3">
          Liên hệ & Social
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formData.contact || {}).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key}
              </label>
              <input
                type="url"
                name={key}
                value={formData.contact?.[key] || ""}
                onChange={handleContactChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 border-b pb-3">Giao diện</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["backgroundcolor", "primarycolor", "secondarycolor"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-3 capitalize">
                  {field.replace("color", " Color")}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name={field}
                    value={formData.setting?.[field] || "#000000"}
                    onChange={handleSettingChange}
                    className="w-14 h-12 rounded-2xl border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    name={field}
                    value={formData.setting?.[field] || ""}
                    onChange={handleSettingChange}
                    className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl font-mono"
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-3xl font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-2xl disabled:opacity-70"
      >
        <Save size={24} />
        {saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}
      </button>
    </form>
  );
};

export default UserEditor;
