import React, { useState, useEffect } from "react";
import { Mail, MapPin, Github, Linkedin, Facebook, Send } from "lucide-react";
import { userAPI } from "../services/api";

const Contact = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userAPI.getUser();
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUser();
  }, []);

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
          Hãy liên hệ với tôi qua các kênh dưới đây. Tôi luôn sẵn sàng lắng
          nghe!
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên của bạn
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tin nhắn
              </label>
              <textarea
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition"
                placeholder="Nội dung tin nhắn..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Send size={20} />
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
