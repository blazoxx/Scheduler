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
  } catch {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{profile.full_name}</h1>
      <p className="text-gray-500">@{profile.username}</p>
      <BookingCalendar userId={profile.id} />
    </div>
  );
}
