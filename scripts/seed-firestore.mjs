// Seed script: Mevcut statik verileri Firestore'a aktarır
// Çalıştır: node scripts/seed-firestore.mjs

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5SmbBDqmEMZew3GFzQkCurzdBBUNL7KM",
  authDomain: "alaka-admin.firebaseapp.com",
  projectId: "alaka-admin",
  storageBucket: "alaka-admin.firebasestorage.app",
  messagingSenderId: "914152791227",
  appId: "1:914152791227:web:ec4a3988c7ebbc89e5dd9e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin olarak giriş yap
await signInWithEmailAndPassword(auth, "admin@alaka.pro", "123456");
console.log("🔑 Admin olarak giriş yapıldı.\n");

// ─── Hero Items ───
const heroItems = [
  {
    title: ["MURAT AYGEN'LE", "PROFESYONELLER"],
    category: "Talk Show",
    image: "/programs/hero1.png",
    href: "#post-profesyoneller",
    active: true,
    order: 0,
  },
  {
    title: ["Tartıya", "Çıkmadan", "Konuşalım"],
    category: "Soru - Cevap",
    image: "/programs/hero3.png",
    href: "#post-tartiya-cikmadan",
    active: true,
    order: 1,
  },
  {
    title: ["Kırmadan", "Konuşalım"],
    category: "Soru - Cevap",
    image: "/programs/hero4.png",
    href: "#post-kirmadan",
    active: true,
    order: 2,
  },
  {
    title: ["Ne Olursan", "Ol", "Rahat Ol"],
    category: "Röportaj",
    image: "/programs/hero2.png",
    href: "#post-rahat-ol",
    active: true,
    order: 3,
  },
  {
    title: ["Dünyanın", "Parmak", "İzi"],
    category: "Mini Belgesel",
    image: "/programs/hero5-kk.png",
    href: "#post-akademi",
    badge: "Çok Yakında",
    active: true,
    order: 4,
  },
];

// ─── Programs ───
const programs = [
  {
    title: "Murat Aygen'le Profesyoneller",
    slug: "profesyoneller",
    category: "Talk Show",
    taglines: ["Uzmanlık bir unvan değildir.", "İnsanla başlar."],
    images: ["/programs/2.png", "/programs/prof-2.jpg", "/programs/prof-3.jpg", "/programs/prof-4.jpg", "/programs/prof-5.jpg"],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    description: [
      "Murat Aygen'le Profesyoneller, uzmanlığın arkasındaki insanı merkeze alan bir sohbet programı.",
      "Her bölümde bir konuk, mesleğinin perde arkasını; başarılarını, tökezlemelerini ve yıllar içinde biriken deneyimlerini Murat Aygen'le samimi bir dille paylaşır.",
      "Teknik detaylardan çok insani hikâyelere odaklanan programın tonu sıcak, anlatısı içten, mizahı ise yerindedir.",
    ],
    presenter: "Murat Aygen",
    duration: "40–60 dk",
    featured: false,
    active: true,
    order: 0,
  },
  {
    title: "Tartıya Çıkmadan Konuşalım",
    slug: "tartiya-cikmadan",
    category: "Soru - Cevap",
    taglines: ["Etiket yok.", "Yargı yok.", "Sadece bedenle iletişim."],
    images: ["/programs/3.png", "/programs/tck1.png", "/programs/tck2.png", "/programs/tck3.png", "/programs/tck4.png"],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    description: [
      "Tartılmadan Önce Konuşalım, kilo, beslenme ve metabolizma konularını etiketsiz, korkusuz ve yargısız bir dille ele alan bir farkındalık programı.",
      "Her bölüm, yaygın bir yanlış inanışla başlar; sade bir sohbetle açılır ve günlük hayata uyarlanabilir pratik önerilerle tamamlanır.",
      "Bu program diyet baskısını değil, bedeni anlamayı merkeze alır. Çünkü gerçek değişim, tartıdan önce bilgiyle başlar.",
    ],
    presenter: "Diyetisyen Kübra Sadıkoğlu",
    duration: "15–20 dk",
    format: "Sağlık / Bilinçlendirme / Talk-Based Educational",
    featured: false,
    active: true,
    order: 1,
  },
  {
    title: "Ne Olursan Ol Rahat Ol",
    slug: "rahat-ol",
    category: "Röportaj",
    taglines: ["Olduğun gibi gel.", "Olduğun gibi anlat."],
    images: ["/programs/1.png", "/programs/nooro1.png", "/programs/nooro2.png", "/programs/nooro3.png", "/programs/nooro4.png"],
    youtubeUrl: "https://www.youtube.com/channel/UCfmcIZ4_XFSo9Hj4ByA262A",
    description: [
      "Ne Olursan Ol Rahat Ol, önyargıların kapıdan girmediği, insanların kendini olduğu gibi ifade edebildiği bir sohbet alanı.",
      "Sibel Arna, konuklarını \"olmuş mu, olmamış mı\" diye sıkıştırmaz; \"Olduğun gibi gel\" der.",
      "Kimi zaman güldüren, kimi zaman düşündüren bu programda moda, güzellik, yaşam ve pop kültür; insan hikâyeleri, özgüven ve dönüşümle iç içe konuşulur.",
      "Samimiyet burada bir stil değil, temel ilkedir.",
    ],
    presenter: "Sibel Arna",
    duration: "30–60 dk",
    featured: false,
    active: true,
    order: 2,
  },
  {
    title: "Dünyanın Parmak İzi",
    slug: "akademi",
    category: "Mini Belgesel",
    taglines: ["Her iz bir hikâye taşır."],
    images: ["/programs/hero5-kk.png", "/programs/hero5-kk.png", "/programs/hero5-kk.png", "/programs/hero5-kk.png", "/programs/hero5-kk.png"],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    description: ["Kendinizi korumanın ve güvende hissetmenin yolları..."],
    presenter: "",
    duration: "",
    featured: false,
    active: true,
    order: 3,
  },
  {
    title: "Kırmadan Konuşalım",
    slug: "kirmadan",
    category: "Soru - Cevap",
    taglines: ["Sağlık, doğru soruyla başlar."],
    images: ["/programs/4.png", "/programs/kirko.png", "/programs/kirko2.png", "/programs/kirko3.png"],
    youtubeUrl: "https://www.youtube.com/@ALAKA_Media",
    description: [
      "Kırmadan Konuşalım, sağlıkla ilgili konuları yargılamadan, korkutmadan ve panik yaratmadan ele alan modern bir farkındalık serisi.",
      "Her bölüm, günlük hayatta sık karşılaşılan yanlış kanaatlerle başlar; uzman görüşüyle sadeleşir ve izleyicinin hayatına uyarlanabilir küçük çözümlerle kapanır.",
      "Bu bir sağlık programı değil; bedenle dost, güvenli bir iletişim alanıdır. Bilgi vermeyi değil, doğru yerden konuşmayı önemser.",
    ],
    presenter: "Prof. Dr. Halil Atmaca",
    duration: "15–20 dk",
    format: "Sağlık / Bilinçlendirme / Talk-Based Educational",
    featured: false,
    active: true,
    order: 4,
  },
];

