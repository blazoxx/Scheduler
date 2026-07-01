import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

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
    } = await req.json();

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

    const {
      data: conflicts,
      error: conflictError,
    } = await supabaseAdmin
      .from("appointments")
      .select("id,start_time,end_time")
      .eq("user_id", userId)
      .eq("date", date)
      .in("status", [
        "pending",
        "scheduled",
        "completed",
      ]);

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

    const overlapping = (conflicts ?? []).some(
      (appointment) => {
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
      }
    );

    if (overlapping) {
      return NextResponse.json(
        {
          error:
            "That time slot is no longer available. Please choose another available slot.",
        },
        {
          status: 409,
        }
      );
    }

    console.log({
      userId,
      clientName,
      email,
      title,
      date,
      start_time,
      end_time,
    });

    const { data, error } = await supabaseAdmin
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

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: data,
    });
  } catch (error) {
    console.error("BOOK APPOINTMENT ERROR:", error);

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