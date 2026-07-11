import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

import {
  sendBookingApprovedToGuest,
  sendBookingApprovedToHost,
  sendBookingRejectedToGuest,
  sendBookingRejectedToHost,
  sendBookingCancelledToGuest,
  sendBookingCancelledToHost,
} from "@/src/lib/email/notifications";

export async function POST(req: NextRequest) {
  try {
    const {
      appointmentId,
      status,
      meetingLink,
    } = await req.json();

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (
      ![
        "scheduled",
        "rejected",
        "cancelled",
        "completed",
      ].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    // Fetch appointment
    const {
      data: appointment,
      error: fetchError,
    } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    const { data: host, error: hostError } =
      await supabaseAdmin
        .from("profiles")
        .select("full_name, email, timezone")
        .eq("id", appointment.user_id)
        .single();

    if (hostError || !host) {
      return NextResponse.json(
        { error: "Host not found." },
        { status: 500 }
      );
    }

    // Update status
    const { error: updateError } = await supabaseAdmin
      .from("appointments")
      .update({
        status,
        meeting_link: meetingLink,
      })
      .eq("id", appointmentId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const bookingData = {
      host: {
        name: host.full_name,
        email: host.email,
        timezone: host.timezone,
      },
      guest: {
        name: appointment.client_name,
        email: appointment.email,
      },
      appointment: {
        id: appointment.id,
        title: appointment.title,
        date: appointment.date,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        meetingLink: meetingLink,
      }
    };

    console.log(
      `Updating appointment ${appointmentId} -> ${status}`
    );

    // Send email
    switch (status) {
      case "scheduled":
        await Promise.all([
          sendBookingApprovedToHost(bookingData),
          sendBookingApprovedToGuest(bookingData),
        ]);
        break;

      case "rejected":
        await Promise.all([
          sendBookingRejectedToHost(bookingData),
          sendBookingRejectedToGuest(bookingData),
        ]);
        break;

      case "cancelled":
        await Promise.all([
          sendBookingCancelledToHost(bookingData),
          sendBookingCancelledToGuest(bookingData),
        ]);
        break;

      case "completed":
        break;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "UPDATE APPOINTMENT ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}