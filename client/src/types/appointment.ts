export type Appointment = {
  id: string;
  client_name: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status:
    | "pending"
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rejected";
};