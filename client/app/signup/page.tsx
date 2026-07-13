"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import PageContainer from "@/src/components/layout/PageContainer";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";
import Input from "@/src/components/ui/input";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");

    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (existingUser) {
        setError("Username already exists.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.user) {
        setError("Failed to create account.");
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
        setError(profileError.message);
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <Card className="order-2 overflow-hidden lg:order-1">
            <CardBody className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Create account
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Build your scheduling presence in minutes.
                </h1>
                <p className="text-sm leading-6 text-slate-600">
                  Set up a polished profile, claim a username, and get a premium-looking booking
                  flow without touching the backend.
                </p>
              </div>

              <div className="space-y-4">
                <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <Button onClick={handleSignup} size="lg" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-teal-700 hover:text-teal-800">
                  Log in
                </Link>
              </p>
            </CardBody>
          </Card>

          <section className="order-1 space-y-6 lg:order-2">
            <Badge variant="info">Premium onboarding</Badge>

            <div className="space-y-4">
              <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                A signup flow that looks finished, not functional.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Strong spacing, softer cards, and cleaner affordances make the entire product feel
                more trustworthy from the very first screen.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Simple", "Focused inputs and structure"],
                ["Elegant", "Consistent surface treatment"],
                ["Responsive", "Looks good on desktop and mobile"],
              ].map(([title, description]) => (
                <Card key={title}>
                  <CardBody className="space-y-1 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                      {title}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
