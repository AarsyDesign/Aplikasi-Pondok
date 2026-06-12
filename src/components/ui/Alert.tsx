import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "success" | "warning" | "danger" | "info";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

const variants: Record<AlertVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function Alert({
  className,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium shadow-sm",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
