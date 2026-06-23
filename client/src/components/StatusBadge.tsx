type Props = {
  status: "scheduled" | "completed" | "cancelled";
};

export default function StatusBadge({ status }: Props) {
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

  return (
    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
      Cancelled
    </span>
  );
}