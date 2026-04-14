import type { Program } from "@/types";

export const programs: Program[] = [
  {
    id: "profesyoneller",
    title: "Murat Aygen'le Profesyoneller",
    category: "Talk Show",
    taglines: ["Uzmanlık bir unvan değildir.", "İnsanla başlar."],
    images: [
      "/programs/2.png",
      "/programs/prof-2.jpg",
      "/programs/prof-3.jpg",
      "/programs/prof-4.jpg",
      "/programs/prof-5.jpg",
    ],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    details: {
      description: [
        "Murat Aygen'le Profesyoneller, uzmanlığın arkasındaki insanı merkeze alan bir sohbet programı.",
        "Her bölümde bir konuk, mesleğinin perde arkasını; başarılarını, tökezlemelerini ve yıllar içinde biriken deneyimlerini Murat Aygen'le samimi bir dille paylaşır.",
        "Teknik detaylardan çok insani hikâyelere odaklanan programın tonu sıcak, anlatısı içten, mizahı ise yerindedir.",
      ],
      presenter: "Murat Aygen",
      duration: "40–60 dk",
    },
  },
  {
    id: "tartiya-cikmadan",
    title: "Tartıya Çıkmadan Konuşalım",
    category: "Soru - Cevap",
    taglines: ["Etiket yok.", "Yargı yok.", "Sadece bedenle iletişim."],
    images: [
      "/programs/3.png",
      "/programs/tck1.png",
      "/programs/tck2.png",
      "/programs/tck3.png",
      "/programs/tck4.png",
    ],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    details: {
      description: [
        "Tartılmadan Önce Konuşalım, kilo, beslenme ve metabolizma konularını etiketsiz, korkusuz ve yargısız bir dille ele alan bir farkındalık programı.",
        "Her bölüm, yaygın bir yanlış inanışla başlar; sade bir sohbetle açılır ve günlük hayata uyarlanabilir pratik önerilerle tamamlanır.",
        "Bu program diyet baskısını değil, bedeni anlamayı merkeze alır. Çünkü gerçek değişim, tartıdan önce bilgiyle başlar.",
      ],
      presenter: "Diyetisyen Kübra Sadıkoğlu",
      duration: "15–20 dk",
      format: "Sağlık / Bilinçlendirme / Talk-Based Educational",
    },
  },
  {
    id: "rahat-ol",
    title: "Ne Olursan Ol Rahat Ol",
    category: "Röportaj",
    taglines: ["Olduğun gibi gel.", "Olduğun gibi anlat."],
    images: [
      "/programs/1.png",
      "/programs/nooro1.png",
      "/programs/nooro2.png",
      "/programs/nooro3.png",
      "/programs/nooro4.png",
    ],
    youtubeUrl: "https://www.youtube.com/channel/UCfmcIZ4_XFSo9Hj4ByA262A",
    details: {
      description: [
        "Ne Olursan Ol Rahat Ol, önyargıların kapıdan girmediği, insanların kendini olduğu gibi ifade edebildiği bir sohbet alanı.",
        "Sibel Arna, konuklarını \"olmuş mu, olmamış mı\" diye sıkıştırmaz; \"Olduğun gibi gel\" der.",
        "Kimi zaman güldüren, kimi zaman düşündüren bu programda moda, güzellik, yaşam ve pop kültür; insan hikâyeleri, özgüven ve dönüşümle iç içe konuşulur.",
        "Samimiyet burada bir stil değil, temel ilkedir.",
      ],
      presenter: "Sibel Arna",
      duration: "30–60 dk",
    },
  },
  {
    id: "akademi",
    title: "Dünyanın Parmak İzi",
    category: "Mini Belgesel",
    taglines: ["Her iz bir hikâye taşır."],
    images: [
      "/programs/hero5-kk.png",
      "/programs/hero5-kk.png",
      "/programs/hero5-kk.png",
      "/programs/hero5-kk.png",
      "/programs/hero5-kk.png",
    ],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    details: {
      description: ["Kendinizi korumanın ve güvende hissetmenin yolları..."],
      presenter: "",
      duration: "",
    },
  },
  {
    id: "kirmadan",
    title: "Kırmadan Konuşalım",
    category: "Soru - Cevap",
    taglines: ["Sağlık, doğru soruyla başlar."],
    images: [
      "/programs/4.png",
      "/programs/kirko.png",
      "/programs/kirko2.png",
      "/programs/kirko3.png",
    ],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    details: {
      description: [
        "Kırmadan Konuşalım, sağlıkla ilgili konuları yargılamadan, korkutmadan ve panik yaratmadan ele alan modern bir farkındalık serisi.",
        "Her bölüm, günlük hayatta sık karşılaşılan yanlış kanaatlerle başlar; uzman görüşüyle sadeleşir ve izleyicinin hayatına uyarlanabilir küçük çözümlerle kapanır.",
        "Bu bir sağlık programı değil; bedenle dost, güvenli bir iletişim alanıdır. Bilgi vermeyi değil, doğru yerden konuşmayı önemser.",
      ],
      presenter: "Prof. Dr. Halil Atmaca",
      duration: "15–20 dk",
      format: "Sağlık / Bilinçlendirme / Talk-Based Educational",
    },
  },
];
