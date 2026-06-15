/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, QrCode, Sparkles, User, Dumbbell, ShieldCheck, Menu, X, MessageSquare, Info, ShieldAlert, Coffee } from "lucide-react";

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
    { id: "home", label: "Головна", icon: Dumbbell },
    { id: "explore", label: "Каталог", icon: Compass },
    { id: "bar", label: "Фітнес-Бар", icon: Coffee },
    { id: "subscription", label: "Підписка", icon: ShieldCheck },
    { id: "qr", label: "QR Код", icon: QrCode },
    { id: "coach", label: "AI Коуч", icon: Sparkles },
    { id: "chat", label: "Чат & Групи", icon: MessageSquare },
    { id: "profile", label: "Профіль", icon: User },
    { id: "other", label: "Інше", icon: Info },
    { id: "admin", label: "Адмін-панель", icon: ShieldAlert },
  ];

  // Limit bottom bar items on mobile to prevent overcrowding (max 5 items)
  const mobileBottomBarItems = navItems.filter((item) =>
    ["home", "explore", "bar", "qr", "profile"].includes(item.id)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row font-sans">
      
      {/* 1. DESKTOP/TABLET SIDEBAR NAVIGATION (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-neutral-900 border-r border-neutral-805 h-screen sticky top-0 shrink-0 select-none">
        <div className="p-6 space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Dumbbell size={20} className="rotate-2" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white uppercase leading-none">
                GymPass <span className="text-indigo-400">UA</span>
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold font-mono">
                Єдиний Абонемент
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`desktop-sidebar-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                      : "text-neutral-400 hover:text-neutral-105 hover:bg-neutral-850"
                  }`}
                >
                  <Icon size={16} className={isSelected ? "animate-pulse" : "text-neutral-400"} />
                  <span>{item.label}</span>
                  {item.id === "qr" && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card / Subscription info inside Sidebar footer */}
        <div className="p-4 border-t border-neutral-805 bg-neutral-910/50">
          <div className="flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-805 rounded-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono">
                UA
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black leading-snug text-neutral-200">Мій Кабінет</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 font-mono truncate">
                  {userTier || "Неактивний"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="p-1 px-2 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-[10px] font-bold text-indigo-400 font-mono transition-colors border border-neutral-800"
            >
              Upg
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER NAVIGATION (Hidden on Desktop) */}
      <header className="md:hidden h-14 bg-neutral-900 border-b border-neutral-805 sticky top-0 z-40 flex items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-850 rounded-xl border border-neutral-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 w-full bg-neutral-900 border-b border-neutral-805 shadow-xl p-4 flex flex-col gap-2 z-50 animate-fade-in md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
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
              className="flex-1 flex flex-col items-center justify-center py-1 transition-colors group cursor-pointer"
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isSelected
                  ? "text-indigo-400 bg-indigo-950/40 border border-indigo-500/10"
                  : "text-neutral-500 group-hover:text-neutral-300"
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-[8.5px] font-bold mt-0.5 tracking-tight ${
                isSelected ? "text-indigo-400" : "text-neutral-500"
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
