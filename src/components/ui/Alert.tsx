import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type Variant = "error" | "success" | "info";

export function Alert({
  variant = "info",
  children,
}: {
  variant?: Variant;
  children: ReactNode;
}) {
  const styles: Record<Variant, string> = {
    error: "bg-red-50 text-red-700 ring-red-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    info: "bg-blue-50 text-blue-700 ring-blue-200",
  };
  const Icon =
    variant === "error"
      ? AlertCircle
      : variant === "success"
      ? CheckCircle2
      : Info;

  return (
    <div
      className={[
        "flex items-start gap-2 rounded-lg px-3 py-2 text-sm ring-1 animate-fade-in",
        styles[variant],
      ].join(" ")}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}