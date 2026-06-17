"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((res) => setMsg(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">
        {msg}
      </h1>
    </main>
  );
}