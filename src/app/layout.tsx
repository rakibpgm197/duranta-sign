import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "দুরন্ত ডিজিটাল সাইন - ডিজাইনে দুরন্ত, মানে অনন্য",
  description:
    "পিভিসি ব্যানার, পোস্টার, ভিজিটিং কার্ড, আইডি কার্ড, মগ প্রিন্ট, গেঞ্জি প্রিন্ট সহ সকল ধরনের প্রিন্টিং সেবা। পাটগ্রাম, লালমনিরহাট।",
  keywords:
    "printing, banner, poster, visiting card, id card, mug print, patgram, lalmonirhat, durontosign",
  openGraph: {
    title: "দুরন্ত ডিজিটাল সাইন",
    description: "এক ছাদের নিচেই সব প্রিন্টিং সেবা",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Hind Siliguri', 'Poppins', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
