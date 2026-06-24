import { NextRequest, NextResponse } from "next/server";

import { model } from "@/src/lib/gemini";
import { SCHEDULE_PROMPT } from "@/src/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

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

    try {
      parsed = JSON.parse(
        response.replace(/```json/g, "").replace(/```/g, "")
      );
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          raw: response,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}