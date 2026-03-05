// client/src/components/CVManager.jsx
import React, { useState } from "react";
import { Upload, Trash2, CheckCircle } from "lucide-react";
import { userAPI } from "../services/api";

const CVManager = ({ user, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const cvs = user?.cvs || [];

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".pdf"))
      return alert("Chỉ chấp nhận file PDF!");

    setUploading(true);
    try {
      const res = await userAPI.uploadCV(file); // FormData
      onUpdate({ ...user, cvs: res.cvs });
      alert("Upload CV thành công!");
    } catch (err) {
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (filename) => {
    const res = await userAPI.setActiveCV(filename);
    onUpdate({ ...user, cvs: res.cvs });
  };

  const deleteCV = async (filename) => {
    if (!confirm("Xóa CV này?")) return;
    const res = await userAPI.deleteCV(filename);
    onUpdate({ ...user, cvs: res.cvs });
  };

  return (
    <div className="space-y-8">
      <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
        <label className="cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700">
          {uploading ? "Đang upload..." : "Upload CV mới (PDF)"}
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid gap-6">
        {cvs.map((cv, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-6 flex justify-between items-center ${cv.isActive ? "ring-4 ring-green-400" : ""}`}
          >
            <div>
              <p className="font-medium">{cv.filename}</p>
              <p className="text-sm text-gray-500">
                {new Date(cv.uploadedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex gap-4">
              {!cv.isActive && (
                <button
                  onClick={() => setActive(cv.filename)}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <CheckCircle size={20} /> Đặt làm active
                </button>
              )}
              <button
                onClick={() => deleteCV(cv.filename)}
                className="text-red-600"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVManager;
