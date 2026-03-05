import React from "react";

const projects = [
  {
    title: "E-Commerce App",
    desc: "Xây dựng hệ thống bán hàng trực tuyến tích hợp thanh toán.",
    duration: "Jan 2025 - Mar 2025",
    github: "#",
    demo: "#",
  },
  {
    title: "Task Management Tool",
    desc: "Ứng dụng quản lý công việc cá nhân với tính năng kéo thả.",
    duration: "Nov 2024 - Dec 2024",
    github: "#",
    demo: "#",
  },
];

const Projects = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 border-b-4 border-yellow-400 inline-block">
        Dự án tiêu biểu
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md border-t-8 border-blue-600 hover:shadow-lg transition"
          >
            <span className="text-sm text-slate-400 uppercase font-bold tracking-wider">
              {p.duration}
            </span>
            <h3 className="text-2xl font-bold text-blue-900 mt-2">{p.title}</h3>
            <p className="text-slate-600 mt-2 mb-4">{p.desc}</p>
            <div className="flex gap-4">
              <a
                href={p.github}
                className="text-blue-600 font-semibold hover:underline"
              >
                Code source
              </a>
              <a
                href={p.demo}
                className="text-yellow-600 font-semibold hover:underline"
              >
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
