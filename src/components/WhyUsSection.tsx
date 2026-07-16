"use client";

const features = [
  {
    icon: "⭐",
    title: "উন্নত মান",
    description: "আমরা সর্বোচ্চ মানের কাগজ, কালি ও সামগ্রী ব্যবহার করি। আপনার সন্তুষ্টিই আমাদের লক্ষ্য।",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    icon: "💰",
    title: "সুলভ মূল্য",
    description: "বাজারের সেরা মূল্যে প্রিমিয়াম মানের সেবা। কোনো লুকানো চার্জ নেই।",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
  },
  {
    icon: "⚡",
    title: "দ্রুত ডেলিভারি",
    description: "সময়মতো কাজ সম্পন্ন করা আমাদের প্রতিশ্রুতি। জরুরি কাজেও আমরা প্রস্তুত।",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    icon: "🎨",
    title: "সৃজনশীল ডিজাইন",
    description: "অভিজ্ঞ ডিজাইনার দ্বারা তৈরি আকর্ষণীয় ও পেশাদার ডিজাইন।",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
  {
    icon: "📞",
    title: "সর্বোত্তম সাপোর্ট",
    description: "সকাল ১০টা থেকে রাত ১০টা পর্যন্ত আমরা আপনার সেবায় প্রস্তুত।",
    color: "bg-rose-50 border-rose-200",
    iconBg: "bg-rose-100",
  },
  {
    icon: "🤝",
    title: "বিশ্বস্ততা",
    description: "পাটগ্রামের শত শত গ্রাহকের বিশ্বাসযোগ্য প্রতিষ্ঠান। আমরা কথায় নয়, কাজে বিশ্বাসী।",
    color: "bg-cyan-50 border-cyan-200",
    iconBg: "bg-cyan-100",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-indigo-100">
            🌟 কেন আমাদের বেছে নেবেন
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            দুরন্ত কেন আলাদা?
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            আমরা শুধু প্রিন্ট করি না — আপনার স্বপ্নকে রূপ দিই
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border-2 ${feature.color} card-shadow card-hover`}
            >
              <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-16 gradient-primary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              📍 আমাদের অবস্থান
            </h3>
            <p className="text-blue-100 text-lg mb-2">
              হোটেল সাদিকের নিচতলা, বড় মসজিদের সামনে, পাটগ্রাম, লালমনিরহাট
            </p>
            <p className="text-blue-100 text-base mb-6">
              🕐 খোলা থাকি: সকাল ১০টা — রাত ১০টা (প্রতিদিন)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:01710513624"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                📞 01710513624
              </a>
              <a
                href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/30"
              >
                🗺️ গুগল ম্যাপে দেখুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
