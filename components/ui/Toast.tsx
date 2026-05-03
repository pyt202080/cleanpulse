"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let addToastFn: ((message: string, type?: ToastType) => void) | null = null;

/** 전역 toast 함수 — 어디서든 toast("메시지") 호출 가능 */
export function toast(message: string, type: ToastType = "success") {
  addToastFn?.(message, type);
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const styles: Record<ToastType, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-brand-600 text-white",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (message: string, type: ToastType = "success") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
            animate-slide-up
            ${styles[t.type]}
          `}
        >
          {icons[t.type]}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
