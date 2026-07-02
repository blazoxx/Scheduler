import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";
import AppointmentDetails from "./layout/AppointmentDetails";

interface Props {
  clientName: string;

  title: string;

  oldDate: string;
  oldStartTime: string;
  oldEndTime: string;

  newDate: string;
  newStartTime: string;
  newEndTime: string;
}

export default function BookingRescheduled({
  clientName,
  title,
  oldDate,
  oldStartTime,
  oldEndTime,
  newDate,
  newStartTime,
  newEndTime,
}: Props) {
  return (
    <EmailLayout
      preview="Appointment rescheduled"
      title="Appointment Rescheduled"
    >
      <Text>Hello {clientName},</Text>

      <Text>Your appointment has been rescheduled.</Text>

      <AppointmentDetails
        heading="Previous Appointment"
        title={title}
        date={oldDate}
        startTime={oldStartTime}
        endTime={oldEndTime}
      />

      <AppointmentDetails
        heading="New Appointment"
        title={title}
        date={newDate}
        startTime={newStartTime}
        endTime={newEndTime}
      />

      <Text>
        {newDate} | {newStartTime} - {newEndTime}
      </Text>
    </EmailLayout>
  );
}
