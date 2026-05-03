"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s/g, "-").toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 rounded-xl
              border-2 border-slate-200
              bg-white text-slate-900
              placeholder:text-slate-400
              transition-all duration-200
              focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
