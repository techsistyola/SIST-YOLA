"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

type ClassRow = {
  id: string;
  name: string;
};

type StudentRow = {
  id: string;
  admission_number: string;
  full_name: string;
  status: string | null;
  enrolled_at: string | null;
  classes: {
    name: string;
  }[] | null;
};

export default function StudentsPage() {
  const supabase = createSupabaseClient();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [admissionNumber, setAdmissionNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [classId, setClassId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const [classesRes, studentsRes] = await Promise.all([
      supabase.from("classes").select("id, name").order("name"),
      supabase
        .from("students")
        .select(
          "id, admission_number, full_name, status, enrolled_at, classes(name)"
        )
        .order("admission_number", { ascending: true })
    ]);

    if (classesRes.error) {
      setError(classesRes.error.message);
      setLoading(false);
      return;
    }
    if (studentsRes.error) {
      setError(studentsRes.error.message);
      setLoading(false);
      return;
    }

    setClasses(classesRes.data || []);
    setStudents(studentsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) {
      setError("Please select a class");
      return;
    }
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("students").insert({
      admission_number: admissionNumber,
      full_name: fullName,
      class_id: classId,
      status: "active"
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setAdmissionNumber("");
    setFullName("");
    setClassId("");
    await loadData();
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-sistGreen">
              Students · SIST Yola
            </h1>
            <p className="text-xs text-gray-500">
              Add and manage pupils across Nursery and Primary classes.
            </p>
          </div>
          <a
            href="/dashboard/admin"
            className="text-xs text-sistGreen underline"
          >
            ← Back to dashboard
          </a>
        </div>

        <section className="bg-white border border-green-100 rounded-xl p-4">
          <h2 className="font-semibold text-sm mb-3">Add new student</h2>
          <form
            onSubmit={handleAddStudent}
            className="grid gap-3 md:grid-cols-4 items-end"
          >
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Admission number
              </label>
              <input
                type="text"
                required
                value={admissionNumber}
                onChange={e => setAdmissionNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                placeholder="e.g. SIST/2026/001"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                placeholder="Child's full name"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                required
                value={classId}
                onChange={e => setClassId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
              >
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2.5 rounded-lg bg-sistGreen text-white text-xs font-semibold hover:bg-green-800 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add student"}
              </button>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-1">
                  {error}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white border border-green-100 rounded-xl p-4">
          <h2 className="font-semibold text-sm mb-3">
            Students list ({students.length})
          </h2>

          {loading ? (
            <p className="text-xs text-gray-500">Loading students…</p>
          ) : students.length === 0 ? (
            <p className="text-xs text-gray-500">
              No students yet. Use the form above to add your first pupil.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-xs border border-gray-100">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Adm. No</th>
                    <th className="px-3 py-2 text-left border-b">Name</th>
                    <th className="px-3 py-2 text-left border-b">Class</th>
                    <th className="px-3 py-2 text-left border-b">Status</th>
                    <th className="px-3 py-2 text-left border-b">
                      Enrolled at
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b font-mono">
                        {s.admission_number}
                      </td>
                      <td className="px-3 py-2 border-b">{s.full_name}</td>
                      <td className="px-3 py-2 border-b">
                        {s.classes && s.classes.length > 0 ? s.classes[0].name : "—"}
                      </td>
                      <td className="px-3 py-2 border-b capitalize">
                        {s.status || "active"}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {s.enrolled_at
                          ? new Date(s.enrolled_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
