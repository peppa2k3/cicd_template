// client/src/pages/Contact.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Facebook,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { userAPI, contactAPI } from "../services/api";

const Contact = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    message: "",
  });

  useEffect(() => {
    userAPI.getUser().then(setUser).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: "" });

    try {
      await contactAPI.sendMessage(form);
      setStatus({
        loading: false,
        success: true,
        message: "✅ Tin nhắn đã được gửi thành công! Cảm ơn bạn.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        message: "❌ Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  };

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      url: user?.contact?.github,
      color: "gray",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: user?.contact?.linkedin,
      color: "blue",
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: user?.contact?.facebook,
      color: "blue",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Get In Touch
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Hãy liên hệ với tôi qua form dưới đây. Tôi sẽ phản hồi trong vòng 24h!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Thông tin liên hệ
            </h2>

            {user?.address && (
              <div className="flex items-start gap-4">
                <MapPin
                  className="text-blue-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Địa chỉ</h3>
                  <p className="text-gray-600">{user.address}</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">Mạng xã hội</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(
                  (social) =>
                    social.url && (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 bg-${social.color}-50 text-${social.color}-600 rounded-lg hover:bg-${social.color}-100 transition`}
                      >
                        <social.icon size={20} />
                        {social.label}
                      </a>
                    ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Gửi tin nhắn
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                placeholder="Chủ đề tin nhắn"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung tin nhắn
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-y"
                placeholder="Tôi muốn hợp tác / hỏi về dự án..."
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl disabled:opacity-70 transition"
            >
              {status.loading ? (
                "Đang gửi..."
              ) : (
                <>
                  <Send size={22} /> Gửi tin nhắn
                </>
              )}
            </button>
          </form>

          {status.message && (
            <div
              className={`mt-6 p-4 rounded-2xl flex items-start gap-3 ${
                status.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status.success ? (
                <CheckCircle size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <p className="font-medium">{status.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
