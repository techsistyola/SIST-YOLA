"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AdminDashboard() {
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-sistGreen text-white py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">
            SIST Yola · Admin Dashboard
          </h1>
          <p className="text-xs text-green-100">
            Smart Islamic Science &amp; Technology, Yola
          </p>
        </div>
        <div className="text-xs flex flex-col items-end gap-1">
          <span>{email ? `Signed in as ${email}` : "Loading user..."}</span>
          <Link
            href="/"
            className="underline text-green-100 hover:text-white text-[11px]"
          >
            Back to home
          </Link>
        </div>
      </header>

      <section className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border border-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-sistGreen">0</p>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Teachers</p>
            <p className="text-2xl font-bold text-sistGreen">0</p>
          </div>
          <div className="bg-white border border-green-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">Fees Collected (₦)</p>
            <p className="text-2xl font-bold text-sistGreen">0.00</p>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-4">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">
            Quick navigation
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/dashboard/admin/students"
              className="px-3 py-1.5 rounded-lg border border-sistGreen text-sistGreen hover:bg-sistGreen hover:text-white transition"
            >
              Manage Students
            </Link>
            <span className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-500 cursor-not-allowed">
              Fees (coming soon)
            </span>
            <span className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-500 cursor-not-allowed">
              Results (coming soon)
            </span>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-xl p-4">
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">
            Next steps
          </h2>
          <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
            <li>Use “Manage Students” to add your first class list.</li>
            <li>Later, set up fees and payments for each class.</li>
            <li>Then enable online results and AI tools.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
