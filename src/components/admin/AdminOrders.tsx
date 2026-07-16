"use client";

import { useState, useEffect, useCallback } from "react";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  service: string;
  description: string;
  quantity: number | null;
  estimatedPrice: string | null;
  status: string | null;
  notes: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "⏳ অপেক্ষমান", color: "text-amber-700", bg: "bg-amber-100" },
  confirmed: { label: "✅ নিশ্চিত", color: "text-blue-700", bg: "bg-blue-100" },
  processing: { label: "⚙️ প্রক্রিয়াধীন", color: "text-purple-700", bg: "bg-purple-100" },
  delivered: { label: "🚀 সম্পন্ন", color: "text-green-700", bg: "bg-green-100" },
  cancelled: { label: "❌ বাতিল", color: "text-red-700", bg: "bg-red-100" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    if (showDetail && showDetail.id === id) {
      setShowDetail({ ...showDetail, status });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই অর্ডার মুছবেন?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
    setShowDetail(null);
  };

  const sendWhatsApp = (order: Order) => {
    const msg = `✅ *অর্ডার আপডেট - দুরন্ত ডিজিটাল সাইন*

অর্ডার নম্বর: ${order.orderNumber}
গ্রাহক: ${order.customerName}
সেবা: ${order.service}
অবস্থা: ${statusConfig[order.status || "pending"]?.label}

ধন্যবাদ আমাদের সাথে থাকার জন্য। 🙏`;
    window.open(`https://wa.me/880${order.customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "সব", count: counts.all },
          { key: "pending", label: "অপেক্ষমান", count: counts.pending },
          { key: "confirmed", label: "নিশ্চিত", count: counts.confirmed },
          { key: "processing", label: "প্রক্রিয়াধীন", count: counts.processing },
          { key: "delivered", label: "সম্পন্ন", count: counts.delivered },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filterStatus === tab.key
                ? "gradient-primary text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
              filterStatus === tab.key ? "bg-white/30" : "bg-slate-100"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 shimmer rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center card-shadow">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-slate-400 text-lg">কোনো অর্ডার নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((order) => {
            const sc = statusConfig[order.status || "pending"];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-mono text-sm text-blue-600 font-bold">{order.orderNumber}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="font-bold text-slate-800">{order.customerName}</div>
                  <a href={`tel:${order.customerPhone}`} className="text-blue-600 text-sm">
                    {order.customerPhone}
                  </a>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-3">
                  <div className="text-xs font-semibold text-slate-500 mb-1">{order.service}</div>
                  <div className="text-sm text-slate-700 line-clamp-2">{order.description}</div>
                  {order.estimatedPrice && (
                    <div className="text-sm font-bold text-blue-600 mt-1">
                      আনুমানিক: {order.estimatedPrice} ৳
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="pending">⏳ অপেক্ষমান</option>
                    <option value="confirmed">✅ নিশ্চিত</option>
                    <option value="processing">⚙️ প্রক্রিয়াধীন</option>
                    <option value="delivered">🚀 সম্পন্ন</option>
                    <option value="cancelled">❌ বাতিল</option>
                  </select>
                  <button
                    onClick={() => sendWhatsApp(order)}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="WhatsApp-এ যোগাযোগ"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDetail(order)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-bold"
                  >
                    ℹ️
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-bold text-xl text-slate-800">{showDetail.orderNumber}</div>
                  <div className="text-slate-400 text-sm">{new Date(showDetail.createdAt).toLocaleDateString("bn-BD", { dateStyle: "full" })}</div>
                </div>
                <button onClick={() => setShowDetail(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500">গ্রাহক</div>
                    <div className="font-bold text-slate-700">{showDetail.customerName}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500">ফোন</div>
                    <a href={`tel:${showDetail.customerPhone}`} className="font-bold text-blue-600">{showDetail.customerPhone}</a>
                  </div>
                </div>

                {showDetail.customerAddress && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">ঠিকানা</div>
                    <div className="text-slate-700">{showDetail.customerAddress}</div>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">সেবা</div>
                  <div className="font-bold text-slate-700">{showDetail.service}</div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">বিস্তারিত</div>
                  <div className="text-slate-700">{showDetail.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500">পরিমাণ</div>
                    <div className="font-bold text-slate-700">{showDetail.quantity} টি</div>
                  </div>
                  {showDetail.estimatedPrice && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="text-xs text-slate-500">আনুমানিক মূল্য</div>
                      <div className="font-bold text-blue-600">{showDetail.estimatedPrice} ৳</div>
                    </div>
                  )}
                </div>

                {showDetail.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">বিশেষ নোট</div>
                    <div className="text-slate-700">{showDetail.notes}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => sendWhatsApp(showDetail)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={() => handleDelete(showDetail.id)}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200"
                >
                  মুছুন
                </button>
                <button
                  onClick={() => setShowDetail(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  বন্ধ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
