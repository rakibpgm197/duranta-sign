"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-rose-100">
            📞 যোগাযোগ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="text-slate-500 text-lg">
            মেসেজ করলেই দ্রুত সাড়া পাবেন ইনশাআল্লাহ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              {
                icon: "📍",
                title: "আমাদের ঠিকানা",
                content: "হোটেল সাদিকের নিচতলা, বড় মসজিদের সামনে, পাটগ্রাম, লালমনিরহাট",
                color: "bg-blue-50 border-blue-100",
                iconBg: "bg-blue-100",
              },
              {
                icon: "📞",
                title: "ফোন নম্বর",
                content: "01710513624",
                link: "tel:01710513624",
                color: "bg-green-50 border-green-100",
                iconBg: "bg-green-100",
              },
              {
                icon: "🕐",
                title: "ব্যবসায়ের সময়",
                content: "সকাল ১০:০০ — রাত ১০:০০ (প্রতিদিন)",
                color: "bg-amber-50 border-amber-100",
                iconBg: "bg-amber-100",
              },
              {
                icon: "💬",
                title: "WhatsApp",
                content: "01710513624 — এখনই মেসেজ করুন",
                link: "https://wa.me/8801710513624",
                color: "bg-emerald-50 border-emerald-100",
                iconBg: "bg-emerald-100",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 p-5 rounded-2xl border-2 ${item.color} card-hover`}
              >
                <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-700 mb-1">{item.title}</div>
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-slate-600">{item.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com/durontosignpgm/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://wa.me/8801710513624"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md"
              >
                🗺️ Maps
              </a>
            </div>
          </div>

          {/* Map embed placeholder + info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden card-shadow">
              <iframe
                src="https://maps.google.com/maps?q=পাটগ্রাম+লালমনিরহাট&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="দুরন্ত ডিজিটাল সাইন অবস্থান"
                className="w-full"
              />
              <div className="p-4 text-center">
                <a
                  href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  📍 গুগল ম্যাপে বড় করে দেখুন →
                </a>
              </div>
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">🕐</div>
                <div className="font-bold text-slate-700 text-sm">সকাল ১০টা</div>
                <div className="text-slate-400 text-xs">থেকে</div>
                <div className="font-bold text-slate-700 text-sm">রাত ১০টা</div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="font-bold text-slate-700 text-sm">সপ্তাহের</div>
                <div className="text-slate-400 text-xs">প্রতিদিন</div>
                <div className="font-bold text-green-600 text-sm">খোলা থাকি</div>
              </div>
            </div>

            {/* Emergency contact */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="font-bold text-lg mb-1">জরুরি যোগাযোগ</p>
              <a href="tel:01710513624" className="text-2xl font-bold text-amber-300 hover:text-amber-200">
                01710513624
              </a>
              <p className="text-blue-200 text-sm mt-2">মেসেজ করলেই দ্রুত সাড়া পাবেন</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
