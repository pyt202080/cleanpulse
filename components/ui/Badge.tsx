"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  brand: "bg-brand-50 text-brand-700",
};

const dotColors = {
  default: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  brand: "bg-brand-500",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${variantStyles[variant]}
        ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
