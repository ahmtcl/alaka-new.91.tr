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
  category: string;
  taglines: string[];
  images: string[];
  youtubeUrl: string;
  description: string[];
  presenter: string;
  duration: string;
  format?: string;
  order?: number;
}

const programsCol = () => collection(getDbInstance(), "programs");

export async function getPrograms(): Promise<FirestoreProgram[]> {
  const q = query(programsCol(), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProgram));
}

export async function getProgram(id: string): Promise<FirestoreProgram | null> {
  const snap = await getDoc(doc(getDbInstance(), "programs", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreProgram;
}

export async function addProgram(data: Omit<FirestoreProgram, "id">) {
  return addDoc(programsCol(), data);
}

export async function updateProgram(id: string, data: Partial<FirestoreProgram>) {
  return updateDoc(doc(getDbInstance(), "programs", id), data);
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
  return addDoc(teamCol(), data);
}

export async function updateTeamMember(id: string, data: Partial<FirestoreTeamMember>) {
  return updateDoc(doc(getDbInstance(), "team", id), data);
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
  return addDoc(heroCol(), data);
}

export async function updateHeroItem(id: string, data: Partial<FirestoreHeroItem>) {
  return updateDoc(doc(getDbInstance(), "hero", id), data);
}

export async function deleteHeroItem(id: string) {
  return deleteDoc(doc(getDbInstance(), "hero", id));
}
