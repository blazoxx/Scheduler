import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlot } from "@/src/lib/slotGenerator";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      date,
      duration,
    } = await req.json();

    if (!userId || !date) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlot(
      userId,
      date,
      duration ?? 30
    );

    return NextResponse.json({
      slots,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load slots",
      },
      {
        status: 500,
      }
    );
  }
}