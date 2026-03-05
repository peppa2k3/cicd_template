// client/src/components/ExperiencesManager.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { experiencesAPI } from "../services/api"; // sẽ tạo sau

const ExperiencesManager = ({ onRefresh }) => {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const fetchExperiences = async () => {
    const data = await experiencesAPI.getExperiences();
    setExperiences(data);
  };
  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    fetchExperiences();
    onRefresh && onRefresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Quản lý Kinh nghiệm</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold"
        >
          <Plus size={24} /> Thêm kinh nghiệm mới
        </button>
      </div>

      {showForm && (
        <ExperienceForm
          experience={editing}
          onSuccess={handleSuccess}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-white rounded-3xl p-8 shadow flex justify-between"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{exp.title}</h3>
              <p className="text-blue-600 font-semibold">{exp.company}</p>
              <p className="text-gray-500">{exp.duration}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setEditing(exp);
                  setShowForm(true);
                }}
                className="text-blue-600"
              >
                <Edit2 size={24} />
              </button>
              <button
                onClick={async () => {
                  if (confirm("Xóa?")) {
                    await experiencesAPI.deleteExperience(exp._id);
                    fetchExperiences();
                  }
                }}
                className="text-red-600"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form component (inline)
const ExperienceForm = ({ experience, onSuccess, onClose }) => {
  const [form, setForm] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    duration: experience?.duration || "",
    description: experience?.description || "",
    achievements: experience?.achievements || [""],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (experience) {
      await experiencesAPI.updateExperience(experience._id, form);
    } else {
      await experiencesAPI.createExperience(form);
    }
    onSuccess();
  };

  const addAchievement = () =>
    setForm({ ...form, achievements: [...form.achievements, ""] });
  const removeAchievement = (i) => {
    const newAch = form.achievements.filter((_, idx) => idx !== i);
    setForm({ ...form, achievements: newAch });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto p-8"
      >
        <h3 className="text-2xl font-bold mb-6">
          {experience ? "Chỉnh sửa" : "Thêm mới"} Kinh nghiệm
        </h3>

        <input
          type="text"
          placeholder="Chức vụ"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-2xl px-5 py-3 mb-4"
          required
        />
        <input
          type="text"
          placeholder="Công ty"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full border rounded-2xl px-5 py-3 mb-4"
          required
        />
        <input
          type="text"
          placeholder="Thời gian (2023 - Present)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-full border rounded-2xl px-5 py-3 mb-4"
          required
        />
        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full border rounded-2xl px-5 py-3 mb-4"
        />

        <label className="font-medium block mb-3">Thành tựu</label>
        {form.achievements.map((ach, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <input
              type="text"
              value={ach}
              onChange={(e) => {
                const newAch = [...form.achievements];
                newAch[i] = e.target.value;
                setForm({ ...form, achievements: newAch });
              }}
              className="flex-1 border rounded-2xl px-5 py-3"
            />
            <button
              type="button"
              onClick={() => removeAchievement(i)}
              className="text-red-500"
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAchievement}
          className="text-blue-600 text-sm"
        >
          + Thêm thành tựu
        </button>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-4 rounded-3xl font-semibold"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border py-4 rounded-3xl"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperiencesManager;
