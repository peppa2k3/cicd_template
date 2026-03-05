import React from "react";

const CV = () => {
  const cvUrl = "cv.pdf";
  return (
    <section className="bg-yellow-50 p-8 rounded-3xl border-2 border-dashed border-yellow-400 text-center">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Hồ sơ năng lực (CV)
      </h2>

      {/* Preview giả lập bằng Iframe */}
      <div className="bg-white rounded-xl shadow-inner h-64 mb-6 flex items-center justify-center overflow-hidden">
        <iframe src={cvUrl} title="CV Preview" className="w-full h-full" />
      </div>

      <a
        href={cvUrl}
        download
        className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-800 shadow-lg transform hover:scale-105 transition"
      >
        Tải xuống CV (PDF)
      </a>
    </section>
  );
};

export default CV;
