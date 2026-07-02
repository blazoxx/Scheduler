import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";
import { BookingEmailProps } from "../types";
import AppointmentDetails from "./layout/AppointmentDetails";
import { BookingEmailData } from "../../types";

export default function BookingApproved({
  clientName,
  title,
  date,
  startTime,
  endTime,
  meetingLink,
}: BookingEmailProps) {
  return (
    <EmailLayout
      preview="Your appointment has been approved"
      title="Appointment Confirmed 🎉"
    >
      <Text>Hello {clientName},</Text>

      <Text>Your appointment has been approved.</Text>

      <AppointmentDetails
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
      />

      {meetingLink && (
        <Text>
          <strong>Meeting Link:</strong> {meetingLink}
        </Text>
      )}

      <Text>We look forward to seeing you!</Text>
    </EmailLayout>
  );
}
