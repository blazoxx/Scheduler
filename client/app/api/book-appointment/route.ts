import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      clientName,
      email,
      suggestion,
    } = await req.json();

    if (
      !userId ||
      !clientName ||
      !email ||
      !suggestion
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

    const { error } = await supabaseAdmin
      .from("appointments")
      .insert({
        user_id: userId,
        client_name: clientName,
        email,
        title: suggestion.title,
        date: suggestion.date,
        start_time: suggestion.start_time,
        end_time: suggestion.end_time,
        status: "scheduled",
      });

    if (error) {
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
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}