import { ReactElement } from "react";
import { resend } from "./resend";

interface SendEmailProps {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      react,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
}