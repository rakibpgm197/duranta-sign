"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                  <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-xl">দুরন্ত ডিজিটাল সাইন</div>
                <div className="text-blue-400 text-sm">ডিজাইনে দুরন্ত, মানে অনন্য</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              পাটগ্রামের সেরা প্রিন্টিং ও ডিজাইন সেবা। আপনার প্রতিটি প্রয়োজনে আমরা আছি আপনার পাশে।
              বিশ্বস্ততার সাথে মানসম্মত সেবা প্রদানই আমাদের লক্ষ্য।
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/durontosignpgm/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/8801710513624"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors"
                aria-label="Google Maps"
              >
                🗺️
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">আমাদের সেবা</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              {["পিভিসি ব্যানার ও পোস্টার", "ভিজিটিং কার্ড", "আইডি কার্ড", "মগ প্রিন্ট", "গেঞ্জি প্রিন্ট", "সার্টিফিকেট", "ক্রেস্ট", "বিয়ের কার্ড"].map((s) => (
                <li key={s} className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-blue-500 text-xs">▶</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">যোগাযোগ</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>হোটেল সাদিকের নিচতলা, বড় মসজিদের সামনে, পাটগ্রাম, লালমনিরহাট</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:01710513624" className="hover:text-white transition-colors">01710513624</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>সকাল ১০টা — রাত ১০টা</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {currentYear} দুরন্ত ডিজিটাল সাইন, পাটগ্রাম। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-slate-600 text-xs">
            ডিজাইনে দুরন্ত, মানে অনন্য ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
