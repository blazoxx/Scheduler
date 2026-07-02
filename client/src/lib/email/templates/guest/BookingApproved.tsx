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
      <Text>Hello {guest.name},</Text>

      <Text>
        Great news! <strong>{host.name}</strong> has approved your appointment.
      </Text>

      <AppointmentDetails
        heading="Confirmed Appointment"
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

      <Text>We look forward to your meeting.</Text>
    </EmailLayout>
  );
}