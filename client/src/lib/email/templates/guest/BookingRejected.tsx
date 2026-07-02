import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";
import { BookingEmailProps } from "../types";
import AppointmentDetails from "./layout/AppointmentDetails";

export default function BookingRejected({
  clientName,
  title,
  date,
  startTime,
  endTime,
  reason,
}: BookingEmailProps) {
  return (
    <EmailLayout
      preview="Appointment request declined"
      title="Appointment Declined"
    >
      <Text>Hello {clientName},</Text>

      <Text>Unfortunately your appointment request could not be approved.</Text>

      <AppointmentDetails
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
      />

      {reason && (
        <Text>
          <strong>Reason:</strong> {reason}
        </Text>
      )}
    </EmailLayout>
  );
}
