import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { SupportTicket, TicketStatus } from "@/types";

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

export async function getCustomerTickets(customerId: string): Promise<SupportTicket[]> {
  try {
    const q = query(
      collection(db, "support_tickets"),
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        respondedAt: data.respondedAt ? toDate(data.respondedAt) : undefined,
      } as SupportTicket;
    });
  } catch {
    return [];
  }
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  try {
    const q = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        respondedAt: data.respondedAt ? toDate(data.respondedAt) : undefined,
      } as SupportTicket;
    });
  } catch {
    return [];
  }
}

export async function createTicket(
  data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "status">
): Promise<string> {
  const ref = await addDoc(collection(db, "support_tickets"), {
    ...data,
    status: "open" as TicketStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function respondToTicket(id: string, response: string, status: TicketStatus = "resolved"): Promise<void> {
  await updateDoc(doc(db, "support_tickets", id), {
    adminResponse: response,
    respondedAt: serverTimestamp(),
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
  await updateDoc(doc(db, "support_tickets", id), { status, updatedAt: serverTimestamp() });
}
