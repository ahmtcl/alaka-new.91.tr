"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  );
}
