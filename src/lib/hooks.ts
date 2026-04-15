"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getDbInstance, isFirebaseConfigured } from "@/lib/firebase";
import type { FirestoreProgram, FirestoreTeamMember, FirestoreHeroItem, FirestoreUpcoming, FirestoreSiteContent } from "@/lib/firestore";

export function usePrograms() {
  const [programs, setPrograms] = useState<FirestoreProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const q = query(collection(getDbInstance(), "programs"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProgram)));
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  return { programs, loading };
}

export function useTeamMembers() {
  const [members, setMembers] = useState<FirestoreTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const q = query(collection(getDbInstance(), "team"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTeamMember)));
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  return { members, loading };
}

export function useHeroItems() {
  const [items, setItems] = useState<FirestoreHeroItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const q = query(collection(getDbInstance(), "hero"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreHeroItem)));
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  return { items, loading };
}

export function useUpcomingItems() {
  const [items, setItems] = useState<FirestoreUpcoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const q = query(collection(getDbInstance(), "upcoming"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreUpcoming));
      setItems(all.filter((u) => u.active !== false));
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  return { items, loading };
}

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return; }
    const unsubscribe = onSnapshot(collection(getDbInstance(), "siteContent"), (snap) => {
      const map: Record<string, string> = {};
      snap.docs.forEach((d) => {
        const data = d.data() as FirestoreSiteContent;
        map[data.key] = data.value;
      });
      setContent(map);
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  return { content, loading };
}
