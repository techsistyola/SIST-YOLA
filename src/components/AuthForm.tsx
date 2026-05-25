"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Role = "admin" | "teacher" | "parent";

interface AuthFormProps {
  role: Role;
}

const roleLabels: Record<Role, string> = {
  admin: "Administrator / Principal",
  teacher: "Teacher",
  parent: "Parent / Guardian"
};

export default function AuthForm({ role }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // In a real app we would check profile.role from Supabase
    // For now we route based on role page
    if (role === "admin") router.push("/dashboard/admin");
    if (role === "teacher") router.push("/dashboard/teacher");
    if (role === "parent") router.push("/dashboard/parent");
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-sistGreen/40">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-sistGreen flex items-center justify-center text-sistGreen font-bold text-2xl">
          SIST
        </div>
        <h1 className="text-lg font-bold text-sistGreen">
          SIST Yola School System
        </h1>
        <p className="text-sm text-gray-600">
          {roleLabels[role]} Login
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
            placeholder="********"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sistGreen text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Use the email and password you created in Supabase for the admin.
      </p>
    </div>
  );
}
