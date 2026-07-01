import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";
import { BookingEmailProps } from "../types";
import AppointmentDetails from "./layout/AppointmentDetails";

export default function BookingCancelled({
  clientName,
  title,
  date,
  startTime,
  endTime,
}: BookingEmailProps) {
  return (
    <EmailLayout preview="Appointment cancelled" title="Appointment Cancelled">
      <Text>Hello {clientName},</Text>

      <Text>Your appointment has been cancelled.</Text>

      <AppointmentDetails
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
      />

    </EmailLayout>
  );
}
