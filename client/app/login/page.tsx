"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { updateUserTimezone } from "@/src/lib/profile/updateTimezone";
import PageContainer from "@/src/components/layout/PageContainer";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";
import Input from "@/src/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const user = data.user;

      await updateUserTimezone(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_verified")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        setError("Profile not found.");
        return;
      }

      if (profile.role === "host" && profile.is_verified) {
        router.push("/dashboard");
        return;
      }

      router.push("/my-bookings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <Badge variant="info">Secure access</Badge>

            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Welcome back to a calmer booking experience.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Sign in to manage availability, review appointments, and keep the scheduler feeling
                polished from the first click.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Fast", "Clean login flow"],
                ["Private", "Protected dashboard access"],
                ["Consistent", "Matches the rest of the app"],
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

          <Card className="overflow-hidden">
            <CardBody className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Sign in
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Enter your account
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Continue to your dashboard or personal bookings area.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <Button onClick={handleLogin} size="lg" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </div>

              <p className="text-center text-sm text-slate-600">
                No account yet?{" "}
                <Link href="/signup" className="font-medium text-teal-700 hover:text-teal-800">
                  Create one
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    </main>
  );
}
