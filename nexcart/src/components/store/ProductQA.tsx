"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import type { ProductQuestion } from "@/types";

const MOCK_QUESTIONS: ProductQuestion[] = [
  {
    id: "q1",
    productId: "demo",
    customerId: "u1",
    customerName: "Karan Patel",
    question: "Does this come with a warranty?",
    answer: "Yes, this product comes with a 1-year manufacturer warranty covering defects.",
    answeredBy: "NexCart Team",
    isAdminAnswer: true,
    createdAt: new Date("2026-06-10"),
  },
  {
    id: "q2",
    productId: "demo",
    customerId: "u2",
    customerName: "Sunita Rao",
    question: "Is this suitable for daily use?",
    answer: "Absolutely, thousands of customers use this daily. It's built for regular wear and tear.",
    answeredBy: "NexCart Team",
    isAdminAnswer: true,
    createdAt: new Date("2026-06-08"),
  },
];

interface ProductQAProps {
  productId: string;
}

export function ProductQA({ productId }: ProductQAProps) {
  const { appUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<ProductQuestion[]>(MOCK_QUESTIONS);
  const [newQuestion, setNewQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const question: ProductQuestion = {
      id: `q_${Date.now()}`,
      productId,
      customerId: appUser?.uid ?? "guest",
      customerName: appUser?.name ?? "Guest User",
      question: newQuestion.trim(),
      isAdminAnswer: false,
      createdAt: new Date(),
    };

    setQuestions((prev) => [question, ...prev]);
    setNewQuestion("");
    setShowForm(false);
    showToast("Question submitted! Our team will answer soon.", "success");
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-brand-600" />
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Questions &amp; Answers</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          {showForm ? "Cancel" : "Ask a Question"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={isAuthenticated ? "Ask about size, quality, usage..." : "Ask a question (sign in for faster replies)"}
            className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          <button type="submit" className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-600/30">
            Submit
          </button>
        </form>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="border-b border-gray-50 dark:border-gray-800 pb-4 last:border-0">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{q.question}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.customerName} · {q.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              {q.answer ? (
                <div className="flex items-start gap-2 ml-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  {q.isAdminAnswer && <ShieldCheck size={13} className="text-emerald-600 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{q.answer}</p>
                    <p className="text-xs text-gray-400 mt-1">— {q.answeredBy}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 ml-6 italic">Awaiting response from our team...</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
