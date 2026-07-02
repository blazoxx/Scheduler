import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingRejected({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  return (
    <EmailLayout
      preview="Appointment request declined"
      title="Appointment Declined"
    >
      <Text>Hello {guest.name},</Text>

      <Text>
        Unfortunately your appointment request could not be approved by <strong>{host.name}</strong>.
      </Text>

      <AppointmentDetails
        title={appointment.title}
        date={appointment.date}
        startTime={appointment.startTime}
        endTime={appointment.endTime}
      />
    </EmailLayout>
  );
}
