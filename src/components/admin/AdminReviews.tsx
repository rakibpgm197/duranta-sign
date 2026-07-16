"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: number;
  reviewerName: string;
  reviewerPhone: string | null;
  rating: number;
  comment: string | null;
  service: string | null;
  isApproved: boolean;
  createdAt: string;
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`text-lg ${s <= rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
    ))}
  </div>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?all=true");
      const data = await res.json();
      setReviews(data.reviews || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleApprove = async (id: number, current: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !current }),
    });
    fetchReviews();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই রিভিউ মুছবেন?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  const avgRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">গড় রেটিং</div>
          <div className="text-2xl font-bold text-amber-600">{avgRating.toFixed(1)} ★</div>
          <div className="text-xs text-slate-400">{reviews.length}টি রিভিউ</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">প্রকাশিত</div>
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
          <div className="text-slate-500 text-sm mb-1">অনুমোদন দরকার</div>
          <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: "all", label: `সব (${reviews.length})` },
          { key: "pending", label: `অপেক্ষমান (${pendingCount})` },
          { key: "approved", label: `অনুমোদিত (${approvedCount})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as "all" | "pending" | "approved")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key
                ? "gradient-primary text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 shimmer rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center card-shadow">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-slate-400 text-lg">কোনো রিভিউ নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-5 card-shadow border-2 transition-all ${
                review.isApproved ? "border-green-100" : "border-orange-100"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{review.reviewerName}</div>
                    {review.reviewerPhone && (
                      <div className="text-xs text-blue-600">{review.reviewerPhone}</div>
                    )}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  review.isApproved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {review.isApproved ? "✅ প্রকাশিত" : "⏳ অপেক্ষমান"}
                </span>
              </div>

              <StarDisplay rating={review.rating} />

              {review.service && (
                <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {review.service}
                </span>
              )}

              {review.comment && (
                <p className="text-slate-600 text-sm mt-2 italic">&ldquo;{review.comment}&rdquo;</p>
              )}

              <div className="text-xs text-slate-400 mt-3 mb-4">
                {new Date(review.createdAt).toLocaleDateString("bn-BD", { dateStyle: "full" })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleApprove(review.id, review.isApproved)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    review.isApproved
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {review.isApproved ? "🚫 লুকান" : "✅ অনুমোদন দিন"}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-all"
                >
                  🗑️ মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
