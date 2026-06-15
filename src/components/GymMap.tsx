/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Gym } from "../types";
import { MapPin, Info, ArrowRight, ShieldCheck } from "lucide-react";

interface GymMapProps {
  gyms: Gym[];
  selectedCity: string;
  onSelectGym: (gym: Gym) => void;
  activeGymId?: string;
}

export const GymMap: React.FC<GymMapProps> = ({
  gyms,
  selectedCity,
  onSelectGym,
  activeGymId,
}) => {
  const [hoveredGym, setHoveredGym] = useState<Gym | null>(null);
  const [localCity, setLocalCity] = useState(selectedCity === "Всі міста" ? "Київ" : selectedCity);

  useEffect(() => {
    if (selectedCity !== "Всі міста") {
      setLocalCity(selectedCity);
    }
  }, [selectedCity]);

  // Filter gyms to display on this city map
  const activeGyms = gyms.filter((g) => g.city === localCity);

  const getCityBackgroundDesc = (city: string) => {
    switch (city) {
      case "Київ":
        return "Карта залів столиці — Дніпровська набережна, Подол, Печерськ";
      case "Львів":
        return "Культурна столиця фітнесу — Центр, вул. Джерела, Героїв УПА";
      case "Одеса":
        return "Морське узбережжя, Аркадія, Парк Шевченка";
      case "Дніпро":
        return "Індустріальний пульс — Набережна Перемоги";
      case "Харків":
        return "Залізна міцність — просп. Науки";
      case "Івано-Франківськ":
        return "Прикарпатський куточок здоров'я — вул. Мазепи";
      default:
        return "Об'єднана мережа партнерських спортивних закладів";
    }
  };

  return (
    <div id="gym-map-container" className="relative bg-zinc-950 dark:bg-black rounded-3xl p-4 overflow-hidden shadow-inner border border-zinc-800 h-[280px] flex flex-col justify-between">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none" />
      
      {/* Radars & ambient rings */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-emerald-500/10 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-emerald-500/10 pointer-events-none" />

      {/* Map Header details */}
      <div className="relative z-10 flex justify-between items-start gap-3">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-full">
            Інтерактивний Радар
          </span>
          <h4 className="text-sm font-bold text-white mt-1 flex items-center gap-1">
            <MapPin size={13} className="text-emerald-500" /> {localCity}
          </h4>
          <p className="text-[10px] text-zinc-500 mt-0.5 max-w-[200px] leading-tight">
            {getCityBackgroundDesc(localCity)}
          </p>
        </div>

        {/* Legend */}
        <div className="text-[9px] bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl text-zinc-400 space-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span>Базовий зал</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Преміум / SPA</span>
          </div>
        </div>
      </div>

      {/* Main Map interactive canvas */}
      <div className="relative w-full h-[140px] bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden mt-2">
        {/* Simplified abstract city routes (rivers, grids) */}
        <svg className="absolute inset-0 w-full h-full opacity-30 select-none pointer-events-none">
          {/* Wave-shaped river or main avenue */}
          <path
            d="M -10 70 C 80 40, 120 100, 200 60 C 280 20, 320 80, 420 50"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-40 animate-dash"
          />
          {/* Side roads */}
          <line x1="50" y1="0" x2="110" y2="140" stroke="#4b5563" strokeWidth="1" />
          <line x1="280" y1="0" x2="220" y2="140" stroke="#4b5563" strokeWidth="1" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#4b5563" strokeWidth="1" />
        </svg>

        {/* Placing location markers */}
        {activeGyms.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 font-medium">
            Немає залів у цьому місті в базі
          </div>
        ) : (
          activeGyms.map((gym) => {
            const isPremium = gym.tier === "Ультра" || gym.tier === "Стандарт";
            const isCurrentlySelected = gym.id === activeGymId;
            return (
              <button
                key={gym.id}
                id={`map-pin-${gym.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 group focus:outline-none focus:scale-125 z-20 cursor-pointer"
                style={{ left: `${gym.coordinates.x}%`, top: `${gym.coordinates.y}%` }}
                onMouseEnter={() => setHoveredGym(gym)}
                onMouseLeave={() => setHoveredGym(null)}
                onClick={() => onSelectGym(gym)}
                title={gym.name}
              >
                {/* Ping wave */}
                <span className={`absolute top-2.5 left-2.5 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full opacity-75 animate-ping pointer-events-none ${
                  isPremium ? "bg-amber-400" : "bg-emerald-400"
                }`} />

                {/* Point dot wrapper */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform duration-300 group-hover:scale-125 ${
                  isCurrentlySelected 
                    ? "bg-rose-500 border-white scale-125 scale-y-110" 
                    : isPremium 
                      ? "bg-amber-500 border-zinc-900 group-hover:bg-amber-400" 
                      : "bg-emerald-500 border-zinc-900 group-hover:bg-emerald-400"
                }`}>
                  <MapPin size={9} className="text-white fill-current" />
                </div>
              </button>
            );
          })
        )}

        {/* Reactive tooltip block overlay on Map */}
        {hoveredGym && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-zinc-950/95 border border-zinc-800 text-white p-2 rounded-xl text-[10px] shadow-2xl flex items-center gap-2 max-w-[260px] animate-fade-in pointer-events-none">
            <img 
              src={hoveredGym.imageUrl} 
              className="w-8 h-8 rounded-lg object-cover" 
              alt=""
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold line-clamp-1">{hoveredGym.name}</p>
              <p className="text-zinc-400 line-clamp-1 text-[9px]">{hoveredGym.address}</p>
              <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded-sm">
                Топ ({hoveredGym.rating}★)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Action hint */}
      <div className="relative z-15 flex items-center justify-between mt-1 pt-1.5 border-t border-zinc-900">
        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
          <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
          <span>Доступ до всіх залів з єдиним пропуском GymPass UA</span>
        </div>
        <div className="text-[9px] font-bold text-zinc-400 flex items-center gap-0.5">
          <span>{activeGyms.length} залів поруч</span>
          <ArrowRight size={10} />
        </div>
      </div>
    </div>
  );
};
