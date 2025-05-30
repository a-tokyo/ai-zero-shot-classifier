import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ai-zero-shot-classifier",
  description: "AI Zero Shot Classifier",
  authors: [{ name: "Ahmed Tokyo", url: "https://ahmedtokyo.com" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://ai-zero-shot-classifier.ahmedtokyo.com/",
    title: "AI Zero Shot Classifier",
    description: "AI Zero Shot Classifier",
    images: ["/cover.webp"],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://ai-zero-shot-classifier.ahmedtokyo.com/",
    title: "AI Zero Shot Classifier",
    description: "AI Zero Shot Classifier",
    images: ["/cover.webp"],
  },
  other: {
    "description:ar": "مصنف الذكاء الاصطناعي بدون تدريب مسبق",
    "description:bn": "এআই জিরো শট ক্লাসিফায়ার",
    "description:es": "Clasificador de IA sin entrenamiento previo",
    "description:fr": "Classificateur IA sans apprentissage préalable",
    "description:hi": "एआई जीरो शॉट क्लासिफायर",
    "description:id": "Pengklasifikasi AI Tanpa Pelatihan",
    "description:it": "Classificatore AI a colpo singolo",
    "description:ja": "AIゼロショット分類器",
    "description:ko": "AI 제로샷 분류기",
    "description:pl": "Klasyfikator AI bez wstępnego treningu",
    "description:pt": "Classificador de IA sem treinamento prévio",
    "description:ru": "ИИ классификатор с нулевым обучением",
    "description:sw": "Kigawanishi cha AI Kisichofunzwa",
    "description:th": "ตัวจำแนกประเภท AI แบบไม่ต้องฝึกฝน",
    "description:tl": "AI Zero Shot na Tagapagklasipika",
    "description:tr": "AI Sıfır Atış Sınıflandırıcı",
    "description:ur": "اے آئی زیرو شاٹ کلاسیفائر",
    "description:vi": "Bộ phân loại AI không cần huấn luyện",
    "description:zh": "AI零样本分类器",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
