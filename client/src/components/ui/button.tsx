import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-700 text-white shadow-[0_10px_30px_rgba(15,118,110,0.2)] hover:bg-teal-800",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  leadingIcon,
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-teal-500/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  );
}