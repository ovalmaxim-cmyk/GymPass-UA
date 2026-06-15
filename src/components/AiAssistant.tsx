/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfile } from "../types";
import { Send, Sparkles, User, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AiAssistantProps {
  userProfile: UserProfile;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Привіт, ${userProfile.name}! 👋 Я твій персональний AI Коуч GymPass UA. 

Допоможу підібрати спортзали у місті ${userProfile.currentCity}, підкажу корисні вправи або розпишу індивідуальну програму тренувань під твій тариф **${userProfile.currentTier || "Лайт"}**.

Сформулювати спортивну ціль на сьогодні? 💪`,
      timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt paths for user
  const initialSuggestions = [
    { text: "Склади план тренувань 🏋️‍♂️", prompt: "Склади мені детальну програму тренувань на тиждень" },
    { text: "Порадь зали у м. Київ 🏊", prompt: "Які найкращі зали з басейнами чи кросфітом є в моєму місті?" },
    { text: "Рецепт корисного сніданку 🥑", prompt: "Підкажи здоровий збалансований сніданок для високого тонусу" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          userInfo: {
            name: userProfile.name,
            currentCity: userProfile.currentCity,
            currentTier: userProfile.currentTier,
            currentStreak: userProfile.currentStreak,
            totalWorkouts: userProfile.totalWorkouts,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати відповідь від сервера коуча.");
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: `bot_${Math.random().toString(36).substring(2, 9)}`,
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "bot",
        text: "Виникла помилка з'єднання із сервером. Проте не хвилюйся! Продовжуй пити воду та регулярно відвідувати улюблені спортклуби з єдиним абонементом GymPass UA! 💪",
        timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Очистити всю історію чату з AI Коучем?")) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: `Чат успішно перезапущено. Я готовий складати нові спортивні виклики для тебе, ${userProfile.name}! Напиши мені своє питання. 🧭`,
          timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div id="ai-assistant-panel" className="flex flex-col h-[520px] bg-neutral-950 rounded-3xl border border-neutral-850 shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
      
      {/* Header bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-3.5 flex items-center justify-between shadow-sm z-10 shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/15">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-450 uppercase tracking-widest font-black font-mono block">
              Розумний Експерт
            </span>
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-black text-neutral-100">AI Коуч GymGPT</h4>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            </div>
          </div>
        </div>

        <button
          id="btn-clear-chat"
          onClick={clearChat}
          title="Очистити історію"
          className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-neutral-800 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages wrapper scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 z-10 select-text">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`flex items-end gap-2.5 max-w-[85%] ${isBot ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                  isBot 
                    ? "bg-neutral-900 text-neutral-350 border-neutral-800" 
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                }`}>
                  {isBot ? "AI" : <User size={10} />}
                </div>

                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isBot 
                    ? "bg-neutral-900 border border-neutral-800 text-neutral-205 rounded-bl-none" 
                    : "bg-indigo-600 text-white font-semibold rounded-br-none"
                }`}>
                  {/* Formatted inline blocks of paragraph text */}
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <span className={`text-[8px] mt-1.5 block text-right font-medium font-mono ${isBot ? "text-neutral-500" : "text-indigo-250 opacity-80"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* typing animation state */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2.5 max-w-[80%]"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-neutral-350 flex items-center justify-center shrink-0 border border-neutral-800 text-[10px]">
              AI
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts on raw chat state */}
      {messages.length <= 1 && !isLoading && (
        <div className="p-3.5 space-y-2 z-10 shrink-0 border-t border-neutral-800 bg-neutral-950 font-sans">
          <p className="text-[9px] text-neutral-450 uppercase tracking-widest font-bold font-mono">Швидкі запити Коучу:</p>
          <div className="flex flex-col gap-1.5 font-sans">
            {initialSuggestions.map((sug, idx) => (
              <button
                key={idx}
                id={`btn-sug-chat-${idx}`}
                onClick={() => handleSendMessage(sug.prompt)}
                className="text-[11px] font-bold text-left px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-350 hover:border-indigo-500 hover:text-indigo-400 transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                {sug.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input container footer */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-3 flex gap-2 items-center shrink-0 z-10">
        <input
          id="chat-input-box"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder="Спитай будь-що про тренування..."
          disabled={isLoading}
          className="flex-1 bg-neutral-950 border border-neutral-800 text-xs px-3.5 py-2.5 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors text-white"
        />
        <button
          id="btn-send-chat"
          disabled={!input.trim() || isLoading}
          onClick={() => handleSendMessage(input)}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-950 disabled:text-neutral-500 p-2.5 rounded-2xl text-white transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
