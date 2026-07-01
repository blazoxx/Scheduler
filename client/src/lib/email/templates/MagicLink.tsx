import { Button, Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";

interface Props {
  name: string;
  loginUrl: string;
}

export default function MagicLink({
  name,
  loginUrl,
}: Props) {
  return (
    <EmailLayout
      preview="Sign in"
      title="Magic Login Link"
    >
      <Text>Hello {name},</Text>

      <Text>
        Click the button below to securely sign in.
      </Text>

      <Button href={loginUrl}>
        Sign In
      </Button>

      <Text>This link expires in 15 minutes.</Text>
    </EmailLayout>
  );
}