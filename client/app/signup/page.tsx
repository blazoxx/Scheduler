"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignup() {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      alert("Username already exists.");
      return;
    }

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

    if (!data.user) {
      alert("Failed to create account.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      full_name: fullName,
      email,
      role: "guest",
      is_verified: true,
    });

    if (profileError) {
      alert(profileError.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 rounded"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
      >
        Create Account
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
