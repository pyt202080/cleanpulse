"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  noPadding?: boolean;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  noPadding = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
          animate-scale-in overflow-hidden
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={noPadding ? "overflow-hidden" : `${title ? "px-6 pb-6" : "pt-6 px-6 pb-6"} overflow-y-auto max-h-[70vh]`}>
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            >
              <X size={20} />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
