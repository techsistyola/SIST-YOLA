"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

type ClassRow = {
  id: string;
  name: string;
};

type FeeItem = {
  id: string;
  term: string;
  session: string;
  description: string;
  amount: number;
  classes: {
    name: string;
  }[] | null;
};

type PaymentRow = {
  id: string;
  amount: number;
  status: string | null;
  paid_at: string | null;
  students: {
    full_name: string;
    admission_number: string;
  } | null;
};

export default function FeesPage() {
  const supabase = createSupabaseClient();

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingFee, setSavingFee] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fee form state
  const [feeClassId, setFeeClassId] = useState("");
  const [feeTerm, setFeeTerm] = useState("First Term");
  const [feeSession, setFeeSession] = useState("2025/2026");
  const [feeDescription, setFeeDescription] = useState("Tuition");
  const [feeAmount, setFeeAmount] = useState("");

  // Payment form state
  const [studentAdmNo, setStudentAdmNo] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);

    const [classesRes, feeRes, payRes] = await Promise.all([
      supabase.from("classes").select("id, name").order("name"),
      supabase
        .from("fee_items")
        .select("id, term, session, description, amount, classes(name)")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("fee_payments")
        .select(
          "id, amount, status, paid_at, students(full_name, admission_number)"
        )
        .order("paid_at", { ascending: false })
        .limit(20)
    ]);

    if (classesRes.error) {
      setError(classesRes.error.message);
      setLoading(false);
      return;
    }
    if (feeRes.error) {
      setError(feeRes.error.message);
      setLoading(false);
      return;
    }
    if (payRes.error) {
      setError(payRes.error.message);
      setLoading(false);
      return;
    }

    setClasses(classesRes.data || []);
    setFeeItems(feeRes.data || []);
    setPayments(payRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFeeItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeClassId) {
      setError("Please select a class for this fee.");
      return;
    }
    setSavingFee(true);
    setError(null);

    const { error } = await supabase.from("fee_items").insert({
      class_id: feeClassId,
      term: feeTerm,
      session: feeSession,
      description: feeDescription,
      amount: Number(feeAmount)
    });

    if (error) {
      setError(error.message);
      setSavingFee(false);
      return;
    }

    setFeeAmount("");
    await loadData();
    setSavingFee(false);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    setError(null);

    // Find student by admission number
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("admission_number", studentAdmNo.trim())
      .maybeSingle();

    if (studentError) {
      setError(studentError.message);
      setSavingPayment(false);
      return;
    }
    if (!student) {
      setError("No student found with that admission number.");
      setSavingPayment(false);
      return;
    }

    const { error } = await supabase.from("fee_payments").insert({
      student_id: student.id,
      amount: Number(paymentAmount),
      status: "paid",
      paid_at: new Date().toISOString()
    });

    if (error) {
      setError(error.message);
      setSavingPayment(false);
      return;
    }

    setStudentAdmNo("");
    setPaymentAmount("");
    await loadData();
    setSavingPayment(false);
  };

  const totalCollected = payments.reduce(
    (sum, p) => sum + (p.status === "paid" ? Number(p.amount) : 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-sistGreen">
              Fees · SIST Yola
            </h1>
            <p className="text-xs text-gray-500">
              Define fee structure and record payments. Paystack integration
              comes next.
            </p>
          </div>
          <a
            href="/dashboard/admin"
            className="text-xs text-sistGreen underline"
          >
            ← Back to dashboard
          </a>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border border-green-100 rounded-xl p-4 md:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Add fee item</h2>
            <form
              onSubmit={handleAddFeeItem}
              className="grid gap-3 md:grid-cols-5 items-end"
            >
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  required
                  value={feeClassId}
                  onChange={e => setFeeClassId(e.target.value)}
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
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Term
                </label>
                <select
                  value={feeTerm}
                  onChange={e => setFeeTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                >
                  <option>First Term</option>
                  <option>Second Term</option>
                  <option>Third Term</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Session
                </label>
                <input
                  type="text"
                  value={feeSession}
                  onChange={e => setFeeSession(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                  placeholder="2025/2026"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={feeDescription}
                  onChange={e => setFeeDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                  placeholder="Tuition, Feeding, etc."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={feeAmount}
                  onChange={e => setFeeAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                  placeholder="50000"
                />
              </div>
              <div className="md:col-span-5 flex items-center gap-3 mt-1">
                <button
                  type="submit"
                  disabled={savingFee}
                  className="px-4 py-2.5 rounded-lg bg-sistGreen text-white text-xs font-semibold hover:bg-green-800 transition disabled:opacity-60"
                >
                  {savingFee ? "Saving..." : "Add fee item"}
                </button>
                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-1">
                    {error}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white border border-green-100 rounded-xl p-4">
            <h2 className="font-semibold text-sm mb-3">
              Record payment (manual)
            </h2>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student admission number
                </label>
                <input
                  type="text"
                  required
                  value={studentAdmNo}
                  onChange={e => setStudentAdmNo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                  placeholder="e.g. SIST/2026/001"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount paid (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sistGreen focus:border-sistGreen"
                  placeholder="50000"
                />
              </div>
              <button
                type="submit"
                disabled={savingPayment}
                className="w-full px-4 py-2.5 rounded-lg bg-sistGreen text-white text-xs font-semibold hover:bg-green-800 transition disabled:opacity-60"
              >
                {savingPayment ? "Recording..." : "Record payment"}
              </button>
            </form>
            <p className="mt-3 text-[11px] text-gray-500">
              For now, use this to log cash / transfer payments. Paystack
              online payments will be linked later.
            </p>
          </div>
        </section>

        <section className="bg-white border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Recent fee items</h2>
            <p className="text-xs text-sistGreen font-semibold">
              Total collected: ₦{totalCollected.toLocaleString()}
            </p>
          </div>

          {loading ? (
            <p className="text-xs text-gray-500">Loading fees…</p>
          ) : feeItems.length === 0 ? (
            <p className="text-xs text-gray-500">
              No fee items yet. Add at least one fee above.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-xs border border-gray-100 mb-4">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Class</th>
                    <th className="px-3 py-2 text-left border-b">Term</th>
                    <th className="px-3 py-2 text-left border-b">Session</th>
                    <th className="px-3 py-2 text-left border-b">
                      Description
                    </th>
                    <th className="px-3 py-2 text-left border-b">Amount (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  {feeItems.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b">
                        {f.classes && f.classes.length > 0
                          ? f.classes[0].name
                          : "—"}
                      </td>
                      <td className="px-3 py-2 border-b">{f.term}</td>
                      <td className="px-3 py-2 border-b">{f.session}</td>
                      <td className="px-3 py-2 border-b">
                        {f.description}
                      </td>
                      <td className="px-3 py-2 border-b">
                        ₦{Number(f.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3 className="font-semibold text-sm mb-2">Recent payments</h3>
          {loading ? (
            <p className="text-xs text-gray-500">Loading payments…</p>
          ) : payments.length === 0 ? (
            <p className="text-xs text-gray-500">
              No payments recorded yet.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-xs border border-gray-100">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Student</th>
                    <th className="px-3 py-2 text-left border-b">
                      Adm. number
                    </th>
                    <th className="px-3 py-2 text-left border-b">Amount (₦)</th>
                    <th className="px-3 py-2 text-left border-b">Status</th>
                    <th className="px-3 py-2 text-left border-b">
                      Paid at
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b">
                        {p.students?.full_name || "—"}
                      </td>
                      <td className="px-3 py-2 border-b font-mono">
                        {p.students?.admission_number || "—"}
                      </td>
                      <td className="px-3 py-2 border-b">
                        ₦{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border-b capitalize">
                        {p.status || "paid"}
                      </td>
                      <td className="px-3 py-2 border-b">
                        {p.paid_at
                          ? new Date(p.paid_at).toLocaleString()
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
