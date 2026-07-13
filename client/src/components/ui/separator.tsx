import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

type Props = HTMLAttributes<HTMLHRElement>;

export default function Separator({ className, ...props }: Props) {
  return <hr className={cn("border-slate-200", className)} {...props} />;
}