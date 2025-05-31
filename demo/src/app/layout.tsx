import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Zero-Shot Text Classifier | No Training Data Required",
  description: "Free AI zero-shot text classifier for instant text classification without training data. Classify text into any categories using OpenAI embeddings and machine learning. Available online, Node.js and browsers.",
  authors: [{ name: "Ahmed Tokyo", url: "https://ahmedtokyo.com" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://ai-zero-shot-classifier.ahmedtokyo.com",
    title: "AI Zero-Shot Text Classifier | No Training Data Required",
    description: "Free AI-powered zero-shot text classification tool. Classify text into any categories instantly without training data using advanced machine learning embeddings. Available online, Node.js and browsers.",
    images: ["/cover.webp"],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://ai-zero-shot-classifier.ahmedtokyo.com",
    title: "AI Zero-Shot Text Classifier | No Training Data Required",
    description: "Free AI text classifier for instant categorization without training data. Perfect for sentiment analysis, topic classification, and content tagging. Available online, Node.js and browsers.",
    images: ["/cover.webp"],
  },
  other: {
    "description:ar": "مصنف النصوص بالذكاء الاصطناعي بدون بيانات تدريب - تصنيف فوري للنصوص باستخدام التعلم الآلي، متاح عبر الإنترنت وNode.js والمتصفحات",
    "description:bn": "বিনামূল্যে এআই টেক্সট ক্লাসিফায়ার - প্রশিক্ষণ ডেটা ছাড়াই তাৎক্ষণিক টেক্সট শ্রেণীবিভাগ، অনলাইনে এবং Node.js ও ব্রাউজারে উপলব্ধ",
    "description:es": "Clasificador de texto AI gratuito sin datos de entrenamiento - Clasificación instantánea usando machine learning, disponible online, Node.js y navegadores",
    "description:fr": "Classificateur de texte IA gratuit sans données d'entraînement - Classification instantanée par apprentissage automatique, disponible en ligne, Node.js et navigateurs",
    "description:hi": "निःशुल्क एआई टेक्स्ट क्लासिफायर - बिना ट्रेनिंग डेटा के तत्काल टेक्स्ट वर्गीकरण، ऑनलाइन، Node.js और ब्राउज़र में उपलब्ध",
    "description:id": "Pengklasifikasi teks AI gratis tanpa data pelatihan - Klasifikasi teks instan menggunakan machine learning, tersedia online, Node.js dan browser",
    "description:it": "Classificatore di testo AI gratuito senza dati di addestramento - Classificazione istantanea con machine learning, disponibile online, Node.js e browser",
    "description:ja": "無料AIテキスト分類器 - 訓練データ不要で即座にテキスト分類、機械学習による高精度分析、オンライン・Node.js・ブラウザ対応",
    "description:ko": "무료 AI 텍스트 분류기 - 훈련 데이터 없이 즉시 텍스트 분류، 머신러닝 기반 고정확도، 온라인・Node.js・브라우저 지원",
    "description:pl": "Darmowy klasyfikator tekstu AI bez danych treningowych - Natychmiastowa klasyfikacja przez machine learning, dostępny online, Node.js i przeglądarki",
    "description:pt": "Classificador de texto AI gratuito sem dados de treinamento - Classificação instantânea usando machine learning, disponível online, Node.js e navegadores",
    "description:ru": "Бесплатный ИИ классификатор текста без обучающих данных - Мгновенная классификация машинным обучением, доступен онлайн, Node.js и браузеры",
    "description:sw": "Kigawanishi cha maandishi cha AI bila data ya mafunzo - Ugawanyaji wa haraka kwa kutumia machine learning, unapatikana mtandaoni, Node.js na vivinjari",
    "description:th": "ตัวจำแนกข้อความ AI ฟรี ไม่ต้องใช้ข้อมูลฝึก - จำแนกข้อความทันทีด้วย machine learning ใช้งานได้ออนไลน์ Node.js และเบราว์เซอร์",
    "description:tl": "Libreng AI text classifier walang training data - Agarang pag-classify ng teksto gamit ang machine learning, available online, Node.js at mga browser",
    "description:tr": "Ücretsiz AI metin sınıflandırıcı - Eğitim verisi olmadan anlık metin sınıflandırma, makine öğrenmesi, online, Node.js ve tarayıcılarda mevcut",
    "description:ur": "مفت اے آئی ٹیکسٹ کلاسیفائر - ٹریننگ ڈیٹا کے بغیر فوری ٹیکسٹ کلاسیفیکیشن، آن لائن، Node.js اور براؤزر میں دستیاب",
    "description:vi": "Bộ phân loại văn bản AI miễn phí - Phân loại văn bản tức thì không cần dữ liệu huấn luyện, có sẵn trực tuyến, Node.js và trình duyệt",
    "description:zh": "免费AI文本分类器 - 无需训练数据即时文本分类，机器学习高精度分析，在线、Node.js和浏览器可用",
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
        className="antialiased"
      >
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5266987079964279"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1HV36QMN9V"
          strategy="afterInteractive"
        />
        <Script async id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1HV36QMN9V');
          `}
        </Script>
      </body>
    </html>
  );
}
