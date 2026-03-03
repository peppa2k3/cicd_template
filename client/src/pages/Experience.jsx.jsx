// client/src/pages/Experience.jsx
import React, { useState, useEffect } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { experiencesAPI } from "../services/api";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    experiencesAPI.getExperiences().then(setExperiences);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Experience
        </h1>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {exp.title}
                </h3>
                <p className="text-lg text-blue-600 font-semibold mb-2">
                  {exp.company}
                </p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>{exp.duration}</span>
                </div>
              </div>
              <Briefcase className="text-purple-600" size={32} />
            </div>

            <p className="text-gray-600 mb-4">{exp.description}</p>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Achievements:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {exp.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
