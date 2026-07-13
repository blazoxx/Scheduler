import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-slate-200/80 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: Props) {
  return <div className={cn("border-b border-slate-200/70 px-6 py-5", className)} {...props} />;
}

export function CardBody({ className, ...props }: Props) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: Props) {
  return <div className={cn("border-t border-slate-200/70 px-6 py-5", className)} {...props} />;
}