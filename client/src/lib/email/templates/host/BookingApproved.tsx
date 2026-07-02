import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingApproved({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  return (
    <EmailLayout
      preview="Your appointment has been approved"
      title="Appointment Confirmed 🎉"
    >
      <Text>Hello {host.name},</Text>

      <Text>
        Your appointment with <strong>{guest.name}</strong> has been approved.
      </Text>

      <AppointmentDetails
        title={appointment.title}
        date={appointment.date}
        startTime={appointment.startTime}
        endTime={appointment.endTime}
      />

      {appointment.meetingLink && (
        <Text>
          <strong>Meeting Link:</strong> {appointment.meetingLink}
        </Text>
      )}

      <Text>We look forward to seeing you!</Text>
    </EmailLayout>
  );
}
