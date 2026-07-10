import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getDbInstance, getStorageInstance } from "@/lib/firebase";

// ─── Upload ───
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(getStorageInstance(), path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(url: string) {
  try {
    const storageRef = ref(getStorageInstance(), url);
    await deleteObject(storageRef);
  } catch {
    // file may not exist
  }
}

// ─── Programs ───
export interface FirestoreProgram {
  id?: string;
  title: string;
  slug: string;
  category: string;
  taglines: string[];
  images: string[];
  youtubeUrl: string;
  description: string[];
  presenter: string;
  duration: string;
  format?: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt?: Timestamp;
}

const programsCol = () => collection(getDbInstance(), "programs");

export async function getPrograms(): Promise<FirestoreProgram[]> {
  const q = query(programsCol(), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProgram));
}

export async function getActivePrograms(): Promise<FirestoreProgram[]> {
  const q = query(programsCol(), where("active", "==", true), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProgram));
}

export async function getProgram(id: string): Promise<FirestoreProgram | null> {
  const snap = await getDoc(doc(getDbInstance(), "programs", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreProgram;
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

export async function addProgram(data: Omit<FirestoreProgram, "id" | "createdAt">) {
  return addDoc(programsCol(), { ...stripUndefined(data), createdAt: serverTimestamp() });
}

export async function updateProgram(id: string, data: Partial<FirestoreProgram>) {
  const { id: _id, createdAt: _ts, ...rest } = data;
  return updateDoc(doc(getDbInstance(), "programs", id), stripUndefined(rest));
}

export async function deleteProgram(id: string) {
  return deleteDoc(doc(getDbInstance(), "programs", id));
}

// ─── Team ───
export interface FirestoreTeamMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
}

const teamCol = () => collection(getDbInstance(), "team");

export async function getTeamMembers(): Promise<FirestoreTeamMember[]> {
  const q = query(teamCol(), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTeamMember));
}

export async function addTeamMember(data: Omit<FirestoreTeamMember, "id">) {
  return addDoc(teamCol(), stripUndefined(data));
}

export async function updateTeamMember(id: string, data: Partial<FirestoreTeamMember>) {
  return updateDoc(doc(getDbInstance(), "team", id), stripUndefined(data));
}

export async function deleteTeamMember(id: string) {
  return deleteDoc(doc(getDbInstance(), "team", id));
}

// ─── Hero / Showcase ───
export interface FirestoreHeroItem {
  id?: string;
  title: string[];
  category: string;
  image: string;
  href: string;
  badge?: string;
  order?: number;
}

const heroCol = () => collection(getDbInstance(), "hero");

export async function getHeroItems(): Promise<FirestoreHeroItem[]> {
  const q = query(heroCol(), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreHeroItem));
}

export async function addHeroItem(data: Omit<FirestoreHeroItem, "id">) {
  return addDoc(heroCol(), stripUndefined(data));
}

export async function updateHeroItem(id: string, data: Partial<FirestoreHeroItem>) {
  return updateDoc(doc(getDbInstance(), "hero", id), stripUndefined(data));
}

export async function deleteHeroItem(id: string) {
  return deleteDoc(doc(getDbInstance(), "hero", id));
}

// ─── Upcoming ───
export interface FirestoreUpcoming {
  id?: string;
  title: string;
  videoUrl: string;
  active: boolean;
  order: number;
}

const upcomingCol = () => collection(getDbInstance(), "upcoming");

export async function getUpcomingItems(): Promise<FirestoreUpcoming[]> {
  const q = query(upcomingCol(), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreUpcoming));
}

export async function addUpcomingItem(data: Omit<FirestoreUpcoming, "id">) {
  return addDoc(upcomingCol(), { ...stripUndefined(data), createdAt: serverTimestamp() });
}

export async function updateUpcomingItem(id: string, data: Partial<FirestoreUpcoming>) {
  const { id: _id, ...rest } = data;
  return updateDoc(doc(getDbInstance(), "upcoming", id), stripUndefined(rest));
}

export async function deleteUpcomingItem(id: string) {
  return deleteDoc(doc(getDbInstance(), "upcoming", id));
}

// ─── Site Content (Texts) ───
export interface FirestoreSiteContent {
  id?: string;
  key: string;
  value: string;
}

const siteContentCol = () => collection(getDbInstance(), "siteContent");

export async function getSiteContent(): Promise<FirestoreSiteContent[]> {
  const snap = await getDocs(siteContentCol());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSiteContent));
}

export async function updateSiteContent(id: string, value: string) {
  return updateDoc(doc(getDbInstance(), "siteContent", id), { value });
}

export async function addSiteContent(data: { key: string; value: string }) {
  return addDoc(siteContentCol(), data);
}

export async function deleteSiteContent(id: string) {
  return deleteDoc(doc(getDbInstance(), "siteContent", id));
}

// ─── Section Visibility ───
export interface SectionVisibility {
  hero: boolean;
  programs: boolean;
  manifesto: boolean;
  upcoming: boolean;
  team: boolean;
  contact: boolean;
}

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  programs: true,
  manifesto: true,
  upcoming: true,
  team: true,
  contact: true,
};

const visibilityDocRef = () => doc(getDbInstance(), "settings", "sectionVisibility");

export async function getSectionVisibility(): Promise<SectionVisibility> {
  const snap = await getDoc(visibilityDocRef());
  if (!snap.exists()) return { ...DEFAULT_VISIBILITY };
  return { ...DEFAULT_VISIBILITY, ...snap.data() } as SectionVisibility;
}

