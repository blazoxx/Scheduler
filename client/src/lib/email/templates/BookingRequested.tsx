import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";
import { BookingEmailProps } from "../types";

export default function BookingRequested({
  hostName,
  clientName,
  clientEmail,
  title,
  date,
  startTime,
  endTime,
}: BookingEmailProps) {
  return (
    <EmailLayout
      preview="You have a new appointment request"
      title="New Appointment Request"
    >
      <Text>Hello {hostName},</Text>

      <Text>
        You have received a new appointment request.
      </Text>

      <Text>
        <strong>Client:</strong> {clientName}
      </Text>

      <Text>
        <strong>Email:</strong> {clientEmail}
      </Text>

      <Text>
        <strong>Title:</strong> {title}
      </Text>

      <Text>
        <strong>Date:</strong> {date}
      </Text>

      <Text>
        <strong>Time:</strong> {startTime} - {endTime}
      </Text>

      <Text>
        Please review this request from your dashboard.
      </Text>
    </EmailLayout>
  );
}