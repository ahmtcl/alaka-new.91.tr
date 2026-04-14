"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative bg-white max-w-[800px] max-h-[85vh] w-[90%] p-12 overflow-y-auto rounded-lg shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-3xl text-muted hover:text-dark transition-colors leading-none cursor-pointer"
          aria-label="Kapat"
        >
          &times;
        </button>

        <h2 className="text-[1.75rem] font-semibold text-dark mb-2">{title}</h2>
        {subtitle && (
          <h3 className="text-base font-normal text-muted mb-8 pb-6 border-b border-gray-200">
            {subtitle}
          </h3>
        )}

        <div className="prose prose-sm max-w-none [&_p]:text-[0.95rem] [&_p]:leading-relaxed [&_p]:text-accent [&_p]:mb-6 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-dark [&_h4]:mt-8 [&_h4]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-[0.95rem] [&_li]:text-accent [&_li]:mb-1">
          {children}
        </div>
      </div>
    </div>
  );
}
