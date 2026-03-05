import React from "react";

const Info = () => {
  return (
    <section className="bg-blue-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
      <img
        src="../src/assets/debungnha.png"
        alt="Avatar"
        className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover"
      />
      <div className="text-center md:text-left space-y-3">
        <h1 className="text-4xl font-bold">Hai Dang</h1>
        <p className="text-yellow-400 text-xl font-medium">
          Fullstack Developer
        </p>
        <p className="text-blue-100 max-w-md">
          Đam mê xây dựng các ứng dụng web tối ưu và trải nghiệm người dùng mượt
          mà.
        </p>

        <div className="flex justify-center md:justify-start gap-4 pt-4">
          <a
            href="https://github.com/peppa2k3"
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            className="border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-blue-900 transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};

export default Info;
