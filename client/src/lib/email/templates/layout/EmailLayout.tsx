import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export default function EmailLayout({
  preview,
  title,
  children,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "600px",
          }}
        >
          <Heading>{title}</Heading>

          <Section>{children}</Section>

          <Hr />

          <Text
            style={{
              color: "#777",
              fontSize: "12px",
            }}
          >
            AI Appointment Scheduler
          </Text>
        </Container>
      </Body>
    </Html>
  );
}