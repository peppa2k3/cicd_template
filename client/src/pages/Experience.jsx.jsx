// pages/Experience.jsx
import React from "react";
import { Briefcase, Calendar } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Senior Fullstack Developer",
      company: "Tech Corp",
      duration: "2023 - Present",
      description:
        "Phát triển và duy trì các ứng dụng web quy mô lớn sử dụng React, Node.js và MongoDB",
      achievements: [
        "Cải thiện hiệu suất hệ thống 40%",
        "Xây dựng kiến trúc microservices",
        "Quản lý team 5 developers",
      ],
    },
    {
      title: "Fullstack Developer",
      company: "StartUp XYZ",
      duration: "2021 - 2023",
      description: "Xây dựng sản phẩm từ đầu với stack MERN",
      achievements: [
        "Phát triển MVP trong 3 tháng",
        "Tích hợp payment gateway",
        "Implement CI/CD pipeline",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Experience
        </h1>
        <p className="text-gray-600 text-lg">
          Hành trình phát triển sự nghiệp của tôi
        </p>
      </div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
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

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Thành tựu:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
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

