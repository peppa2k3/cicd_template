// backend/controllers/contactController.js
import nodemailer from "nodemailer";
import Message from "../models/Message.js";
import User from "../models/User.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // 1. Lưu vào DB
    const newMessage = await Message.create({ name, email, subject, message });

    // 2. Lấy email chủ portfolio
    const owner = await User.findOne();
    const ownerEmail = owner?.contact?.email || process.env.EMAIL_USER;

    // 3. Gửi email thông báo
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `📨 Tin nhắn mới từ ${name}: ${subject || "Không có tiêu đề"}`,
      html: `
        <h2>Tin nhắn mới từ Portfolio</h2>
        <p><strong>Tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tiêu đề:</strong> ${subject || "Không có"}</p>
        <p><strong>Nội dung:</strong></p>
        <p style="background:#f4f4f4;padding:15px;border-radius:8px;">${message}</p>
        <hr>
        <p><small>Được gửi lúc: ${new Date().toLocaleString("vi-VN")}</small></p>
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Tin nhắn đã được gửi thành công!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
};
