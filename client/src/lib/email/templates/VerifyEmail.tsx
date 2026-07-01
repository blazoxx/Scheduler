import { Button, Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";

interface Props {
  name: string;
  verifyUrl: string;
}

export default function VerifyEmail({
  name,
  verifyUrl,
}: Props) {
  return (
    <EmailLayout
      preview="Verify your email"
      title="Verify Your Email"
    >
      <Text>Hello {name},</Text>

      <Text>
        Please verify your email address to activate your account.
      </Text>

      <Button href={verifyUrl}>
        Verify Email
      </Button>
    </EmailLayout>
  );
}