// ─── Team ───
const teamMembers = [
  { name: "MURAT AYGEN", role: "Kurucu & CEO, Yaratıcı Yönetmen", image: "/team/murataygen.png", bio: "Yakında...", active: true, order: 0 },
  { name: "NİHAN AYGEN", role: "Kurucu Ortak & İçerik Geliştirme Direktörü", image: "/team/nihanaygen.png", bio: "Yakında...", active: true, order: 1 },
  { name: "KAAN TOLGA DEĞİRMENCİ", role: "Yapımcı", image: "/team/tolga.png", bio: "Üretimi yalnızca yönetmez; baştan sona tasarlar, riski daha ortaya çıkmadan çözer.", active: true, order: 2 },
  { name: "DENİZ AKSOY", role: "Genel Koordinatör", image: "/team/deniz.png", bio: "Masada en az konuşan odur, çünkü kurduğu sistem tüm işleri yürütür. Deniz için iyi bir proje, hem doğru planlanmış hem de içinde çalışan herkesin nefes alabildiği bir projedir. Yıllar içinde farklı sektörlerde edindiği yöneticilik deneyimini şimdi ALAKA'da içerik, prodüksiyon ve operasyonu aynı ritimde tutmak için kullanıyor.", active: true, order: 3 },
  { name: "EDA BALCI", role: "Ofis Operasyonları, Konuk İlişkileri & Makyaj Uzmanı", image: "/team/eda.png", bio: "Sette dengeyi tutan görünmez güç; aceleye kapılmadan işi yoluna koyar. Makyajı 'sihir' diye ciddiye alan ama işi asla kasmayan ekibimizin enerjik dokunuş ustasıdır. Setlerde fırçayla, ofiste düzenle savaşır; ikisini de şaşırtıcı bir sakinlikle kazanır. ALAKA'da her kaosun ortasında iş ortaklarına 'Hadi!' diye gülümseyen tatlı güç.", active: true, order: 4 },
  { name: "ASLI GÖZÜTOK UZUN", role: "Yapım Koordinatörü", image: "/team/asli.png", bio: "Kaosu tanır, sahneyi de bilir; bu yüzden işin en kritik anında kontrol ondadır. Setlerden büyük sahnelere uzanan Aslı; sinema, televizyon ve müzik dünyasında onlarca sanatçıyla çalışmış güçlü bir koordinasyon ustasıdır. Yirmi yılı aşan deneyimini ALAKA'da projelere sakin bir zihin, net bir yön ve çok yönlü bir üretim disipliniyle taşır.", active: true, order: 5 },
  { name: "DEMET ÇALTEPE", role: "Editör & Yayın Koordinatörü", image: "/team/demet.png", bio: "Sessizdir ama keskindir; metnin söylemediğini bile görür. Demet, edebiyatla felsefeyi aynı masada buluşturup metinlere hem düzen hem ruh katan bir hikâye mimarıdır. Yayıncılıktaki uzun yolculuğunun ardından ALAKA'da içeriklerin nabzını tutuyor.", active: true, order: 6 },
  { name: "İBRAHİM TERBİYELİ", role: "Yönetmen & Kurgu Süpervizörü", image: "/team/ibrahim.png", bio: "Kadrajı süslemekle ilgilenmez; hikâyenin omurgasını görüntüyle kurar.", active: true, order: 7 },
  { name: "EMRAH DEMİRTAŞ", role: "Yönetmen & Görüntü Yönetmeni", image: "/team/emrah.png", bio: "Işığı teknikle değil, doğru anda yakalar; görüntüsü his bırakır.", active: true, order: 8 },
  { name: "BAŞAK ÇALIK", role: "Dijital Yayınlar & Sosyal Medya Uzmanı", image: "/team/basak.png", bio: "Ritmi sezgisel olarak yakalar; içerik ne zaman durmalı, ne zaman hızlanmalı iyi bilir.", active: true, order: 9 },
  { name: "SİBEL ARNA", role: "Program Yapımcısı & Sunucu", image: "/team/sibel.png", bio: "Yakında...", active: true, order: 10 },
  { name: "SERKAN CENKER", role: "Kreatif Direktör", image: "/team/serkan.png", bio: "Fikir üretir, dil kurar, tonu belirler; yaratıcı sürecin tamamına hâkimdir.", active: true, order: 11 },
];

