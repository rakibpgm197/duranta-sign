"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ReviewsSection from "@/components/ReviewsSection";
import OrderSection from "@/components/OrderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <ReviewsSection />
      <OrderSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
