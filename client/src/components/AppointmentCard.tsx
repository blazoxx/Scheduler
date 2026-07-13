"use client";

import type { Appointment } from "@/src/types/appointment";
import StatusBadge from "./StatusBadge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";

type Props = {
  appointment: Appointment;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AppointmentCard({
  appointment,
  onComplete,
  onCancel,
  onDelete,
}: Props) {
  return (
    <Card>
      <CardBody className="space-y-4 p-5 sm:flex sm:items-start sm:justify-between sm:gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold tracking-tight text-slate-950">
              {appointment.client_name}
            </p>
            <StatusBadge status={appointment.status} />
          </div>

          <p className="text-sm text-slate-600">{appointment.title}</p>

          <div className="space-y-1 text-sm text-slate-600">
            <p>{appointment.date}</p>
            <p>
              {appointment.start_time} - {appointment.end_time}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {appointment.status === "scheduled" ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => onComplete(appointment.id)}>
                Complete
              </Button>
              <Button size="sm" variant="danger" onClick={() => onCancel(appointment.id)}>
                Cancel
              </Button>
            </>
          ) : null}

          <Button size="sm" variant="ghost" onClick={() => onDelete(appointment.id)}>
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}