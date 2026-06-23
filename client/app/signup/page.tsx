"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    console.log("Email:", email);
    console.log("Password:", password);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log(data);
    console.log(error);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-green-500 text-white p-2 rounded"
      >
        Sign Up
      </button>
    </div>
  );
}
