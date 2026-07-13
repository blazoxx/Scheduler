import {
  createCalendarJWT,
  verifyCalendarJWT,
} from "@/src/lib/calendar/jwt";

async function main() {
  const token = await createCalendarJWT("appointment-123");

  console.log("Token:");
  console.log(token);

  const payload = await verifyCalendarJWT(token);

  console.log("Payload:");
  console.log(payload);
}

main();