"use client";

import { useEffect, useState } from "react";
import { LifeBuoy, Search, Send, Clock } from "lucide-react";
import { getAllTickets, respondToTicket, updateTicketStatus } from "@/lib/support/ticketService";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketStatus } from "@/types";

const MOCK_TICKETS: SupportTicket[] = [
  { id: "t1", customerId: "u1", customerName: "Priya Sharma", customerEmail: "priya@example.com", subject: "Order not delivered", message: "My order #NC-ABC123 was supposed to arrive yesterday but hasn't shown up yet.", category: "order", priority: "high", status: "open", createdAt: new Date("2026-06-28"), updatedAt: new Date("2026-06-28") },
  { id: "t2", customerId: "u2", customerName: "Rahul Mehta", customerEmail: "rahul@example.com", subject: "Refund not processed", message: "I returned an item 10 days ago and haven't received my refund yet.", category: "payment", priority: "urgent", status: "in_progress", createdAt: new Date("2026-06-25"), updatedAt: new Date("2026-06-26") },
  { id: "t3", customerId: "u3", customerName: "Anita Verma", customerEmail: "anita@example.com", subject: "Product size question", message: "Does the M size run true to size for this brand?", category: "product", priority: "low", status: "resolved", adminResponse: "Yes, this brand runs true to standard sizing.", respondedAt: new Date("2026-06-20"), createdAt: new Date("2026-06-19"), updatedAt: new Date("2026-06-20") },
];

const STATUS_STYLE: Record<TicketStatus, string> = {
  open: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
  in_progress: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  resolved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  closed: "bg-gray-100 dark:bg-gray-800 text-gray-500",
};

const PRIORITY_STYLE = {
  low: "text-gray-500",
  medium: "text-blue-600",
  high: "text-orange-600",
  urgent: "text-rose-600",
};

export default function SupportTicketsPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [respondTarget, setRespondTarget] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    getAllTickets()
      .then((data) => setTickets(data.length > 0 ? data : MOCK_TICKETS))
      .catch(() => setTickets(MOCK_TICKETS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRespond = async () => {
    if (!respondTarget || !responseText.trim()) return;
    try { await respondToTicket(respondTarget.id, responseText); } catch { /* demo mode */ }
    setTickets((prev) => prev.map((t) => t.id === respondTarget.id ? { ...t, adminResponse: responseText, respondedAt: new Date(), status: "resolved" as TicketStatus } : t));
    showToast("Response sent", "success");
    setRespondTarget(null);
    setResponseText("");
  };

  const handleStatusChange = async (ticket: SupportTicket, status: TicketStatus) => {
    try { await updateTicketStatus(ticket.id, status); } catch { /* demo mode */ }
    setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status } : t));
    showToast(`Ticket marked as ${status.replace("_", " ")}`, "info");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tickets.length} total tickets</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Open", value: tickets.filter((t) => t.status === "open").length, color: "text-rose-600" },
          { label: "In Progress", value: tickets.filter((t) => t.status === "in_progress").length, color: "text-blue-600" },
          { label: "Resolved", value: tickets.filter((t) => t.status === "resolved").length, color: "text-emerald-600" },
          { label: "Total", value: tickets.length, color: "text-gray-900 dark:text-white" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 transition-all w-56" />
        </div>
        {(["all", "open", "in_progress", "resolved", "closed"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn("text-xs font-semibold px-3 py-2 rounded-lg capitalize transition-all", statusFilter === s ? "bg-brand-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"><TableSkeleton rows={4} cols={6} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"><EmptyState icon={LifeBuoy} title="No tickets found" description="Support tickets from customers will appear here" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{ticket.subject}</p>
                    <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize", STATUS_STYLE[ticket.status])}>{ticket.status.replace("_", " ")}</span>
                    <span className={cn("text-[10px] font-bold uppercase", PRIORITY_STYLE[ticket.priority])}>{ticket.priority}</span>
                  </div>
                  <p className="text-xs text-gray-400">{ticket.customerName} · {ticket.customerEmail} · {ticket.createdAt.toLocaleDateString()}</p>
                </div>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket, e.target.value as TicketStatus)}
                  className="text-xs py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-brand-400"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ticket.message}</p>

              {ticket.adminResponse ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 flex items-start gap-2">
                  <Clock size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-0.5">Your Response</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{ticket.adminResponse}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setRespondTarget(ticket)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Send size={12} /> Respond to ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Respond modal */}
      {respondTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1">Respond to Ticket</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{respondTarget.subject}</p>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={5}
              placeholder="Write your response to the customer..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleRespond} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">Send Response</button>
              <button onClick={() => { setRespondTarget(null); setResponseText(""); }} className="px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
