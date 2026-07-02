import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

import {
  sendBookingApproved,
  sendBookingRejected,
} from "@/src/lib/email/notifications";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, status } = await req.json();

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!["scheduled", "rejected"].includes(status)) {
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

    // Update status
    const { error: updateError } = await supabaseAdmin
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Send email
    if (status === "scheduled") {
      await sendBookingApproved(appointment.email, {
        clientName: appointment.client_name,
        clientEmail: appointment.email,
        title: appointment.title,
        date: appointment.date,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
      });
    }

    if (status === "rejected") {
      await sendBookingRejected(appointment.email, {
        clientName: appointment.client_name,
        clientEmail: appointment.email,
        title: appointment.title,
        date: appointment.date,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}