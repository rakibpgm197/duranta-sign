"use client";

const services = [
  {
    icon: "🖼️",
    title: "পিভিসি ব্যানার ও পোস্টার",
    description: "উচ্চমানের পিভিসি ব্যানার, ফেস্টুন ও পোস্টার প্রিন্ট। আকর্ষণীয় ডিজাইন ও দীর্ঘস্থায়ী রং।",
    image: "https://images.pexels.com/photos/4913828/pexels-photo-4913828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "জনপ্রিয়",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🏆",
    title: "ক্রেস্ট",
    description: "বিভিন্ন অনুষ্ঠান, পুরস্কার ও স্মারকের জন্য সুন্দর ক্রেস্ট তৈরি করা হয়।",
    image: "https://images.pexels.com/photos/8177922/pexels-photo-8177922.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: "🎯",
    title: "ভিনাইল স্টিকার ও সিল",
    description: "ডিজিটাল সিল, ভিনাইল স্টিকার — যেকোনো আকারে ও ডিজাইনে।",
    image: "https://images.pexels.com/photos/7986976/pexels-photo-7986976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: "☕",
    title: "মগ প্রিন্ট",
    description: "কাস্টম ছবি ও ডিজাইনসহ মগ প্রিন্ট — উপহারের জন্য আদর্শ।",
    image: "https://images.pexels.com/photos/3493047/pexels-photo-3493047.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "গিফট আইটেম",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: "👕",
    title: "গেঞ্জি প্রিন্ট",
    description: "টি-শার্ট ও গেঞ্জিতে কাস্টম প্রিন্ট। দল, প্রতিষ্ঠান ও ব্যক্তিগত ব্যবহারের জন্য।",
    image: "https://images.pexels.com/photos/33650428/pexels-photo-33650428.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: "🧾",
    title: "ক্যাশমেমো",
    description: "আপনার দোকান বা প্রতিষ্ঠানের জন্য কাস্টম ক্যাশমেমো ও রিসিট বুক।",
    image: "https://images.pexels.com/photos/5706020/pexels-photo-5706020.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-slate-500 to-gray-600",
  },
  {
    icon: "💼",
    title: "ভিজিটিং কার্ড",
    description: "প্রফেশনাল মানের ভিজিটিং কার্ড — উন্নত কাগজে চকচকে বা ম্যাট ফিনিশে।",
    image: "https://images.pexels.com/photos/8059661/pexels-photo-8059661.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: "🪪",
    title: "আইডি কার্ড ও ফিতা",
    description: "প্রাতিষ্ঠানিক আইডি কার্ড, উন্নতমানের ফিতা প্রিন্ট ও কভার।",
    image: "https://images.pexels.com/photos/7108127/pexels-photo-7108127.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "স্কুল/অফিস",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: "💌",
    title: "বিয়ে ও হালখাতার কার্ড",
    description: "বিয়ে, হালখাতা ও বিভিন্ন অনুষ্ঠানের আমন্ত্রণপত্র।",
    image: "https://images.pexels.com/photos/12048935/pexels-photo-12048935.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: "📜",
    title: "সার্টিফিকেট",
    description: "পুরস্কার, প্রশিক্ষণ ও কোর্স সম্পন্নের সার্টিফিকেট — সুন্দর ডিজাইনে।",
    image: "https://images.pexels.com/photos/37012315/pexels-photo-37012315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: "🌐",
    title: "বহুভাষিক ডিজাইন",
    description: "বাংলা, ইংরেজি, আরবি ও উর্দু — যেকোনো ভাষায় ডিজাইন ও প্রিন্টিং।",
    image: "https://images.pexels.com/photos/7986987/pexels-photo-7986987.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "বিশেষ সেবা",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: "📋",
    title: "অন্যান্য প্রিন্টিং",
    description: "ডায়েরি, ক্যালেন্ডার, বুকলেট, লিফলেট সহ সব ধরনের প্রিন্টিং সেবা।",
    image: "https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400",
    badge: "",
    color: "from-teal-500 to-green-500",
  },
];

export default function ServicesSection() {
  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-100">
            🎨 আমাদের সেবাসমূহ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            এক ছাদের নিচে সব প্রিন্টিং সেবা
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            আপনার প্রয়োজন যাই হোক — আমরা আছি আপনার পাশে। সুলভ মূল্যে উন্নত মানের সেবা।
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 card-shadow card-hover cursor-pointer"
              onClick={scrollToOrder}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-40 group-hover:opacity-50 transition-opacity`} />
                <div className="absolute top-3 left-3 text-3xl">{service.icon}</div>
                {service.badge && (
                  <div className="absolute top-3 right-3 bg-white/90 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                    {service.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {service.description}
                </p>
                <button className="mt-3 text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  অর্ডার করুন <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4">✅ সব কিছুই পাচ্ছেন সুলভ মূল্যে, উন্নত মানে</p>
          <button
            onClick={scrollToOrder}
            className="px-8 py-4 gradient-primary text-white font-bold rounded-2xl text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
          >
            📦 এখনই অর্ডার করুন
          </button>
        </div>
      </div>
    </section>
  );
}
