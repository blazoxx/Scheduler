import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10",
        className,
      )}
      {...props}
    />
  );
}