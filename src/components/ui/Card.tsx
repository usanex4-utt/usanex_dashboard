import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70",
        interactive &&
          "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}