import type { SelectHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}