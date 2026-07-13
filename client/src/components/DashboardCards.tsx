"use client";

import Badge from "@/src/components/ui/badge";
import { Card, CardBody } from "@/src/components/ui/card";

type Props = {
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
};

export default function DashboardCards({
  today,
  upcoming,
  completed,
  cancelled,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Today", value: today, tone: "info" as const, accent: "bg-sky-500" },
        {
          label: "Upcoming",
          value: upcoming,
          tone: "neutral" as const,
          accent: "bg-teal-500",
        },
        {
          label: "Completed",
          value: completed,
          tone: "success" as const,
          accent: "bg-emerald-500",
        },
        {
          label: "Cancelled",
          value: cancelled,
          tone: "danger" as const,
          accent: "bg-rose-500",
        },
      ].map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <div className={`h-1 w-full ${stat.accent}`} />
          <CardBody className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <Badge variant={stat.tone}>{stat.label}</Badge>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
            <p className="text-sm leading-6 text-slate-600">
              Snapshot of your current scheduling activity.
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}