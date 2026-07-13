import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionHeader({ eyebrow, title, description, action }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            {eyebrow}
          </p>
        ) : null}

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h2>

          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}