import { NextResponse } from "next/server";
import {
  createCalendarJWT,
  verifyCalendarJWT,
} from "@/src/lib/calendar/jwt";

export async function GET() {
  const token = await createCalendarJWT(
    "c44b4958-2d1c-4604-b875-795651d27ad6"
  );

  const payload = await verifyCalendarJWT(token);

  return NextResponse.json({
    token,
    payload,
  });
}