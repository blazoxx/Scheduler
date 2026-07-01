"use client";

import { useState } from "react";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  function handleSignup() {
    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log({
      fullName,
      username,
      email,
      password,
    });
  }

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={handleSignup}
          className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}