export async function updateSectionVisibility(data: Partial<SectionVisibility>) {
  const ref = visibilityDocRef();
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return updateDoc(ref, data as Record<string, unknown>);
  } else {
    return setDoc(ref, { ...DEFAULT_VISIBILITY, ...data });
  }
}

// ─── Contact Forms ───
export interface FirestoreContactForm {
  id?: string;
  name: string;
  email: string;
  message?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  kvkkConsent: boolean;
  read: boolean;
  createdAt?: Timestamp;
}

const contactFormsCol = () => collection(getDbInstance(), "contact_forms");

export async function getContactForms(): Promise<FirestoreContactForm[]> {
  const q = query(contactFormsCol(), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreContactForm));
}

export async function addContactForm(data: Omit<FirestoreContactForm, "id" | "createdAt" | "read">) {
  return addDoc(contactFormsCol(), { 
    ...stripUndefined(data), 
    read: false,
    createdAt: serverTimestamp() 
  });
}

export async function markContactFormAsRead(id: string) {
  return updateDoc(doc(getDbInstance(), "contact_forms", id), { read: true });
}

export async function deleteContactForm(id: string) {
  return deleteDoc(doc(getDbInstance(), "contact_forms", id));
}

// ─── Footer ───
export interface FirestoreNavLink {
  label: string;
  href: string;
}

export interface FirestoreSocialLink {
  label: string;
  href: string;
  icon: "instagram" | "x" | "tiktok" | "youtube";
}

export interface FirestoreFooter {
  copyright: string;
  privacyTitle: string;
  privacyContent: string;
  kvkkTitle: string;
  kvkkContent: string;
  navLinks: FirestoreNavLink[];
  socialLinks: FirestoreSocialLink[];
}

const DEFAULT_FOOTER: FirestoreFooter = {
  copyright: "© 2026 ALAKA Media. Tüm hakları saklıdır.",
  privacyTitle: "ALAKA MEDIA - Kişisel Verilerin Korunması ve İşlenmesi Politikası",
  privacyContent: `<p>Alaka Media olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuata uygun şekilde; iş ortaklarımızın, proje başvuru sahiplerinin, ziyaretçilerimizin, çalışanlarımızın ve tüm paydaşlarımızın kişisel verilerinin korunmasına önem veriyoruz.</p>
<h4>1. Kişisel Verilerin Toplanması ve İşlenmesi</h4>
<p>Kişisel veriler; yürüttüğümüz içerik üretimi, iş birliği süreçleri, proje başvuruları, sözleşme ilişkileri ve yasal yükümlülüklerimizin yerine getirilmesi amacıyla toplanmaktadır.</p>
<h4>2. Kişisel Verilerin Aktarılması</h4>
<p>Toplanan kişisel veriler, yalnızca faaliyetlerimizin gerektirdiği ölçüde ve yasal sınırlar içerisinde paylaşılabilir.</p>
<h4>3. Kişisel Veri Güvenliği</h4>
<p>Alaka Media, kişisel verilerin korunması konusunda gerekli teknik ve idari güvenlik önlemlerini almaktadır.</p>
<h4>4. Haklar ve Başvuru Süreçleri</h4>
<p>Bu haklara ilişkin taleplerinizi: <strong>info@alaka.pro</strong> adresine yazılı olarak iletebilirsiniz.</p>`,
  kvkkTitle: "ALAKA MEDIA - Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni",
  kvkkContent: `<h4>1. Veri Sorumlusu</h4>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Alaka Media ("Şirket") olarak, kişisel verileriniz veri sorumlusu sıfatıyla işlenmektedir.</p>
<h4>2. İşlenen Kişisel Veriler</h4>
<p>Web sitemiz üzerinden ad-soyad, e-posta adresi, mesaj içeriği, yüklenen dosyalar, IP adresi ve teknik erişim verileri işlenebilmektedir.</p>
<h4>3. İşleme Amaçları</h4>
<p>İletişim taleplerinin yanıtlanması, iş birliği ve proje başvurularının değerlendirilmesi, yasal yükümlülüklerin yerine getirilmesi ve web sitesi güvenliğinin sağlanması amaçlarıyla işlenmektedir.</p>
<h4>4. KVKK Kapsamındaki Haklarınız</h4>
<p>Bu kapsamda taleplerinizi: <strong>info@alaka.pro</strong> adresine yazılı olarak iletebilirsiniz.</p>`,
  navLinks: [
    { label: "ANA SAYFA", href: "#home" },
    { label: "BAK", href: "#bak" },
    { label: "OKU", href: "#oku" },
    { label: "TEMAS", href: "#temas" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com/alaka_media", icon: "instagram" },
    { label: "X", href: "https://x.com/alaka_media", icon: "x" },
    { label: "TikTok", href: "https://tiktok.com/@alaka_media", icon: "tiktok" },
    { label: "YouTube", href: "https://www.youtube.com/@ALAKA_Media", icon: "youtube" },
  ],
};

const footerDocRef = () => doc(getDbInstance(), "settings", "footer");

export async function getFooter(): Promise<FirestoreFooter> {
  const snap = await getDoc(footerDocRef());
  if (!snap.exists()) return { ...DEFAULT_FOOTER };
  return { ...DEFAULT_FOOTER, ...snap.data() } as FirestoreFooter;
}

export async function updateFooter(data: Partial<FirestoreFooter>) {
  const ref = footerDocRef();
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return updateDoc(ref, data as Record<string, unknown>);
  } else {
    return setDoc(ref, { ...DEFAULT_FOOTER, ...data });
  }
}
