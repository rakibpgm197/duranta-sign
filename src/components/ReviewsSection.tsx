"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string | null;
  service: string | null;
  createdAt: string;
}

const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(star)}
          className={`text-2xl ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
            star <= (hovered || rating) ? "text-amber-400" : "text-slate-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    reviewerName: "",
    reviewerPhone: "",
    rating: 5,
    comment: "",
    service: "",
  });

  const services = [
    "পিভিসি ব্যানার", "পোস্টার", "ভিজিটিং কার্ড", "আইডি কার্ড",
    "মগ প্রিন্ট", "গেঞ্জি প্রিন্ট", "সার্টিফিকেট", "ক্রেস্ট",
    "ক্যাশমেমো", "বিয়ের কার্ড", "স্টিকার", "অন্যান্য",
  ];

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reviewerName || !form.rating) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ reviewerName: "", reviewerPhone: "", rating: 5, comment: "", service: "" });
        setTimeout(() => { setSuccess(false); setShowForm(false); }, 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-200">
            ⭐ গ্রাহক রিভিউ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            আমাদের গ্রাহকরা কী বলেন?
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-2">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-2xl font-bold text-amber-500">{avgRating.toFixed(1)}</span>
              <span className="text-slate-400">({reviews.length} রিভিউ)</span>
            </div>
          )}
        </div>

        {/* Reviews grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl shimmer" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-slate-400 text-lg">এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 card-shadow card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{review.reviewerName}</div>
                      {review.service && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                          {review.service}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                {review.comment && (
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
                <div className="text-xs text-slate-400 mt-3">
                  {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add review button */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 gradient-primary text-white font-bold rounded-2xl text-lg hover:opacity-90 transition-all shadow-lg hover:-translate-y-1"
          >
            ✍️ আপনার রিভিউ দিন
          </button>
        </div>

        {/* Review form */}
        {showForm && (
          <div className="mt-8 max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 card-shadow p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">আপনার মতামত জানান</h3>
            
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-green-600 font-bold text-xl">ধন্যবাদ! আপনার রিভিউ জমা হয়েছে।</p>
                <p className="text-slate-500 mt-2">অ্যাডমিন অনুমোদনের পরে প্রকাশিত হবে।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">আপনার নাম *</label>
                    <input
                      type="text"
                      value={form.reviewerName}
                      onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="আপনার নাম লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">মোবাইল (ঐচ্ছিক)</label>
                    <input
                      type="tel"
                      value={form.reviewerPhone}
                      onChange={(e) => setForm({ ...form, reviewerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">সেবা নির্বাচন করুন</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  >
                    <option value="">সেবা নির্বাচন করুন</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">রেটিং *</label>
                  <StarRating rating={form.rating} interactive onRate={(r) => setForm({ ...form, rating: r })} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">মন্তব্য</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 gradient-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? "জমা হচ্ছে..." : "✅ রিভিউ জমা দিন"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