// ─── Seed Function ───
async function seed() {
  console.log("🔥 Firestore seed başlıyor...\n");

  // Check if already seeded
  const heroSnap = await getDocs(collection(db, "hero"));
  const programsSnap = await getDocs(collection(db, "programs"));
  const teamSnap = await getDocs(collection(db, "team"));

  // Hero
  if (heroSnap.size > 0) {
    console.log(`⏭️  Hero: ${heroSnap.size} kayıt zaten mevcut, atlandı.`);
  } else {
    for (const item of heroItems) {
      await addDoc(collection(db, "hero"), { ...item, createdAt: serverTimestamp() });
    }
    console.log(`✅ Hero: ${heroItems.length} kayıt eklendi.`);
  }

  // Programs
  if (programsSnap.size > 0) {
    console.log(`⏭️  Programs: ${programsSnap.size} kayıt zaten mevcut, atlandı.`);
  } else {
    for (const item of programs) {
      await addDoc(collection(db, "programs"), { ...item, createdAt: serverTimestamp() });
    }
    console.log(`✅ Programs: ${programs.length} kayıt eklendi.`);
  }

  // Team
  if (teamSnap.size > 0) {
    console.log(`⏭️  Team: ${teamSnap.size} kayıt zaten mevcut, atlandı.`);
  } else {
    for (const item of teamMembers) {
      await addDoc(collection(db, "team"), { ...item, createdAt: serverTimestamp() });
    }
    console.log(`✅ Team: ${teamMembers.length} kayıt eklendi.`);
  }

  // Site Content
  const siteContentSnap = await getDocs(collection(db, "siteContent"));
  if (siteContentSnap.size > 0) {
    console.log(`⏭️  Site Content: ${siteContentSnap.size} kayıt zaten mevcut, atlandı.`);
  } else {
    const siteContentItems = [
      { key: "statement_divider", value: "Bazı Hikâyeler Tamamlanmaz." },
      { key: "quiet_line", value: "Hikâyesi olmayan hiçbir şeyle alakamız yok." },
      { key: "manifesto_title", value: "ALAKA MEDIA" },
      { key: "manifesto_body", value: "Görüntülerin, seslerin ve sözcüklerin hızla tükendiği bir çağda biz, insanın kendisiyle, doğayla ve birbirleriyle yeniden bağ kurabileceği hikâyeler üretiriz.\n\nHer ALAKA projesi tesadüfe değil, düşünce, vicdan ve sezgiyle doğar.\n\nBu yüzden ALAKA bir marka değil, üretmenin ve anlamı çoğaltmanın yolculuğudur. Bir markadan çok; bir ekosistem, bir okul, bir hatırlama alanı...\n\nBizim için her üretim bir iz bırakma sorumluluğudur. Samimiyet, estetik dürüstlük, insan merkezlilik ve çeşitlilik her işimizin özüdür." },
      { key: "manifesto_footer", value: "Her ALAKA projesi bir cevaptan çok bir sorudur — çünkü değişim sorularla başlar." },
      { key: "contact_subtitle", value: "Birlikte düşüneceksek, yaz." },
    ];
    for (const item of siteContentItems) {
      await setDoc(doc(db, "siteContent", item.key), { key: item.key, value: item.value, updatedAt: serverTimestamp() });
    }
    console.log(`✅ Site Content: ${siteContentItems.length} kayıt eklendi.`);
  }

  console.log("\n🎉 Seed tamamlandı!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
