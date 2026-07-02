import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingCancelled({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  return (
    <EmailLayout preview="Appointment cancelled" title="Appointment Cancelled">
      <Text>Hello {guest.name},</Text>

      <Text>
        Your appointment with <strong>{host.name}</strong> has been cancelled.
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
