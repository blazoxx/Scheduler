export const SCHEDULE_PROMPT = `
You are an appointment scheduling assistant.

Extract information from the user request.

Return ONLY valid JSON.

Format:

{
  "title": "",
  "duration": 30,
  "date": "YYYY-MM-DD",
  "preferred_period": "morning|afternoon|evening"
}

If title isn't mentioned use "Meeting".

User request:
`;