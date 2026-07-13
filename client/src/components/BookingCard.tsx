import { supabase } from "@/src/lib/supabase";
import type { Appointment } from "@/src/types/appointment";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";

type Props = {
  appointment: Appointment;
  onReschedule?: (appointment: Appointment) => void;
};

export default function BookingCard({ appointment, onReschedule }: Props) {
  async function cancelAppointment(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const canManage =
    appointment.status === "scheduled" && appointment.date >= today;

  return (
    <Card>
      <CardBody className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              {appointment.title}
            </h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p>{appointment.date}</p>
              <p>
                {appointment.start_time} - {appointment.end_time}
              </p>
            </div>
          </div>

          <Badge
            variant={
              appointment.status === "scheduled"
                ? "success"
                : appointment.status === "completed"
                  ? "info"
                  : appointment.status === "cancelled"
                    ? "neutral"
                    : appointment.status === "pending"
                      ? "warning"
                      : "danger"
            }
          >
            {appointment.status}
          </Badge>
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" size="sm" onClick={() => cancelAppointment(appointment.id)}>
              Cancel
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onReschedule?.(appointment)}>
              Reschedule
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
