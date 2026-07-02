import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingRequestReceived({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  return (
    <EmailLayout
      preview="Your appointment request has been received"
      title="Appointment Request Received"
    >
      <Text>Hello {guest.name},</Text>

      <Text>
        Your appointment request has been successfully sent to{" "}
        <strong>{host.name}</strong>.
      </Text>

      <Text>
        The host will review your request and you'll receive another email once
        it has been approved or declined.
      </Text>

      <AppointmentDetails
        heading="Requested Appointment"
        title={appointment.title}
        date={appointment.date}
        startTime={appointment.startTime}
        endTime={appointment.endTime}
      />

      <Text>
        Thank you for using our scheduling platform.
      </Text>
    </EmailLayout>
  );
}