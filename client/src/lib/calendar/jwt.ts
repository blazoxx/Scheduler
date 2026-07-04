import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.CALENDAR_TOKEN_SECRET
);

if (!process.env.CALENDAR_TOKEN_SECRET) {
  throw new Error("Missing CALENDAR_TOKEN_SECRET");
}

export async function createCalendarJWT(
  appointmentId: string
) {
  return await new SignJWT({
    appointmentId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyCalendarJWT(
  token: string
) {
  const { payload } = await jwtVerify(
    token,
    secret
  );

  return payload as {
    appointmentId: string;
  };
}