// client/src/components/ProjectForm.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { projectsAPI } from "../services/api";

const ProjectForm = ({ project, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    maindesc: "",
    source: "",
    deployed: "",
    duration: { start: "", end: "" },
    another: "",
    featured: false,
    images: { image1: "", image2: "", image3: "", image4: "" },
    subdesc: [],
  });

  // Lưu file thật theo từng field (chỉ những ảnh người dùng chọn mới)
  const [selectedImageFiles, setSelectedImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        type: project.type || "",
        maindesc: project.maindesc || "",
        source: project.source || "",
        deployed: project.deployed || "",
        duration: project.duration || { start: "", end: "" },
        another: project.another || "",
        featured: project.featured || false,
        images: project.images || {
          image1: "",
          image2: "",
          image3: "",
          image4: "",
        },
        subdesc: project.subdesc || [],
      });

      // Reset file khi chỉnh sửa (chỉ upload những ảnh mới chọn)
      setSelectedImageFiles({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("duration.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        duration: { ...prev.duration, [key]: value },
      }));
    } else if (name.startsWith("images.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        images: { ...prev.images, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageFile = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFiles((prev) => ({ ...prev, [field]: file }));

      // Preview tạm thời bằng blob URL
      setFormData((prev) => ({
        ...prev,
        images: { ...prev.images, [field]: URL.createObjectURL(file) },
      }));
    }
  };

  const addSubdesc = () => {
    setFormData((prev) => ({
      ...prev,
      subdesc: [...prev.subdesc, { desc: "", content: "" }],
    }));
  };

  const removeSubdesc = (index) => {
    setFormData((prev) => ({
      ...prev,
      subdesc: prev.subdesc.filter((_, i) => i !== index),
    }));
  };

  const handleSubdescChange = (index, field, value) => {
    const newSub = [...formData.subdesc];
    newSub[index][field] = value;
    setFormData((prev) => ({ ...prev, subdesc: newSub }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Tạo payload sạch: giữ URL thật của ảnh cũ, bỏ blob URL tạm thời
      const payload = { ...formData };
      const cleanImages = { ...payload.images };

      Object.keys(cleanImages).forEach((key) => {
        const url = cleanImages[key];
        if (url && url.startsWith("blob:")) {
          cleanImages[key] = ""; // backend sẽ set lại sau khi upload
        }
      });
      payload.images = cleanImages;

      let projectId = project?._id;

      // 1. Tạo hoặc cập nhật project metadata trước
      if (project) {
        await projectsAPI.updateProject(project._id, payload);
      } else {
        const result = await projectsAPI.createProject(payload);
        projectId = result._id || result.id || result.project?._id;
      }

      // 2. Upload ảnh (nếu có file mới được chọn)
      const filesToUpload = Object.values(selectedImageFiles).filter(
        (file) => file !== null,
      );

      if (projectId && filesToUpload.length > 0) {
        console.log("Uploading images for project:", projectId);
        await projectsAPI.uploadImages(projectId, filesToUpload);
      }

      onSuccess();
      onClose?.(); // Đóng modal sau khi thành công
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu dự án!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-8 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {project ? "Chỉnh sửa dự án" : "Thêm dự án mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên dự án
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Loại dự án
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mô tả chính
            </label>
            <textarea
              name="maindesc"
              value={formData.maindesc}
              onChange={handleChange}
              rows={4}
              className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:border-blue-600"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Thời gian bắt đầu
              </label>
              <input
                type="text"
                name="duration.start"
                value={formData.duration.start}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Thời gian kết thúc
              </label>
              <input
                type="text"
                name="duration.end"
                value={formData.duration.end}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Source Code
              </label>
              <input
                type="url"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Link Deploy
              </label>
              <input
                type="url"
                name="deployed"
                value={formData.deployed}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600"
            />
            <label className="font-medium">Dự án nổi bật (featured)</label>
          </div>

          {/* 4 Images */}
          <div>
            <label className="block text-sm font-medium mb-4">
              Hình ảnh (4 ảnh)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["image1", "image2", "image3", "image4"].map((field, idx) => (
                <div
                  key={idx}
                  className="border-2 border-dashed border-gray-300 rounded-3xl p-4 text-center"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e, field)}
                    className="hidden"
                    id={`img-${field}`}
                  />
                  <label
                    htmlFor={`img-${field}`}
                    className="cursor-pointer block"
                  >
                    {formData.images[field] ? (
                      <img
                        src={formData.images[field]}
                        alt=""
                        className="mx-auto rounded-2xl max-h-40 object-cover"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-gray-400">
                        Chọn ảnh {idx + 1}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Subdesc dynamic */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">
                Chi tiết mô tả (subdesc)
              </label>
              <button
                type="button"
                onClick={addSubdesc}
                className="flex items-center gap-2 text-blue-600"
              >
                <Plus size={20} /> Thêm
              </button>
            </div>

            {formData.subdesc.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-3xl p-6 mb-6 relative"
              >
                <button
                  type="button"
                  onClick={() => removeSubdesc(index)}
                  className="absolute top-4 right-4 text-red-500"
                >
                  <Trash2 size={20} />
                </button>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Tiêu đề phần"
                    value={item.desc}
                    onChange={(e) =>
                      handleSubdescChange(index, "desc", e.target.value)
                    }
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
                  />
                  <textarea
                    placeholder="Nội dung chi tiết"
                    value={item.content}
                    onChange={(e) =>
                      handleSubdescChange(index, "content", e.target.value)
                    }
                    rows={4}
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl font-semibold text-lg hover:shadow-xl disabled:opacity-70"
          >
            {saving ? "Đang lưu..." : project ? "Cập nhật dự án" : "Tạo dự án"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
