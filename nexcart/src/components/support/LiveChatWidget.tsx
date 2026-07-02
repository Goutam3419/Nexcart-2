"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User as UserIcon } from "lucide-react";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

function findFaqAnswer(query: string): string | null {
  const lower = query.toLowerCase();
  const match = faqs.find((f) =>
    f.question.toLowerCase().split(" ").some((word) => word.length > 3 && lower.includes(word))
  );
  return match?.answer ?? null;
}

const QUICK_REPLIES = ["Track my order", "Return policy", "Payment methods", "Talk to support"];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! 👋 I'm the NexCart assistant. Ask me anything about orders, returns, or payments — or type 'support' to reach our team.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      let reply: string;
      if (text.toLowerCase().includes("support") || text.toLowerCase().includes("talk to")) {
        reply = "I've noted your request! Please visit our Help Center to raise a support ticket, and our team will respond within 24 hours.";
      } else {
        reply = findFaqAnswer(text) ?? "I'm not sure about that. Try our Help Center for more FAQs, or raise a support ticket and our team will help you personally.";
      }
      setMessages((prev) => [...prev, { id: `b_${Date.now()}`, sender: "bot", text: reply, timestamp: new Date() }]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-2xl shadow-brand-600/40 flex items-center justify-center transition-all active:scale-95"
        aria-label="Open chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[28rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">NexCart Assistant</p>
              <p className="text-[10px] text-white/70">Usually replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2", msg.sender === "user" && "flex-row-reverse")}>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", msg.sender === "bot" ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300")}>
                  {msg.sender === "bot" ? <Bot size={12} /> : <UserIcon size={12} />}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed",
                  msg.sender === "bot"
                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none"
                    : "bg-brand-600 text-white rounded-tr-none"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick replies — shown only at start */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pl-8">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => sendMessage(qr)}
                    className="text-[11px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1.5 rounded-lg hover:border-brand-300 hover:text-brand-600 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            <button type="submit" className="w-9 h-9 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all shrink-0">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
