"use client";

import Link from "next/link";

export default function HomePage() {
  const schoolName =
    process.env.NEXT_PUBLIC_SCHOOL_NAME ||
    "Smart Islamic Science & Technology, Yola";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8 border border-green-700/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-sistGreen flex items-center justify-center text-sistGreen font-bold text-3xl">
            SIST
          </div>
          <h1 className="text-2xl font-bold text-center text-sistGreen">
            {schoolName}
          </h1>
          <p className="text-center text-sm text-gray-600">
            School Management System · Nursery &amp; Primary · Islamic &amp;
            Science Focus
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          <Link
            href="/auth/admin"
            className="block text-center bg-sistGreen text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Admin / Principal Login
          </Link>
          <Link
            href="/auth/teacher"
            className="block text-center border border-sistGreen text-sistGreen py-2.5 rounded-lg font-semibold hover:bg-sistGreen hover:text-white transition"
          >
            Teacher Login
          </Link>
          <Link
            href="/auth/parent"
            className="block text-center border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:border-sistGreen hover:text-sistGreen transition"
          >
            Parent / Guardian Login
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-gray-400">
          Powered by SIST EduCloud · v0.1
        </p>
      </div>
    </main>
  );
}
