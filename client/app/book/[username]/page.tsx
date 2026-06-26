import { notFound } from "next/navigation";
import { getUserByUsername } from "@/src/lib/profile";
import BookingCalendar from "@/src/components/BookingCalendar";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let profile: Awaited<ReturnType<typeof getUserByUsername>>;

  try {
    profile = await getUserByUsername(username);
  } catch (err) {
    console.error("PAGE ERROR:", err);
    throw err;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">{profile.full_name}</h1>

        <p className="text-gray-400">@{profile.username}</p>
      </div>

      <BookingCalendar userId={profile.id} username={profile.username} />
    </div>
  );
}
