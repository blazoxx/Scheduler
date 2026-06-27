import { NextRequest, NextResponse } from "next/server";

import { model } from "@/src/lib/gemini";
import { SCHEDULE_PROMPT } from "@/src/lib/prompt";
import { findBestSlot } from "@/src/lib/aiSlotFinder";
import { getAvailableSlots } from "@/src/lib/slotGenerator";

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

    const prompt = `
${SCHEDULE_PROMPT}

${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    let parsed;
    let suggestion;

    // ---------- JSON Parsing ----------
    try {
      console.log("RAW AI RESPONSE:");
      console.log(response);

      parsed = JSON.parse(
        response
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
      console.log("PARSED DATE:", parsed.date);
      console.log("JS DAY:", new Date(parsed.date).getDay());

      console.log("JSON PARSED SUCCESSFULLY");
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);

      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          raw: response,
        },
        { status: 500 }
      );
    }

    // ---------- Slot Generation ----------
    try {
      const availableSlots = await getAvailableSlots(
        userId,
        parsed.date,
        parsed.duration
      );

      console.log("USER ID:", userId);
      console.log("DATE:", parsed.date);
      console.log("DURATION:", parsed.duration);
      console.log("AVAILABLE SLOTS:", availableSlots);

      suggestion = findBestSlot(
        availableSlots,
        parsed
      );
    } catch (error) {
      console.error("SLOT GENERATION ERROR:", error);

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unknown slot generation error",
        },
        { status: 500 }
      );
    }

    console.log("AI OUTPUT:", parsed);
    console.log("SUGGESTION:", suggestion);
    console.log("RETURNING:", {
      ai: parsed,
      suggestion,
    });
    return NextResponse.json({
      ai: parsed,
      suggestion,
    });

  } catch (error) {
    console.error("AI SCHEDULE ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}