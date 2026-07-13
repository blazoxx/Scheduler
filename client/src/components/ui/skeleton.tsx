import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type Props = HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: Props) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-slate-200/80", className)}
      {...props}
    />
  );
}