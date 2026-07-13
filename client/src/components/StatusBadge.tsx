import type { Appointment } from "@/src/types/appointment";
import Badge from "@/src/components/ui/badge";

type Props = {
  status: Appointment["status"];
};

export default function StatusBadge({ status }: Props) {
  if (status === "pending") {
    return <Badge variant="warning">Pending</Badge>;
  }

  if (status === "scheduled") {
    return <Badge variant="info">Scheduled</Badge>;
  }

  if (status === "completed") {
    return <Badge variant="success">Completed</Badge>;
  }

  if (status === "rejected") {
    return <Badge variant="danger">Rejected</Badge>;
  }

  return <Badge variant="neutral">Cancelled</Badge>;
}