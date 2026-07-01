import { Text } from "@react-email/components";
import EmailLayout from "./layout/EmailLayout";

interface Props {
  name: string;
}

export default function Welcome({
  name,
}: Props) {
  return (
    <EmailLayout
      preview="Welcome!"
      title="Welcome to AI Scheduler 🎉"
    >
      <Text>Hello {name},</Text>

      <Text>
        Thank you for creating your account.
      </Text>

      <Text>
        You can now:
      </Text>

      <Text>• Create your availability</Text>
      <Text>• Accept appointments</Text>
      <Text>• Manage bookings</Text>
      <Text>• Sync your calendar</Text>

      <Text>
        Welcome aboard!
      </Text>
    </EmailLayout>
  );
}