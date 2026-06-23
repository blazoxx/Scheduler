"use client";

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Today</h3>
        <p className="text-3xl font-bold">{today}</p>
      </div>

      <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Upcoming</h3>
        <p className="text-3xl font-bold">{upcoming}</p>
      </div>

      <div className="bg-green-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Completed</h3>
        <p className="text-3xl font-bold">{completed}</p>
      </div>

      <div className="bg-red-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Cancelled</h3>
        <p className="text-3xl font-bold">{cancelled}</p>
      </div>
    </div>
  );
}