"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

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
        <div className="text-xs">
          {email ? (
            <span>Signed in as {email}</span>
          ) : (
            <span>Loading user...</span>
          )}
        </div>
      </header>

      <section className="p-6 grid gap-4 max-w-5xl mx-auto">
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
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">
            Next steps
          </h2>
          <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
            <li>Create teacher and parent accounts in Supabase.</li>
            <li>Add classes and students (Module 2).</li>
            <li>Enable fees and result sheets (Modules 3–4).</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
