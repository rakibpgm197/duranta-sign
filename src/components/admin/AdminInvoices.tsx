"use client";

import { useState, useEffect, useCallback } from "react";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  items: string;
  subtotal: string;
  discount: string;
  total: string;
  paid: string;
  due: string;
  status: string | null;
  notes: string | null;
  createdAt: string;
}

const serviceItems = [
  "পিভিসি ব্যানার", "পোস্টার", "ভিজিটিং কার্ড", "আইডি কার্ড",
  "মগ প্রিন্ট", "গেঞ্জি প্রিন্ট", "সার্টিফিকেট", "ক্রেস্ট",
  "ক্যাশমেমো", "বিয়ের কার্ড", "স্টিকার", "সিল", "ফিতা প্রিন্ট", "অন্যান্য",
];

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState<Invoice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    discount: "0",
    paid: "0",
    notes: "",
    status: "pending",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", qty: 1, price: 0, total: 0 },
  ]);

  const fmt = (n: number) => new Intl.NumberFormat("bn-BD").format(n) + " ৳";

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data.invoices || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      updated[idx].total = updated[idx].qty * updated[idx].price;
      return updated;
    });
  };

  const addItem = () => setItems((p) => [...p, { name: "", qty: 1, price: 0, total: 0 }]);
  const removeItem = (idx: number) => setItems((p) => p.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const discount = parseFloat(form.discount) || 0;
  const total = subtotal - discount;
  const paid = parseFloat(form.paid) || 0;
  const due = total - paid;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || items.every((i) => !i.name)) return;
    setSubmitting(true);
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          subtotal,
          discount,
          total,
          paid,
          due,
        }),
      });
      setShowCreate(false);
      setForm({ customerName: "", customerPhone: "", discount: "0", paid: "0", notes: "", status: "pending" });
      setItems([{ name: "", qty: 1, price: 0, total: 0 }]);
      fetchInvoices();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই ইনভয়েস মুছবেন?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    fetchInvoices();
  };

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-amber-100 text-amber-700",
    pending: "bg-red-100 text-red-700",
  };
  const statusLabels: Record<string, string> = {
    paid: "✅ পরিশোধ", partial: "⚠️ আংশিক", pending: "⏳ বকেয়া",
  };

  const printInvoice = (inv: Invoice) => {
    const invItems: InvoiceItem[] = JSON.parse(inv.items);
    const printContent = `
      <html><head><title>${inv.invoiceNumber}</title>
      <style>
        body { font-family: 'Hind Siliguri', sans-serif; padding: 20px; color: #1e293b; }
        h1 { color: #1a56db; } table { width: 100%; border-collapse: collapse; }
        th { background: #f1f5f9; padding: 8px; text-align: left; border: 1px solid #e2e8f0; }
        td { padding: 8px; border: 1px solid #e2e8f0; }
        .total-row { font-weight: bold; background: #f8fafc; }
        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info { font-size: 14px; color: #64748b; }
      </style></head><body>
      <div class="header">
        <div><h1>দুরন্ত ডিজিটাল সাইন</h1><p class="info">পাটগ্রাম, লালমনিরহাট | 01710513624</p></div>
        <div style="text-align:right"><h2>${inv.invoiceNumber}</h2><p class="info">${new Date(inv.createdAt).toLocaleDateString("bn-BD")}</p></div>
      </div>
      <div style="margin-bottom:15px"><strong>গ্রাহক:</strong> ${inv.customerName} | ${inv.customerPhone || ""}</div>
      <table><thead><tr><th>পণ্য/সেবা</th><th>পরিমাণ</th><th>মূল্য</th><th>মোট</th></tr></thead>
      <tbody>${invItems.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price} ৳</td><td>${i.total} ৳</td></tr>`).join("")}
      <tr class="total-row"><td colspan="3" style="text-align:right">সাবটোটাল:</td><td>${inv.subtotal} ৳</td></tr>
      <tr><td colspan="3" style="text-align:right">ছাড়:</td><td>${inv.discount} ৳</td></tr>
      <tr class="total-row"><td colspan="3" style="text-align:right">সর্বমোট:</td><td>${inv.total} ৳</td></tr>
      <tr><td colspan="3" style="text-align:right">পরিশোধ:</td><td>${inv.paid} ৳</td></tr>
      <tr style="color:red"><td colspan="3" style="text-align:right">বাকি:</td><td>${inv.due} ৳</td></tr>
      </tbody></table>
      ${inv.notes ? `<p style="margin-top:15px"><strong>নোট:</strong> ${inv.notes}</p>` : ""}
      <p style="margin-top:20px;text-align:center;color:#64748b">ধন্যবাদ! — দুরন্ত ডিজিটাল সাইন</p>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm">মোট {invoices.length}টি ইনভয়েস</p>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 shadow-md"
        >
          ➕ নতুন ইনভয়েস
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">ইনভয়েস নং</th>
                <th className="text-left px-5 py-4 text-sm font-bold text-slate-600">গ্রাহক</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">মোট</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">পরিশোধ</th>
                <th className="text-right px-5 py-4 text-sm font-bold text-slate-600">বাকি</th>
                <th className="text-center px-5 py-4 text-sm font-bold text-slate-600">অবস্থা</th>
                <th className="text-center px-5 py-4 text-sm font-bold text-slate-600">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-8 shimmer rounded" /></td></tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="text-4xl mb-2">🧾</div>
                    কোনো ইনভয়েস নেই
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-sm text-blue-600 font-bold">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-700 text-sm">{inv.customerName}</div>
                      <div className="text-xs text-slate-400">{inv.customerPhone}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-700">{fmt(parseFloat(inv.total))}</td>
                    <td className="px-5 py-3 text-right text-green-600 font-semibold">{fmt(parseFloat(inv.paid))}</td>
                    <td className="px-5 py-3 text-right text-red-600 font-semibold">{fmt(parseFloat(inv.due))}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[inv.status || "pending"]}`}>
                        {statusLabels[inv.status || "pending"]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowView(inv)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100"
                        >
                          দেখুন
                        </button>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100"
                        >
                          প্রিন্ট
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100"
                        >
                          মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">🧾 নতুন ইনভয়েস তৈরি</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Customer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">গ্রাহকের নাম *</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="নাম"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">ফোন নম্বর</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-700">পণ্য / সেবার তালিকা</label>
                  <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                    ➕ আইটেম যোগ করুন
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <select
                          value={item.name}
                          onChange={(e) => updateItem(idx, "name", e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="">সেবা নির্বাচন করুন</option>
                          {serviceItems.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(idx, "qty", parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-center"
                          placeholder="সংখ্যা"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(idx, "price", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="মূল্য"
                        />
                      </div>
                      <div className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 text-center">
                        {item.total} ৳
                      </div>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-2">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">সাবটোটাল:</span>
                  <span className="font-bold">{fmt(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600 text-sm">ছাড়:</span>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-2">
                  <span>সর্বমোট:</span>
                  <span className="text-blue-600">{fmt(total)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-green-700 font-semibold text-sm">পরিশোধ:</span>
                  <input
                    type="number"
                    value={form.paid}
                    onChange={(e) => setForm({ ...form, paid: e.target.value })}
                    className="w-28 px-3 py-2 border border-green-200 rounded-lg text-sm text-right focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-red-600">বাকি:</span>
                  <span className="text-red-600">{fmt(due)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">অবস্থা</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="pending">⏳ বকেয়া</option>
                  <option value="partial">⚠️ আংশিক পরিশোধ</option>
                  <option value="paid">✅ সম্পূর্ণ পরিশোধ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">নোট</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="কোনো বিশেষ নির্দেশনা..."
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50">বাতিল</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50">
                  {submitting ? "তৈরি হচ্ছে..." : "🧾 ইনভয়েস তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">ইনভয়েস বিবরণ</h3>
                <button onClick={() => setShowView(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="font-mono font-bold text-blue-700 text-lg">{showView.invoiceNumber}</div>
                  <div className="text-slate-500 text-sm">{new Date(showView.createdAt).toLocaleDateString("bn-BD", { dateStyle: "full" })}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{showView.customerName}</div>
                  <div className="text-slate-500 text-sm">{showView.customerPhone}</div>
                </div>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-2">পণ্য/সেবা</th>
                        <th className="text-center px-4 py-2">সংখ্যা</th>
                        <th className="text-right px-4 py-2">মোট</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(JSON.parse(showView.items) as InvoiceItem[]).map((item, i) => (
                        <tr key={i} className="border-t border-slate-50">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="text-center px-4 py-2">{item.qty}</td>
                          <td className="text-right px-4 py-2">{fmt(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">সাবটোটাল:</span><span>{fmt(parseFloat(showView.subtotal))}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">ছাড়:</span><span>{fmt(parseFloat(showView.discount))}</span></div>
                  <div className="flex justify-between font-bold"><span>সর্বমোট:</span><span className="text-blue-600">{fmt(parseFloat(showView.total))}</span></div>
                  <div className="flex justify-between text-green-600"><span>পরিশোধ:</span><span>{fmt(parseFloat(showView.paid))}</span></div>
                  <div className="flex justify-between text-red-600 font-bold"><span>বাকি:</span><span>{fmt(parseFloat(showView.due))}</span></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowView(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600">বন্ধ করুন</button>
                <button onClick={() => printInvoice(showView)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">🖨️ প্রিন্ট করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
