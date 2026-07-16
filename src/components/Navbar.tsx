"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white">
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
              </svg>
            </div>
            <div>
              <div className={`font-bold text-base md:text-lg leading-tight ${scrolled ? "text-slate-800" : "text-white"}`}>
                দুরন্ত ডিজিটাল সাইন
              </div>
              <div className={`text-xs ${scrolled ? "text-blue-600" : "text-blue-200"}`}>
                ডিজাইনে দুরন্ত, মানে অনন্য
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "সেবাসমূহ", id: "services" },
              { label: "কেন আমরা", id: "why-us" },
              { label: "রিভিউ", id: "reviews" },
              { label: "অর্ডার করুন", id: "order" },
              { label: "যোগাযোগ", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/20 ${
                  scrolled ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50" : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/admin"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              🔐 অ্যাডমিন
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-slate-700" : "text-white"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-2xl border-t border-slate-100">
          <div className="px-4 py-3 space-y-1">
            {[
              { label: "সেবাসমূহ", id: "services" },
              { label: "কেন আমরা", id: "why-us" },
              { label: "রিভিউ", id: "reviews" },
              { label: "অর্ডার করুন", id: "order" },
              { label: "যোগাযোগ", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/admin"
              className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold mt-2"
              onClick={() => setMenuOpen(false)}
            >
              🔐 অ্যাডমিন প্যানেল
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
