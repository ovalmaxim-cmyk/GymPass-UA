/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, Flame, Calendar, Dumbbell, ShieldCheck, Heart, Sparkles, TrendingUp } from "lucide-react";

interface UserStatsProps {
  totalWorkouts: number;
  currentStreak: number;
  currentCity: string;
}

export const UserStats: React.FC<UserStatsProps> = ({
  totalWorkouts,
  currentStreak,
  currentCity,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<"weekly" | "categories">("weekly");

  // Mock weekly training activity for display
  const weeklyData = [
    { day: "Пн", count: 1, label: "Силове" },
    { day: "Вт", count: 0, label: "Відпочинок" },
    { day: "Ср", count: 2, label: "Басейн + Йога" },
    { day: "Чт", count: 0, label: "Відпочинок" },
    { day: "Пт", count: 1, label: "Кросфіт" },
    { day: "Сб", count: 1, label: "Тренажери" },
    { day: "Нд", count: 0, label: "Відпочинок" },
  ];

  const categoryShare = [
    { name: "Басейн", percentage: 35, color: "bg-cyan-500", text: "text-cyan-400" },
    { name: "Тренажерний зал", percentage: 40, color: "bg-indigo-500", text: "text-indigo-400" },
    { name: "Кроссфіт", percentage: 15, color: "bg-purple-500", text: "text-purple-400" },
    { name: "Йога та Пілатес", percentage: 10, color: "bg-amber-500", text: "text-amber-400" },
  ];

  // User badges configuration
  const achievements = [
    {
      id: "ach_1",
      title: "Рання Пташка 🌅",
      desc: "Тренування до 9:00 ранку в будь-якому залі",
      unlocked: true,
      points: 100,
    },
    {
      id: "ach_2",
      title: "Володар Води 🧜‍♂️",
      desc: "Відвідати 3 різних басейни міста",
      unlocked: true,
      points: 250,
    },
    {
      id: "ach_3",
      title: "Залізна Воля 💪",
      desc: "Досягти регулярної серії з 5+ днів",
      unlocked: currentStreak >= 5,
      points: 500,
    },
    {
      id: "ach_4",
      title: "Мандрівник 🗺️",
      desc: "Сходити в зал поза межами рідного міста",
      unlocked: false,
      points: 300,
    },
  ];

  return (
    <div id="user-stats-dashboard" className="space-y-6 font-sans">
      {/* 3 bento style fast metrics grid counters */}
      <div className="grid grid-cols-3 gap-3">
        <div id="metric-workouts" className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm">
          <Calendar size={16} className="text-neutral-500" />
          <div className="mt-3">
            <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block font-mono">Занять</span>
            <span className="text-xl font-black text-neutral-100 font-mono mt-0.5 block">
              {totalWorkouts}
            </span>
          </div>
        </div>

        <div id="metric-streak" className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm">
          <Flame size={16} className="text-orange-500 animate-pulse" />
          <div className="mt-3">
            <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block font-mono">Серія</span>
            <span className="text-xl font-black text-neutral-105 font-mono mt-0.5 block flex items-end gap-1 leading-tight">
              {currentStreak}<span className="text-[10px] text-orange-500 font-bold font-sans">днів</span>
            </span>
          </div>
        </div>

        <div id="metric-co2" className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm">
          <TrendingUp size={16} className="text-indigo-400" />
          <div className="mt-3">
            <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider block font-mono">XP Накопичено</span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-0.5 block">
              {totalWorkouts * 150}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Custom Analytics section with chart toggle tabs */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-805">
          <span className="text-xs font-black text-neutral-100 uppercase tracking-tight">Аналітика активності</span>
          
          <div className="flex bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-[10px] font-bold">
            <button
              id="btn-tab-weekly"
              onClick={() => setActiveChartTab("weekly")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeChartTab === "weekly"
                  ? "bg-indigo-600 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Тиждень
            </button>
            <button
              id="btn-tab-categories"
              onClick={() => setActiveChartTab("categories")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeChartTab === "categories"
                  ? "bg-indigo-600 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Категорії
            </button>
          </div>
        </div>

        {/* Dynamic Graphic layout */}
        <div className="pt-5 h-44 flex items-end justify-center">
          {activeChartTab === "weekly" ? (
            <div className="w-full h-full flex items-end justify-between px-2 gap-2">
              {weeklyData.map((item, idx) => {
                const heightPercent = item.count === 0 ? "h-2" : item.count === 1 ? "h-20" : "h-36";
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer z-10">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 text-[8px] bg-neutral-950 border border-neutral-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-medium">
                        {item.label}
                      </span>
                      {/* Bar capsule pill */}
                      <div className={`w-3.5 rounded-full transition-all duration-500 ${heightPercent} ${
                        item.count === 0 
                          ? "bg-neutral-950" 
                          : item.count === 1 
                            ? "bg-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.3)]" 
                            : "bg-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.5)]"
                      }`} />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold font-mono">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3 justify-center h-full">
              {categoryShare.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                    <span>{cat.name}</span>
                    <span className={`${cat.text} font-mono font-bold`}>{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gamification Badges List */}
      <div className="space-y-3 font-medium">
        <h4 className="text-xs font-black text-neutral-100 uppercase tracking-tight">Спортивні досягнення</h4>
        <div className="grid grid-cols-2 gap-3.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              id={`ach-card-${ach.id}`}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-1.5 transition-all text-xs h-28 ${
                ach.unlocked
                  ? "bg-indigo-500/5 border-indigo-500/25 text-neutral-100"
                  : "bg-neutral-900/40 border-neutral-850 text-neutral-500 border"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-extrabold leading-snug">{ach.title}</span>
                <Award size={15} className={ach.unlocked ? "text-indigo-400 animate-pulse" : "text-neutral-700"} />
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                {ach.desc}
              </p>
              <span className={`text-[9px] font-black self-start px-2 py-0.5 rounded mt-1 font-mono ${
                ach.unlocked 
                  ? "bg-indigo-500/10 text-indigo-405 border border-indigo-500/20" 
                  : "bg-neutral-950 border border-neutral-850 text-neutral-500"
              }`}>
                +{ach.points} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
