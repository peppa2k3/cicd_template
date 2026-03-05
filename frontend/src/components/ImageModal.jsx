// client/src/components/ImageModal.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
  // Đóng khi nhấn ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Ngăn scroll nền
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose} // Click overlay → đóng
    >
      <div
        className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào ảnh
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-900 p-3 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition z-10"
        >
          <X size={28} />
        </button>

        {/* Ảnh full size */}
        <img
          src={imageSrc}
          alt="Full size preview"
          className="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImageModal;
