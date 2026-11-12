import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/20 hover:from-brand-700 hover:to-brand-600 focus:ring-brand-500 disabled:from-brand-300 disabled:to-brand-300 disabled:shadow-none",
  secondary:
    "bg-white text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:ring-brand-500 disabled:opacity-50",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm shadow-red-500/20 hover:from-red-700 hover:to-red-600 focus:ring-red-500 disabled:from-red-300 disabled:to-red-300 disabled:shadow-none",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-all duration-200 active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";