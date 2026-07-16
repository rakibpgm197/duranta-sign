"use client";

import { useState, useEffect, useCallback } from "react";

interface Transaction {
  id: number;
  type: string;
  category: string | null;
  amount: string;
  description: string | null;
  transactionDate: string;
}

interface Summary {
  income: number;
  expense: number;
  profit: number;
}

const categories = {
  income: ["ব্যানার বিক্রয়", "ভিজিটিং কার্ড", "আইডি কার্ড", "মগ প্রিন্ট", "গেঞ্জি প্রিন্ট", "পোস্টার", "সার্টিফিকেট", "বিয়ের কার্ড", "স্টিকার", "ক্রেস্ট", "ক্যাশমেমো", "বাকি আদায়", "অন্যান্য আয়"],
  expense: ["কাগজ/মালামাল ক্রয়", "কালি/ইঙ্ক", "বেতন", "বিদ্যুৎ বিল", "ভাড়া", "পরিবহন", "মেশিন রক্ষণাবেক্ষণ", "অন্যান্য ব্যয়"],
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, profit: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat("bn-BD").format(Math.abs(n)) + " ৳";

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      const res = await fetch(`/api/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(data.summary || { income: 0, expense: 0, profit: 0 });
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      setForm({ type: "income", category: "", amount: "", description: "", transactionDate: new Date().toISOString().split("T")[0] });
      setShowAddModal(false);
      fetchTransactions();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই লেনদেন মুছবেন?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">মোট আয়</div>
          <div className="text-2xl font-bold text-green-600">{fmt(summary.income)}</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">মোট ব্যয়</div>
          <div className="text-2xl font-bold text-red-600">{fmt(summary.expense)}</div>
        </div>
        <div className={`${summary.profit >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"} border rounded-2xl p-5`}>
          <div className="text-slate-500 text-sm mb-1">নেট মুনাফা</div>
          <div className={`text-2xl font-bold ${summary.profit >= 0 ? "text-blue-600" : "text-orange-600"}`}>
            {summary.profit >= 0 ? "" : "-"}{fmt(summary.profit)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-40">
          <label className="block text-xs text-slate-500 mb-1">শুরুর তারিখ</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-xs text-slate-500 mb-1">শেষের তারিখ</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <button
          onClick={() => { setDateFrom(""); setDateTo(""); }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
        >
          রিসেট
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 gradient-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 shadow-md whitespace-nowrap"
        >
          ➕ নতুন এন্ট্রি
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">তারিখ</th>
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">ধরন</th>
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">বিবরণ</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">পরিমাণ</th>
                <th className="text-center px-5 py-4 text-sm font-bold text-slate-600">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="h-8 rounded shimmer" /></td></tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <div className="text-4xl mb-2">📊</div>
                    কোনো লেনদেন নেই
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-500">
                      {new Date(t.transactionDate).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {t.type === "income" ? "📈 আয়" : "📉 ব্যয়"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-slate-700">{t.description || "—"}</div>
                      {t.category && <div className="text-xs text-slate-400">{t.category}</div>}
                    </td>
                    <td className={`px-5 py-3 text-right font-bold text-sm ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "income" ? "+" : "-"}{fmt(parseFloat(t.amount))}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-400 hover:text-red-600 text-sm px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        মুছুন
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-5">➕ নতুন লেনদেন</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-3">
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t, category: "" })}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      form.type === t
                        ? t === "income" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t === "income" ? "📈 আয়" : "📉 ব্যয়"}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">ক্যাটাগরি</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">নির্বাচন করুন</option>
                  {categories[form.type as "income" | "expense"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">পরিমাণ (টাকায়) *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">বিবরণ</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="লেনদেনের বিবরণ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">তারিখ</label>
                <input
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "সংরক্ষণ..." : "✅ সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
