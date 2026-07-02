import { sendEmail } from "./sendEmail";

type SendEmailArgs = Parameters<typeof sendEmail>[0];

export async function safeSendEmail(
  args: SendEmailArgs
): Promise<boolean> {
  try {
    await sendEmail(args);

    console.log(`✅ Email sent to ${args.to}`);

    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${args.to}`, error);

    return false;
  }
}