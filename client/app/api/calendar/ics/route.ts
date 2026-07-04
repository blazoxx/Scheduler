import { NextRequest } from "next/server";

import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import { verifyCalendarJWT } from "@/src/lib/calendar/jwt";
import { generateICS } from "@/src/lib/calendar/ics";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return new Response("Missing token", {
        status: 400,
      });
    }

    const { appointmentId } =
      await verifyCalendarJWT(token);

    const {
      data: appointment,
      error,
    } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (error || !appointment) {
      return new Response(
        "Appointment not found",
        {
          status: 404,
        }
      );
    }

    const ics = generateICS({
      title: appointment.title,
      description: `Meeting Link: ${
        appointment.meeting_link ?? ""
      }`,
      location:
        appointment.meeting_link ?? "",
      start: new Date(
        `${appointment.date}T${appointment.start_time}`
      ),
      end: new Date(
        `${appointment.date}T${appointment.end_time}`
      ),
    });

    return new Response(ics, {
      headers: {
        "Content-Type":
          "text/calendar; charset=utf-8",

        "Content-Disposition":
          'attachment; filename="appointment.ics"',

        "Cache-Control":
          "no-store",
      },
    });

  } catch (err) {
  console.error("ICS ROUTE ERROR:", err);

  return Response.json(
    {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
    {
      status: 500,
    }
  );
}
}