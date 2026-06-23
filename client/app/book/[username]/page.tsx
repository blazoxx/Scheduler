import { notFound } from "next/navigation";
import { getUserByUsername } from "@/src/lib/profile";

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
      <h1>{profile.full_name}</h1>
      <p>@{profile.username}</p>
    </div>
  );
}