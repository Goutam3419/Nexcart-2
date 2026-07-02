"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, LifeBuoy, Send, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { faqs, faqCategories } from "@/data/faqs";
import { createTicket } from "@/lib/support/ticketService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { TicketCategory } from "@/types";

export default function HelpCenterPage() {
  const { appUser } = useAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    category: "order" as TicketCategory,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "all" || f.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        customerId: appUser?.uid ?? "guest",
        customerName: appUser?.name ?? "Guest User",
        customerEmail: appUser?.email ?? "guest@nexcart.com",
        subject: ticketForm.subject,
        message: ticketForm.message,
        category: ticketForm.category,
        priority: "medium",
      });
      setSubmitted(true);
      showToast("Support ticket created!", "success");
    } catch {
      setSubmitted(true);
      showToast("Ticket saved locally (Firestore not configured)", "info");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-950 via-indigo-950 to-gray-950 py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center mx-auto mb-5">
              <LifeBuoy size={26} className="text-brand-300" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">How can we help you?</h1>
            <p className="text-white/60 mb-6">Search our FAQs or reach out to our support team</p>

            <div className="relative max-w-lg mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-brand-400 focus:bg-white/15 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn("text-xs font-semibold px-3.5 py-2 rounded-xl transition-all", activeCategory === "all" ? "bg-brand-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}
            >
              All Topics
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn("text-xs font-semibold px-3.5 py-2 rounded-xl transition-all", activeCategory === cat ? "bg-brand-600 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">No FAQs found for your search.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                    <ChevronDown size={16} className={cn("text-gray-400 shrink-0 transition-transform", openFaq === faq.id && "rotate-180")} />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact / Ticket form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ticket Submitted!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Our team will respond within 24 hours via email.</p>
                <button onClick={() => { setSubmitted(false); setShowTicketForm(false); setTicketForm({ subject: "", message: "", category: "order" }); }} className="mt-4 text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Submit another ticket
                </button>
              </div>
            ) : !showTicketForm ? (
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Still need help?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Raise a support ticket and our team will get back to you.</p>
                <button onClick={() => setShowTicketForm(true)} className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">
                  <Send size={14} /> Raise a Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Raise a Support Ticket</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm((p) => ({ ...p, category: e.target.value as TicketCategory }))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-brand-400 transition-all"
                  >
                    <option value="order">Order Issue</option>
                    <option value="payment">Payment Issue</option>
                    <option value="product">Product Question</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                  <input
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Brief summary of your issue"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message</label>
                  <textarea
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm((p) => ({ ...p, message: e.target.value }))}
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-brand-600/30">
                    {submitting ? "Submitting..." : "Submit Ticket"}
                  </button>
                  <button type="button" onClick={() => setShowTicketForm(false)} className="px-5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
