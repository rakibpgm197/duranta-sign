"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 196, 255, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fadeInUp">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          পাটগ্রামের সেরা প্রিন্টিং সার্ভিস
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fadeInUp">
          আসসালামু আলাইকুম! 🌙
          <br />
          <span className="text-gradient-gold" style={{ WebkitTextFillColor: "transparent", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text" }}>
            দুরন্ত ডিজিটাল সাইন
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium mb-2 animate-fadeInUp">
          ডিজাইনে দুরন্ত, মানে অনন্য ✨
        </p>

        <p className="text-base sm:text-lg text-blue-200/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp">
          প্রিন্টিং থেকে ছাপানো — এক ছাদের নিচেই সব! ❤️
          <br />
          আপনার বিদ্যালয়, প্রতিষ্ঠান বা ব্যক্তিগত প্রয়োজনে বিশ্বস্ত ও মানসম্মত ডিজাইন–প্রিন্ট সেবা।
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp">
          <button
            onClick={scrollToOrder}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-2xl text-lg hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
          >
            📦 অর্ডার করুন এখনই
          </button>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl text-lg hover:bg-white/20 transition-all"
          >
            📞 যোগাযোগ করুন
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fadeInUp">
          {[
            { value: "৫+", label: "বছরের অভিজ্ঞতা", icon: "🏆" },
            { value: "৫০০+", label: "সন্তুষ্ট গ্রাহক", icon: "😊" },
            { value: "১২+", label: "ধরনের সেবা", icon: "🎨" },
            { value: "১০০%", label: "মানের নিশ্চয়তা", icon: "✅" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
