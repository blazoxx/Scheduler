import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingRequested({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  return (
    <EmailLayout
      preview="You have a new appointment request"
      title="New Appointment Request"
    >
      <Text>Hello {host.name},</Text>

      <Text>
        <strong>{guest.name}</strong> has requested an appointment with you.
      </Text>

      <Text>
        Please review the request from your dashboard.
      </Text>

      <AppointmentDetails
        heading="Appointment Details"
        title={appointment.title}
        date={appointment.date}
        startTime={appointment.startTime}
        endTime={appointment.endTime}
      />

      <Text>
        Guest Email: <strong>{guest.email}</strong>
      </Text>

      <Text>
        You can approve or reject this appointment from your dashboard.
      </Text>
    </EmailLayout>
  );
}