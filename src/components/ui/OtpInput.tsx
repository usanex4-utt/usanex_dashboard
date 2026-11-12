
import { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);

    const chars = Array.from(
      { length },
      (_, i) => value[i] || ""
    );

    chars[index] = digit;
    onChange(chars.join(""));

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const chars = Array.from(
          { length },
          (_, i) => value[i] || ""
        );

        chars[index] = "";
        onChange(chars.join("").replace(/\s+$/, ""));
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (text) {
      onChange(text);
      inputs.current[Math.min(text.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex w-full min-w-0 items-center justify-center gap-1.5 xs:gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] || ""}
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={[
            "h-10 w-10 min-w-0",
            "rounded-lg sm:h-12 sm:w-12",
            "md:h-14 md:w-14",
            "border border-slate-200 bg-white",
            "text-center text-lg font-bold text-slate-800",
            "sm:text-xl md:text-2xl",
            "shadow-sm transition-all duration-200",
            "outline-none",
            "focus:border-indigo-500",
            "focus:ring-4 focus:ring-indigo-100",
            "disabled:cursor-not-allowed disabled:bg-slate-100",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
