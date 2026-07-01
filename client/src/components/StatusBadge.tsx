import type { Appointment } from "@/src/types/appointment";

type Props = {
  status: Appointment["status"];
};

export default function StatusBadge({ status }: Props) {
  if (status === "pending") {
    return (
      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
        Pending
      </span>
    );
  }

  if (status === "scheduled") {
    return (
      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
        Scheduled
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
        Completed
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
        Rejected
      </span>
    );
  }

  return (
    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
      Cancelled
    </span>
  );
}