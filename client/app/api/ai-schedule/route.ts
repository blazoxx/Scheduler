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

        try {
            parsed = JSON.parse(
                response
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim()
            );

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

        } catch {
            return NextResponse.json(
                {
                    error: "Failed to parse AI response",
                    raw: response,
                },
                { status: 500 }
            );
        }

        console.log("AI OUTPUT:", parsed);
        console.log("SUGGESTION:", suggestion);

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