"use client";

import { supabase } from "@/src/lib/supabase";

export default function TestPage() {
  async function testConnection() {
    const { data, error } = await supabase.auth.getSession();

    console.log("Data:", data);
    console.log("Error:", error);
  }

  return (
    <button
      onClick={testConnection}
      className="p-4 bg-blue-500 text-white"
    >
      Test Supabase
    </button>
  );
}