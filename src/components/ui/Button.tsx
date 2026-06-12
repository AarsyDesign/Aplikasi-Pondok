import {
  ButtonHTMLAttributes,
  ReactElement,
  cloneElement,
  isValidElement,
} from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "border border-emerald-800 bg-emerald-800 text-white shadow-sm hover:bg-emerald-900",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900",
  danger:
    "border border-red-200 bg-red-50 text-red-700 shadow-sm hover:border-red-300 hover:bg-red-100",
  ghost:
    "border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950",
};

export function Button({
  asChild,
  children,
  className,
  disabled,
  isLoading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {isLoading ? "Memproses..." : children}
    </button>
  );
}
