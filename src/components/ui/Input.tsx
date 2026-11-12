import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm",
            "transition-colors placeholder:text-slate-400",
            "focus:outline-none focus:ring-4",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-500 focus:ring-brand-100",
            className,
          ].join(" ")}
          {...rest}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";