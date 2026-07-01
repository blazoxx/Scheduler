import { NextRequest, NextResponse } from "next/server";

import { model } from "@/src/lib/gemini";
import { SCHEDULE_PROMPT } from "@/src/lib/prompt";
import { findBestSlot } from "@/src/lib/aiSlotFinder";
import { getAvailableSlot } from "@/src/lib/slotGenerator";
import { resolveDate } from "@/src/lib/dateResolver";

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const prompt = `
Today's date is ${today}.

${SCHEDULE_PROMPT}

${message}
`;

    console.log("TODAY SENT TO AI:", today);

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    let parsed;
    let slotResult;

    // ---------------- Parse AI ----------------

    try {
      console.log("RAW AI RESPONSE:");
      console.log(response);

      parsed = JSON.parse(
        response
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );

      parsed.date = resolveDate(
        parsed.weekday ?? null,
        parsed.relative ?? null
      );

      delete parsed.weekday;
      delete parsed.relative;

      console.log("RESOLVED DATE:", parsed.date);
      console.log("DAY OF WEEK:", new Date(parsed.date).getDay());

      console.log("JSON PARSED SUCCESSFULLY");
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);

      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          raw: response,
        },
        {
          status: 500,
        }
      );
    }

    // ---------------- Generate Slots ----------------

    try {
      const availableSlots = await getAvailableSlot(
        userId,
        parsed.date,
        parsed.duration
      );

      console.log("USER ID:", userId);
      console.log("DATE:", parsed.date);
      console.log("DURATION:", parsed.duration);
      console.log("AVAILABLE SLOTS:", availableSlots);

      slotResult = findBestSlot(
        availableSlots,
        parsed
      );

      console.log("EARLIEST:", parsed.earliest_time);
      console.log("LATEST:", parsed.latest_time);

    } catch (error) {
      console.error("SLOT GENERATION ERROR:", error);

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unknown slot generation error",
        },
        {
          status: 500,
        }
      );
    }

    console.log("AI OUTPUT:", parsed);
    console.log("SLOT RESULT:", slotResult);

    return NextResponse.json({
      ai: parsed,
      slotResult,
    });

  } catch (error) {
    console.error("AI SCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}