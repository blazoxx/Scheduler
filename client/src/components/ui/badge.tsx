import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-teal-100 text-teal-700",
};

export default function Badge({ className, variant = "neutral", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}