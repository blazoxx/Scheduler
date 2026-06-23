import Link from "next/link";

type Props = {
  searchParams: Promise<{
    username: string;
    date: string;
    start: string;
    end: string;
    email: string;
  }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { username, date, start, end, email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-8 space-y-4 max-w-md">
        <h1 className="text-3xl font-bold text-green-500">
          ✓ Appointment booked successfully
        </h1>

        <div>
          <strong>Date:</strong> {date}
        </div>

        <div>
          <strong>Time:</strong> {start} - {end}
        </div>

        <div>
          <strong>Email:</strong> {email}
        </div>

        <Link
          href={`/book/${username}`}
          className="block bg-blue-600 px-4 py-2 rounded text-center"
        >
          Book another
        </Link>
      </div>
    </div>
  );
}
