import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
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
