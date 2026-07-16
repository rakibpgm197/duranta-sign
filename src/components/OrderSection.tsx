"use client";

import { useState } from "react";

const servicesList = [
  "পিভিসি ব্যানার",
  "পোস্টার ও ফেস্টুন",
  "ক্রেস্ট",
  "ভিনাইল স্টিকার",
  "ডিজিটাল সিল",
  "মগ প্রিন্ট",
  "গেঞ্জি / টি-শার্ট প্রিন্ট",
  "ক্যাশমেমো",
  "ভিজিটিং কার্ড",
  "আইডি কার্ড",
  "ফিতা প্রিন্ট",
  "বিয়ের কার্ড",
  "হালখাতার কার্ড",
  "সার্টিফিকেট",
  "বাংলা/আরবি/উর্দু ডিজাইন",
  "ডায়েরি / ক্যালেন্ডার",
  "অন্যান্য",
];

export default function OrderSection() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    service: "",
    description: "",
    quantity: "1",
    estimatedPrice: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.customerPhone || !form.service || !form.description) {
      setError("অনুগ্রহ করে সকল বাধ্যতামূলক তথ্য পূরণ করুন।");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseInt(form.quantity) || 1,
          estimatedPrice: form.estimatedPrice ? parseFloat(form.estimatedPrice) : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ orderNumber: data.order.orderNumber });

        // Send WhatsApp message
        const msg = `🛍️ *নতুন অর্ডার - দুরন্ত ডিজিটাল সাইন*

📋 অর্ডার নম্বর: ${data.order.orderNumber}
👤 নাম: ${form.customerName}
📞 ফোন: ${form.customerPhone}
📍 ঠিকানা: ${form.customerAddress || "উল্লেখ করা হয়নি"}

🖨️ সেবা: ${form.service}
📝 বিবরণ: ${form.description}
🔢 পরিমাণ: ${form.quantity}
💰 আনুমানিক মূল্য: ${form.estimatedPrice || "নির্ধারিত হয়নি"}
📌 বিশেষ নোট: ${form.notes || "নেই"}`;

        window.open(
          `https://wa.me/8801710513624?text=${encodeURIComponent(msg)}`,
          "_blank"
        );

        setForm({
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          service: "",
          description: "",
          quantity: "1",
          estimatedPrice: "",
          notes: "",
        });
      } else {
        setError(data.error || "অর্ডার জমা দেওয়া সম্ভব হয়নি।");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-green-200">
            📦 অনলাইন অর্ডার
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            ঘরে বসেই অর্ডার করুন
          </h2>
          <p className="text-slate-500 text-lg">
            ফর্মটি পূরণ করুন — আমরা WhatsApp-এ যোগাযোগ করব ইনশাআল্লাহ
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-10 text-center card-shadow">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">অর্ডার সফলভাবে জমা হয়েছে!</h3>
            <p className="text-slate-600 mb-4">
              অর্ডার নম্বর: <span className="font-bold text-blue-600 text-lg">{success.orderNumber}</span>
            </p>
            <p className="text-slate-500 mb-6">আমরা শীঘ্রই WhatsApp-এ যোগাযোগ করব ইনশাআল্লাহ।</p>
            <button
              onClick={() => setSuccess(null)}
              className="px-6 py-3 gradient-primary text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              নতুন অর্ডার করুন
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            {/* Form header */}
            <div className="gradient-primary p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>📝</span> অর্ডার ফর্ম
              </h3>
              <p className="text-blue-100 text-sm mt-1">* চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Customer info */}
              <div>
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">১</span>
                  আপনার তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">পূর্ণ নাম *</label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">ঠিকানা / এলাকা</label>
                  <input
                    type="text"
                    value={form.customerAddress}
                    onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="আপনার ঠিকানা বা এলাকার নাম"
                  />
                </div>
              </div>

              {/* Order details */}
              <div>
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">২</span>
                  অর্ডারের বিবরণ
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">সেবা নির্বাচন করুন *</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    >
                      <option value="">সেবা বেছে নিন</option>
                      {servicesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">বিস্তারিত বিবরণ *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      placeholder="কী চান, কত বড়, কী রঙে, কতটি প্রয়োজন — সব বিস্তারিত লিখুন..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">পরিমাণ</label>
                      <input
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="যেমন: ১, ২, ১০..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">আনুমানিক বাজেট (টাকায়)</label>
                      <input
                        type="number"
                        value={form.estimatedPrice}
                        onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="যেমন: 500, 1000..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">বিশেষ নোট</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl text-lg transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {submitting ? "অর্ডার জমা হচ্ছে..." : "WhatsApp-এ অর্ডার করুন"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
