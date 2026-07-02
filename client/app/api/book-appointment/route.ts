import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import {
  sendBookingRequestedToHost,
  sendBookingRequestReceivedToGuest,
  sendBookingRescheduledToHost,
  sendBookingRescheduledToGuest,
} from "@/src/lib/email/notifications";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      clientName,
      email,
      title,
      date,
      start_time,
      end_time,
      oldAppointmentId,
    } = await req.json();

    console.log("BOOK REQUEST");
    console.log({
      userId,
      clientName,
      email,
      title,
      date,
      start_time,
      end_time,
      oldAppointmentId,
    });

    if (
      !userId ||
      !clientName ||
      !email ||
      !title ||
      !date ||
      !start_time ||
      !end_time
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    let query = supabaseAdmin
      .from("appointments")
      .select("id,start_time,end_time")
      .eq("user_id", userId)
      .eq("date", date)
      .in("status", ["pending", "scheduled", "completed"]);

    if (oldAppointmentId) {
      query = query.neq("id", oldAppointmentId);
    }

    const {
      data: conflicts,
      error: conflictError,
    } = await query;

    if (conflictError) {
      return NextResponse.json(
        {
          error: conflictError.message,
        },
        {
          status: 500,
        }
      );
    }

    const newStart = toMinutes(start_time);
    const newEnd = toMinutes(end_time);

    const overlapping = (conflicts ?? []).some((appointment) => {
      const existingStart = toMinutes(
        appointment.start_time
      );

      const existingEnd = toMinutes(
        appointment.end_time
      );

      return (
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });

    if (overlapping) {
      return NextResponse.json(
        {
          error:
            "That time slot is no longer available.",
        },
        {
          status: 409,
        }
      );
    }

    const {
      data: newAppointment,
      error: insertError,
    } = await supabaseAdmin
      .from("appointments")
      .insert({
        user_id: userId,
        client_name: clientName,
        email,
        title,
        date,
        start_time,
        end_time,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("INSERT ERROR:", insertError);

      return NextResponse.json(
        {
          error: insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("NEW APPOINTMENT:", newAppointment.id);

    const { data: host, error: hostError } =
      await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

    if (hostError || !host) {
      console.error("HOST FETCH ERROR:", hostError);

      return NextResponse.json(
        {
          error: "Host not found.",
        },
        {
          status: 500,
        }
      );
    }

    const bookingData = {
      host: {
        name: host.full_name,
        email: host.email,
      },
      guest: {
        name: clientName,
        email,
      },
      appointment: {
        title,
        date,
        startTime: start_time,
        endTime: end_time,
      },
    };

    if (!oldAppointmentId) {
      try {
        await Promise.all([
          sendBookingRequestedToHost(bookingData),
          sendBookingRequestReceivedToGuest(bookingData),
        ]);
      } catch (error) {
        console.error(
          "BOOKING REQUEST EMAIL ERROR:",
          error
        );
      }
    }

    interface Appointment {
      id: string;
      title: string;
      date: string;
      start_time: string;
      end_time: string;
      [key: string]: unknown;
    }

    let oldAppointment: Appointment | null = null;

    if (oldAppointmentId) {
      const {
        data,
        error: oldAppointmentError,
      } = await supabaseAdmin
        .from("appointments")
        .select("*")
        .eq("id", oldAppointmentId)
        .single();

      if (oldAppointmentError) {
        console.error(
          "OLD APPOINTMENT FETCH ERROR:",
          oldAppointmentError
        );
      }

      oldAppointment = data;
    }

    if (
      oldAppointmentId &&
      oldAppointmentId !== newAppointment.id
    ) {
      console.log(
        "CANCELLING OLD APPOINTMENT:",
        oldAppointmentId
      );

      const { error: updateError } =
        await supabaseAdmin
          .from("appointments")
          .update({
            status: "cancelled",
          })
          .eq("id", oldAppointmentId);

      if (updateError) {
        console.error(
          "UPDATE ERROR:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "Failed to cancel previous appointment.",
          },
          {
            status: 500,
          }
        );
      }
      if (oldAppointment) {
        const rescheduleData = {
          host: {
            name: host.full_name,
            email: host.email,
          },

          guest: {
            name: clientName,
            email,
          },

          oldAppointment: {
            title: oldAppointment.title,
            date: oldAppointment.date,
            startTime: oldAppointment.start_time,
            endTime: oldAppointment.end_time,
          },

          newAppointment: {
            title,
            date,
            startTime: start_time,
            endTime: end_time,
          },
        };

        try {
          await Promise.all([
            sendBookingRescheduledToHost(
              rescheduleData
            ),
            sendBookingRescheduledToGuest(
              rescheduleData
            ),
          ]);
        } catch (error) {
          console.error(
            "RESCHEDULE EMAIL ERROR:",
            error
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(
      "BOOK APPOINTMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}