'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Phone,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SchoolChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Assalam-o-Alaikum & Welcome to Creek View Academy! 🎓\n\nI am your AI School Assistant. I can help you in English. How may I assist you today? Ask about Admissions 2026-27, 3-Day Daily Diary, Campuses, or Teacher Login.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content:
              'Thank you for contacting Creek View Academy. Please message our official WhatsApp helpline directly at +92 312 6172674.',
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'Connection error. You can reach our administrative helpline on WhatsApp at +92 312 6172674.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const starterChips = [
    'Tell me about admissions for 2026-27',
    'How can I check the daily homework diary?',
    'Where are the 3 campuses located? (English)',
    'How can teachers log in and upload the diary?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-[82px] z-50 bg-[#8B0000] hover:bg-red-800 text-white rounded-full p-2.5 shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border-2 border-white cursor-pointer group"
          aria-label="Open School AI Chat Assistant"
        >
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#8B0000]"></span>
          </div>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-16  z-50 w-[82vw] lg:w-[25%] max-h-[85vh] h-[580px] bg-white rounded-3xl shadow-2xl border-2 border-red-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#8B0000] text-white p-4 flex items-center justify-between border-b border-red-900">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white text-[#8B0000] rounded-xl flex items-center justify-center font-bold shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide flex items-center gap-1.5">
                  <span>Creek View AI Help</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-white/80">
                  English-language school assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      content:
                        'Welcome! I am the Creek View Academy AI Assistant. Please ask your question in English.',
                    },
                  ])
                }
                title="Restart Chat"
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/60 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-[#8B0000] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-line shadow-xs ${msg.role === 'user'
                    ? 'bg-[#8B0000] text-white rounded-br-xs font-medium'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs font-normal'
                    }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#8B0000] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-[#8B0000] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-gray-500 ml-1">Detecting language & replying...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick starter chips */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
              {starterChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="text-[11px] bg-red-50 hover:bg-red-100 text-[#8B0000] font-semibold px-2.5 py-1 rounded-full border border-red-200/60 transition cursor-pointer text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question in English..."
                className="flex-1 bg-gray-100 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#8B0000] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#8B0000] hover:bg-red-800 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1 text-center">
              <span className="text-[10px] text-gray-400">
                Official Helpline WhatsApp: +92 312 6172674
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
