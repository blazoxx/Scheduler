"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_verified")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      alert("Profile not found.");
      return;
    }

    console.log(profile);

    if (profile.role === "host" && profile.is_verified) {
      router.push("/dashboard");
      return;
    }

    router.push("/my-bookings");
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Login</h1>

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
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
