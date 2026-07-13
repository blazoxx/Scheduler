import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function PageContainer({ className, children, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}