"use client";

import { useEffect, useState } from "react";

type Props = {
  username: string;
};

export default function BookingLinkCard({
  username,
}: Props) {

  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(`${window.location.origin}/book/${username}`);
  }, [username]);

  async function copyLink() {
    await navigator.clipboard.writeText(link);
  }

  return (
    <div className="border rounded-xl p-6">

      <h2 className="text-xl font-bold">
        Your Booking Link
      </h2>

      <p className="mt-2 break-all">
        {link}
      </p>

      <button
        onClick={copyLink}
        className="mt-4 bg-blue-600 px-4 py-2 rounded"
      >
        Copy
      </button>

    </div>
  );
}