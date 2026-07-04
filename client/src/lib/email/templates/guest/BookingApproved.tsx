import { Text, Button } from "@react-email/components";

import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";

import { BookingEmailData } from "../../types";

import { generateGoogleCalendarLink } from "@/src/lib/calendar/google";

export default function BookingApproved({
  host,
  guest,
  appointment,
}: BookingEmailData) {
  const googleCalendarLink = generateGoogleCalendarLink({
    title: appointment.title,
    description: `Appointment with ${host.name}`,
    location: appointment.meetingLink || "To be announced",
    start: new Date(`${appointment.date}T${appointment.startTime}`),
    end: new Date(`${appointment.date}T${appointment.endTime}`),
  });
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

      <Button
        href={googleCalendarLink}
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
          marginTop: "20px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        📅 Add to Google Calendar
      </Button>

      <Text>We look forward to your meeting.</Text>
    </EmailLayout>
  );
}
