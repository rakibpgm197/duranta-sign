"use client";

import { useState } from "react";
import Link from "next/link";
import AdminOverview from "./AdminOverview";
import AdminCustomers from "./AdminCustomers";
import AdminTransactions from "./AdminTransactions";
import AdminInvoices from "./AdminInvoices";
import AdminOrders from "./AdminOrders";
import AdminReviews from "./AdminReviews";

interface Props {
  onLogout: () => void;
}

const tabs = [
  { id: "overview", label: "ড্যাশবোর্ড", icon: "📊" },
  { id: "customers", label: "বাকির হিসাব", icon: "💰" },
  { id: "transactions", label: "আয়-ব্যয়", icon: "📈" },
  { id: "invoices", label: "ইনভয়েস", icon: "🧾" },
  { id: "orders", label: "অর্ডারসমূহ", icon: "📦" },
  { id: "reviews", label: "রিভিউ", icon: "⭐" },
];

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTabInfo = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm">দুরন্ত ডিজিটাল সাইন</div>
              <div className="text-slate-400 text-xs">অ্যাডমিন প্যানেল</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
          >
            🌐 <span>মূল ওয়েবসাইট</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-600 transition-all text-sm font-medium"
          >
            🚪 <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{activeTabInfo?.icon}</span>
            <h1 className="font-bold text-slate-800 text-lg">{activeTabInfo?.label}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              অ্যাডমিন
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all"
            >
              লগআউট
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "customers" && <AdminCustomers />}
          {activeTab === "transactions" && <AdminTransactions />}
          {activeTab === "invoices" && <AdminInvoices />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "reviews" && <AdminReviews />}
        </main>
      </div>
    </div>
  );
}
