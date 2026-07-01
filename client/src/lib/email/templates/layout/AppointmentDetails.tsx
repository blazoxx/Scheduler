import { Section, Text } from "@react-email/components";

interface Props {
  heading?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function AppointmentDetails({
  heading,
  title,
  date,
  startTime,
  endTime,
}: Props) {
  return (
    <Section
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "24px",
        backgroundColor: "#F9FAFB",
        margin: "24px 0",
      }}
    >
      {heading && (
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          {heading}
        </Text>
      )}

      <Text style={{ color: "#6B7280" }}>
        <strong>Title:</strong> {title}
      </Text>

      <Text style={{ color: "#6B7280" }}>
        <strong>Date:</strong> {date}
      </Text>

      <Text style={{ color: "#6B7280" }}>
        <strong>Time:</strong> {startTime} - {endTime}
      </Text>
    </Section>
  );
}