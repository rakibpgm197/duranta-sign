"use client";

import { useState, useEffect, useCallback } from "react";

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  totalDue: string | null;
  totalPaid: string | null;
  notes: string | null;
  createdAt: string;
}

interface Payment {
  id: number;
  amount: string;
  note: string | null;
  paidAt: string;
}

interface DueEntry {
  id: number;
  amount: string;
  description: string | null;
  dueDate: string | null;
  createdAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetail, setCustomerDetail] = useState<{ payments: Payment[]; dueEntries: DueEntry[] } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [dueDesc, setDueDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<"payments" | "dues" | "add">("add");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    totalDue: "",
    notes: "",
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat("bn-BD").format(n) + " ৳";

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      setCustomers(data.customers || []);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openDetail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
    setActiveDetailTab("add");
    const res = await fetch(`/api/customers/${customer.id}`);
    const data = await res.json();
    setCustomerDetail({ payments: data.payments, dueEntries: data.dueEntries });
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCustomer,
          totalDue: parseFloat(newCustomer.totalDue) || 0,
        }),
      });
      setNewCustomer({ name: "", phone: "", totalDue: "", notes: "" });
      setShowAddModal(false);
      fetchCustomers();
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedCustomer || !paymentAmount) return;
    setSubmitting(true);
    try {
      await fetch(`/api/customers/${selectedCustomer.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(paymentAmount), note: paymentNote }),
      });
      setPaymentAmount("");
      setPaymentNote("");
      const res = await fetch(`/api/customers/${selectedCustomer.id}`);
      const data = await res.json();
      setSelectedCustomer(data.customer);
      setCustomerDetail({ payments: data.payments, dueEntries: data.dueEntries });
      fetchCustomers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDue = async () => {
    if (!selectedCustomer || !dueAmount) return;
    setSubmitting(true);
    try {
      await fetch(`/api/customers/${selectedCustomer.id}/due`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(dueAmount),
          description: dueDesc,
          dueDate: dueDate || null,
        }),
      });
      setDueAmount("");
      setDueDesc("");
      setDueDate("");
      const res = await fetch(`/api/customers/${selectedCustomer.id}`);
      const data = await res.json();
      setSelectedCustomer(data.customer);
      setCustomerDetail({ payments: data.payments, dueEntries: data.dueEntries });
      fetchCustomers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই গ্রাহককে নিষ্ক্রিয় করবেন?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  const totalDueAll = customers.reduce((s, c) => s + parseFloat(c.totalDue || "0"), 0);
  const totalPaidAll = customers.reduce((s, c) => s + parseFloat(c.totalPaid || "0"), 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">মোট বাকি</div>
          <div className="text-2xl font-bold text-red-600">{fmt(totalDueAll)}</div>
          <div className="text-xs text-slate-400 mt-1">{customers.length} জন গ্রাহক</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">মোট আদায়</div>
          <div className="text-2xl font-bold text-green-600">{fmt(totalPaidAll)}</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">বাকিদারের সংখ্যা</div>
          <div className="text-2xl font-bold text-blue-600">
            {customers.filter((c) => parseFloat(c.totalDue || "0") > 0).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">বাকি আছে এমন</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          ➕ নতুন গ্রাহক
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">#</th>
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">নাম</th>
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">ফোন</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">মোট বাকি</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">মোট পরিশোধ</th>
                <th className="text-center px-5 py-4 text-sm font-bold text-slate-600">অবস্থা</th>
                <th className="text-center px-5 py-4 text-sm font-bold text-slate-600">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-3">
                      <div className="h-8 rounded-lg shimmer" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="text-4xl mb-2">👥</div>
                    কোনো গ্রাহক পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => {
                  const due = parseFloat(c.totalDue || "0");
                  const paid = parseFloat(c.totalPaid || "0");
                  return (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-slate-400 text-sm">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{c.name}</div>
                            {c.notes && <div className="text-xs text-slate-400 truncate max-w-32">{c.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {c.phone ? (
                          <a href={`tel:${c.phone}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            {c.phone}
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-bold text-sm ${due > 0 ? "text-red-600" : "text-slate-400"}`}>
                          {fmt(due)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-green-600 font-semibold text-sm">{fmt(paid)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          due <= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {due <= 0 ? "✅ পরিশোধ" : "⚠️ বাকি"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetail(c)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            বিস্তারিত
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                          >
                            মুছুন
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-5">➕ নতুন গ্রাহক যোগ করুন</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">নাম *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="গ্রাহকের নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">প্রাথমিক বাকি (টাকা)</label>
                <input
                  type="number"
                  value={newCustomer.totalDue}
                  onChange={(e) => setNewCustomer({ ...newCustomer, totalDue: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">নোট</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                  placeholder="যেকোনো টীকা..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? "যোগ হচ্ছে..." : "✅ যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="gradient-primary p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{selectedCustomer.name}</div>
                    <div className="text-blue-200 text-sm">{selectedCustomer.phone || "ফোন নেই"}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setShowDetailModal(false); setCustomerDetail(null); }}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-blue-200 text-xs">মোট বাকি</div>
                  <div className="text-xl font-bold text-red-300">{fmt(parseFloat(selectedCustomer.totalDue || "0"))}</div>
                </div>
                <div>
                  <div className="text-blue-200 text-xs">মোট পরিশোধ</div>
                  <div className="text-xl font-bold text-green-300">{fmt(parseFloat(selectedCustomer.totalPaid || "0"))}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {[
                { id: "add", label: "লেনদেন যোগ করুন" },
                { id: "payments", label: "পরিশোধের ইতিহাস" },
                { id: "dues", label: "বাকির ইতিহাস" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id as "payments" | "dues" | "add")}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${
                    activeDetailTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {activeDetailTab === "add" && (
                <div className="space-y-6">
                  {/* Record Payment */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">✅ পরিশোধ রেকর্ড করুন</h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="পরিমাণ (টাকায়)"
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                      />
                      <input
                        type="text"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="নোট (ঐচ্ছিক)"
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                      />
                      <button
                        onClick={handlePayment}
                        disabled={submitting || !paymentAmount}
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                        {submitting ? "সংরক্ষণ হচ্ছে..." : "✅ পরিশোধ সংরক্ষণ করুন"}
                      </button>
                    </div>
                  </div>

                  {/* Add Due */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">➕ নতুন বাকি যোগ করুন</h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={dueAmount}
                        onChange={(e) => setDueAmount(e.target.value)}
                        placeholder="পরিমাণ (টাকায়)"
                        className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:border-red-500 bg-white"
                      />
                      <input
                        type="text"
                        value={dueDesc}
                        onChange={(e) => setDueDesc(e.target.value)}
                        placeholder="বিবরণ (যেমন: ব্যানার প্রিন্ট)"
                        className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:border-red-500 bg-white"
                      />
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">কবে দেবে? (ঐচ্ছিক)</label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:border-red-500 bg-white"
                        />
                      </div>
                      <button
                        onClick={handleAddDue}
                        disabled={submitting || !dueAmount}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        {submitting ? "সংরক্ষণ হচ্ছে..." : "➕ বাকি যোগ করুন"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === "payments" && (
                <div className="space-y-3">
                  {!customerDetail ? (
                    <div className="h-20 shimmer rounded-xl" />
                  ) : customerDetail.payments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <div className="text-4xl mb-2">💸</div>
                      কোনো পরিশোধের রেকর্ড নেই
                    </div>
                  ) : (
                    customerDetail.payments.map((p) => (
                      <div key={p.id} className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">✅</div>
                        <div className="flex-1">
                          <div className="font-bold text-green-800">{fmt(parseFloat(p.amount))}</div>
                          {p.note && <div className="text-sm text-slate-500">{p.note}</div>}
                          <div className="text-xs text-slate-400">{new Date(p.paidAt).toLocaleDateString("bn-BD", { dateStyle: "full" })}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeDetailTab === "dues" && (
                <div className="space-y-3">
                  {!customerDetail ? (
                    <div className="h-20 shimmer rounded-xl" />
                  ) : customerDetail.dueEntries.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <div className="text-4xl mb-2">📋</div>
                      কোনো বাকির এন্ট্রি নেই
                    </div>
                  ) : (
                    customerDetail.dueEntries.map((d) => (
                      <div key={d.id} className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">💸</div>
                        <div className="flex-1">
                          <div className="font-bold text-red-700">{fmt(parseFloat(d.amount))}</div>
                          {d.description && <div className="text-sm text-slate-600">{d.description}</div>}
                          {d.dueDate && (
                            <div className="text-xs text-amber-600 font-medium">
                              📅 কবে দেবে: {new Date(d.dueDate).toLocaleDateString("bn-BD")}
                            </div>
                          )}
                          <div className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString("bn-BD")}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
