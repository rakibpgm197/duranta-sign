"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface DashboardData {
  stats: {
    totalCustomers: number;
    totalDue: number;
    totalPaid: number;
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyProfit: number;
    todayIncome: number;
    todayExpense: number;
    todayProfit: number;
    pendingOrders: number;
    pendingReviews: number;
  };
  recentTransactions: {
    id: number;
    type: string;
    category: string | null;
    amount: string;
    description: string | null;
    transactionDate: string;
  }[];
  topDebtors: {
    id: number;
    name: string;
    phone: string | null;
    totalDue: string | null;
    totalPaid: string | null;
  }[];
  chartData: { date: string; income: number; expense: number }[];
}

const StatCard = ({
  icon, title, value, subtitle, color, bgColor,
}: {
  icon: string; title: string; value: string; subtitle?: string; color: string; bgColor: string;
}) => (
  <div className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-500 text-sm font-medium">{title}</span>
      <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </div>
    </div>
    <div className={`text-2xl md:text-3xl font-bold ${color} mb-1`}>{value}</div>
    {subtitle && <div className="text-slate-400 text-xs">{subtitle}</div>}
  </div>
);

export default function AdminOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 })
      .format(n)
      .replace("BDT", "৳");

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl shimmer" />
        ))}
      </div>
    );
  }

  if (!data) return null;
  const { stats, recentTransactions, topDebtors, chartData } = data;

  return (
    <div className="space-y-6">
      {/* Today's summary banner */}
      <div className="gradient-primary rounded-2xl p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">আজকের সারসংক্ষেপ</p>
            <p className="text-3xl font-bold">{fmt(stats.todayProfit)}</p>
            <p className="text-blue-200 text-sm">মুনাফা</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-blue-200 text-xs">আয়</p>
              <p className="text-xl font-bold text-green-300">{fmt(stats.todayIncome)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">ব্যয়</p>
              <p className="text-xl font-bold text-red-300">{fmt(stats.todayExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="💰"
          title="মোট বাকি"
          value={fmt(stats.totalDue)}
          subtitle={`${stats.totalCustomers} জন গ্রাহক`}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          icon="✅"
          title="মোট আদায়"
          value={fmt(stats.totalPaid)}
          subtitle="সর্বমোট পরিশোধ"
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon="📈"
          title="এই মাসের আয়"
          value={fmt(stats.monthlyIncome)}
          subtitle={`ব্যয়: ${fmt(stats.monthlyExpense)}`}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon="💹"
          title="এই মাসের মুনাফা"
          value={fmt(stats.monthlyProfit)}
          subtitle="নেট প্রফিট"
          color={stats.monthlyProfit >= 0 ? "text-emerald-600" : "text-red-600"}
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon="📦"
          title="অপেক্ষমান অর্ডার"
          value={String(stats.pendingOrders)}
          subtitle="নতুন অর্ডার"
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon="⭐"
          title="অপেক্ষমান রিভিউ"
          value={String(stats.pendingReviews)}
          subtitle="অনুমোদন দরকার"
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon="👥"
          title="মোট গ্রাহক"
          value={String(stats.totalCustomers)}
          subtitle="সক্রিয় গ্রাহক"
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <StatCard
          icon="🏪"
          title="দোকান"
          value="চালু"
          subtitle="সকাল ১০ — রাত ১০"
          color="text-green-600"
          bgColor="bg-green-50"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 card-shadow border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-5 text-lg">গত ৭ দিনের আয়-ব্যয়</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                formatter={(value) => [fmt(Number(value))]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="income" name="আয়" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="ব্যয়" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top debtors */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>💰</span> সর্বোচ্চ বাকিদার (শীর্ষ ৫)
          </h3>
          <div className="space-y-3">
            {topDebtors.length === 0 ? (
              <p className="text-slate-400 text-center py-4">কোনো বাকি নেই</p>
            ) : (
              topDebtors.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-amber-500" : "bg-slate-400"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-700 text-sm truncate">{d.name}</div>
                    <div className="text-slate-400 text-xs">{d.phone}</div>
                  </div>
                  <div className="font-bold text-red-600 text-sm">
                    {fmt(parseFloat(d.totalDue || "0"))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📋</span> সাম্প্রতিক লেনদেন
          </h3>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-slate-400 text-center py-4">কোনো লেনদেন নেই</p>
            ) : (
              recentTransactions.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    t.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {t.type === "income" ? "📈" : "📉"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">
                      {t.description || t.category || "লেনদেন"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(t.transactionDate).toLocaleDateString("bn-BD")}
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(parseFloat(t.amount))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
