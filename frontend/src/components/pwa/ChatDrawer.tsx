"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Language, translations } from "@/lib/i18n";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const INITIAL_MESSAGES = [
  {
    id: "m1",
    sender: "Sunil Yadav",
    role: "SUPERVISOR",
    text: "Rameshwar ji, the organic soil testing report for Plot 1 is verified. 2.4% organic carbon achieved!",
    time: "10:15 AM",
    isOwn: false,
  },
  {
    id: "m2",
    sender: "You (Rameshwar Patel)",
    role: "FARMER",
    text: "Very good news Sunil ji! When will the irrigation drip pipes be installed on Plot 2?",
    time: "10:18 AM",
    isOwn: true,
  },
  {
    id: "m3",
    sender: "Sunil Yadav",
    role: "SUPERVISOR",
    text: "Scheduled for Oct 10th. I'll upload site visit photos after confirmation from Admin.",
    time: "10:21 AM",
    isOwn: false,
  },
];

export function ChatDrawer({ isOpen, onClose, lang }: ChatDrawerProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: "You (Rameshwar Patel)",
      role: "FARMER",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }]);
    setInputText("");
    // Simulate supervisor reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ms${Date.now()}`,
        sender: "Sunil Yadav",
        role: "SUPERVISOR",
        text: lang === "hi" ? "जी, मैं देख रहा हूं। कल तक पुष्टि करता हूं।" : "Understood. I'll confirm by tomorrow morning.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      }]);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-forest-950/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-forest-950 border-l border-forest-800 flex flex-col shadow-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-forest-800 bg-forest-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-leaf-500 to-forest-700 flex items-center justify-center text-white font-bold text-sm">
                  SY
                </div>
                <div>
                  <p className="text-sm font-bold text-cream-100">Sunil Yadav</p>
                  <p className="text-[10px] text-leaf-400 font-mono">{t.roleSupervisor} • {t.sectionProjects ? "SJ-PROJ-101" : "SJ-PROJ-101"}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-forest-800 text-cream-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                    msg.isOwn
                      ? "bg-leaf-600 text-white rounded-br-sm"
                      : "bg-forest-800 text-cream-100 border border-forest-700 rounded-bl-sm"
                  }`}>
                    {!msg.isOwn && (
                      <p className="text-[10px] font-bold text-leaf-400 mb-1">{msg.sender}</p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-leaf-200/70" : "text-cream-400"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-forest-800 bg-forest-900/60 flex items-center gap-3">
              <button type="button" className="text-cream-400 hover:text-leaf-400 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={lang === "hi" ? "संदेश लिखें..." : "Type a message..."}
                className="flex-1 bg-forest-950 border border-forest-700 rounded-xl px-4 py-2.5 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-leaf-500"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-leaf-500 text-forest-950 flex items-center justify-center hover:bg-leaf-400 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
