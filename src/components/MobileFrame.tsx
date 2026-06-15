/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, QrCode, Sparkles, User, Dumbbell, ShieldCheck, Menu, X, MessageSquare, Info, ShieldAlert, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userTier?: string | null;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  userTier,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Головна", icon: Dumbbell, color: "hover:text-amber-400" },
    { id: "explore", label: "Каталог", icon: Compass, color: "hover:text-teal-400" },
    { id: "bar", label: "Фітнес-Бар", icon: Coffee, color: "hover:text-emerald-400" },
    { id: "subscription", label: "Підписка", icon: ShieldCheck, color: "hover:text-indigo-400" },
    { id: "qr", label: "QR Код", icon: QrCode, color: "hover:text-orange-400" },
    { id: "coach", label: "AI Коуч", icon: Sparkles, color: "hover:text-indigo-400" },
    { id: "chat", label: "Чат & Групи", icon: MessageSquare, color: "hover:text-sky-400" },
    { id: "profile", label: "Профіль", icon: User, color: "hover:text-pink-400" },
    { id: "other", label: "Інше", icon: Info, color: "hover:text-neutral-400" },
    { id: "admin", label: "Адмін-панель", icon: ShieldAlert, color: "hover:text-rose-400" },
  ];

  // Limit bottom bar items on mobile to prevent overcrowding (max 5 items)
  const mobileBottomBarItems = navItems.filter((item) =>
    ["home", "explore", "bar", "qr", "profile"].includes(item.id)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row font-sans">
      
      {/* 1. DESKTOP/TABLET SIDEBAR NAVIGATION (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-neutral-900 border-r border-neutral-805 h-screen sticky top-0 shrink-0 select-none z-30">
        <div className="p-6 space-y-8">
          {/* Logo Brand Header with gentle hover rotation */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover="hover"
            onClick={() => setActiveTab("home")}
          >
            <motion.div 
              className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30"
              variants={{
                hover: { rotate: [0, -10, 10, -5, 5, 0], scale: 1.05 }
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Dumbbell size={20} className="rotate-2" />
            </motion.div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white uppercase leading-none">
                GymPass <span className="text-indigo-400">UA</span>
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold font-mono">
                Єдиний Абонемент
              </span>
            </div>
          </motion.div>

          {/* Navigation Links with animated sliding indicator */}
          <nav className="space-y-1.5 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  id={`desktop-sidebar-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors duration-200 cursor-pointer relative ${
                    isSelected ? "text-white" : "text-neutral-400 hover:text-neutral-100"
                  }`}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Sliding active background indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg shadow-indigo-600/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <motion.div
                    variants={{
                      hover: { scale: 1.25, rotate: isSelected ? 0 : [0, -12, 12, 0] }
                    }}
                    transition={{
                      scale: { type: "spring", stiffness: 400, damping: 15 },
                      rotate: { type: "keyframes", duration: 0.3 }
                    }}
                    className="flex items-center justify-center"
                  >
                    <Icon size={16} className={isSelected ? "text-white" : "text-neutral-400"} />
                  </motion.div>

                  <span>{item.label}</span>

                  {item.id === "qr" && (
                    <motion.span 
                      className="ml-auto w-2 h-2 rounded-full bg-indigo-400" 
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Card / Subscription info inside Sidebar footer */}
        <div className="p-4 border-t border-neutral-805 bg-neutral-910/50">
          <motion.div 
            className="flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-805 rounded-2xl"
            whileHover={{ scale: 1.02, borderColor: "#4f46e5" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <motion.div 
                className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                UA
              </motion.div>
              <div className="min-w-0">
                <p className="text-[11px] font-black leading-snug text-neutral-200">Мій Кабінет</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 font-mono truncate">
                  {userTier || "Неактивний"}
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setActiveTab("profile")}
              className="p-1 px-2 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-[10px] font-bold text-indigo-400 font-mono transition-colors border border-neutral-800 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upg
            </motion.button>
          </motion.div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER NAVIGATION (Hidden on Desktop) */}
      <header className="md:hidden h-14 bg-neutral-900 border-b border-neutral-805 sticky top-0 z-40 flex items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-2" onClick={() => setActiveTab("home")}>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Dumbbell size={16} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-white uppercase leading-none">
              GymPass <span className="text-indigo-400">UA</span>
            </h1>
          </div>
        </div>

        {/* Right side actions and hamburger */}
        <div className="flex items-center gap-2">
          {userTier && (
            <span className="text-[9px] font-black uppercase bg-indigo-500/15 border border-indigo-505/20 text-indigo-400 px-2 py-1 rounded-full font-mono">
              {userTier}
            </span>
          )}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-850 rounded-xl border border-neutral-800 cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>

        {/* Mobile Dropdown Drawer Menu utilizing Framer Motion for premium fluidity */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-14 left-0 w-full bg-neutral-900 border-b border-neutral-805 shadow-xl p-4 flex flex-col gap-1.5 z-55 md:hidden overflow-hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors duration-200 ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon size={15} className={isSelected ? "text-white" : "text-neutral-400"} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. MAIN WORKSPACE VIEWER CONTAINER */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto no-scrollbar relative">
        
        {/* Decorative background radial glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none z-0" />

        {/* Active Content Panel */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:p-8 lg:p-10 z-10 space-y-6 pb-24 md:pb-10">
          {children}
        </main>
      </div>

      {/* 4. FLOATING MOBILE ICON BOTTOM-BAR (Fallback standard bottom bar for fast touch navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-neutral-910/95 backdrop-blur-md border-t border-neutral-805 px-3 py-2 flex justify-between items-center z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        {mobileBottomBarItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-colors group cursor-pointer relative"
            >
              <motion.div 
                className={`p-1.5 rounded-xl transition-all ${
                  isSelected
                    ? "text-indigo-400 bg-indigo-950/40 border border-indigo-500/10"
                    : "text-neutral-500 group-hover:text-neutral-300"
                }`}
                whileTap={{ scale: 0.85 }}
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <Icon size={18} />
              </motion.div>
              <span className={`text-[8.5px] font-bold mt-0.5 tracking-tight ${
                isSelected ? "text-indigo-400 animate-pulse" : "text-neutral-500"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
