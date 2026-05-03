"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-slate-100
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        ${paddingStyles[padding]}
        ${hover ? "transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer" : ""}
        ${onClick ? "w-full text-left" : ""}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
