import { NextResponse } from "next/server";
import {
  createCalendarJWT,
  verifyCalendarJWT,
} from "@/src/lib/calendar/jwt";

export async function GET() {
  const token = await createCalendarJWT("appointment-123");

  const payload = await verifyCalendarJWT(token);

  return NextResponse.json({
    token,
    payload,
  });
}