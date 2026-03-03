// client/src/pages/Contact.jsx
import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Facebook,
  Send, // Telegram
  Youtube,
  MessageCircle, // Line / Zalo fallback
  Users, // Teams
  Phone, // Zalo alternative
  Globe, // WeChat fallback
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
        message: "Email sent successfully! Thank you.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  };

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      url: user?.contact?.github,
      color: " bg-gray-50 text-gray-700 hover:text-black",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: user?.contact?.linkedin,
      color: " bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-200",
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: user?.contact?.facebook,
      color: "text-blue-500 hover:text-blue-600",
    },
    {
      icon: Send,
      label: "Telegram",
      url: user?.contact?.telegram,
      color: "text-sky-500 hover:text-sky-600",
    },
    {
      icon: Youtube,
      label: "YouTube",
      url: user?.contact?.youtube,
      color: "text-red-600 hover:text-red-700",
    },
    {
      icon: MessageCircle,
      label: "Line",
      url: user?.contact?.line,
      color: "text-green-500 hover:text-green-600",
    },
    {
      icon: Globe,
      label: "WeChat",
      url: user?.contact?.wechat,
      color: "text-green-600 hover:text-green-700",
    },
    {
      icon: Phone,
      label: "Zalo",
      url: user?.contact?.zalo,
      color: "text-blue-500 hover:text-blue-600",
    },
    {
      icon: Users,
      label: "Teams",
      url: user?.contact?.teams,
      color: "text-indigo-500 hover:text-indigo-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Get In Touch
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Please contact me via the form below. I will respond within 24 hours!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Contact information
            </h2>

            {user?.address && (
              <div className="flex items-start gap-4">
                <MapPin
                  className="text-blue-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">{user.address}</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4"> Click!!!</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(
                  (social) =>
                    social.url && (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2  rounded-xl border-2 ${social.color} transition`}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send email</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                  placeholder="Jonh Wick"
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
                Title
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                placeholder="Message Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-y"
                placeholder="I would like to collaborate/inquire about the project..."
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl disabled:opacity-70 transition"
            >
              {status.loading ? (
                "Sending..."
              ) : (
                <>
                  <Send size={22} /> Send Email
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
