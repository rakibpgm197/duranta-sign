"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  onLogin: (userId: string, password: string) => boolean;
}

export default function AdminLogin({ onLogin }: Props) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = onLogin(userId, password);
    if (!success) {
      setError("ভুল ইউজার আইডি বা পাসওয়ার্ড। আবার চেষ্টা করুন।");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-3xl shadow-2xl mb-4">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.18V11c0 3.85-2.58 7.53-6 8.93-3.42-1.4-6-5.08-6-8.93V7.18L12 5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-blue-200">দুরন্ত ডিজিটাল সাইন — ব্যবস্থাপনা</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">লগইন করুন</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                ইউজার আইডি
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  👤
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                  placeholder="ইউজার আইডি দিন"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                  placeholder="পাসওয়ার্ড দিন"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-primary text-white font-bold rounded-xl text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  যাচাই হচ্ছে...
                </>
              ) : (
                <>🔐 লগইন করুন</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-300 hover:text-white transition-colors text-sm">
            ← মূল ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
