/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gym } from "../types";
import { MapPin, Star, Phone, Clock, Award, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface GymCardProps {
  gym: Gym;
  onSelect: (gym: Gym) => void;
  userTier: string | null;
  onCheckIn: (gym: Gym) => void;
}

export const GymCard: React.FC<GymCardProps> = ({
  gym,
  onSelect,
  userTier,
  onCheckIn,
}) => {
  // Determine if user has sufficient membership to check-in
  const tierWeights = { "Лайт": 1, "Стандарт": 2, "Ультра": 3 };
  const getWeight = (t: string | null) => {
    if (!t) return 0;
    return tierWeights[t as keyof typeof tierWeights] || 0;
  };

  const userWeight = getWeight(userTier);
  const gymWeight = getWeight(gym.tier);
  const isAccessible = userWeight >= gymWeight;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Лайт":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "Стандарт":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "Ультра":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-neutral-800 text-neutral-350 border border-neutral-700";
    }
  };

  return (
    <motion.div 
      id={`gym-card-${gym.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(99, 102, 241, 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-550/5 flex flex-col justify-between"
    >
      <div>
        {/* Banner Image with hover zoom */}
        <div className="relative h-44 w-full bg-neutral-950 overflow-hidden group">
          <motion.img
            src={gym.imageUrl}
            alt={gym.name}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full object-cover opacity-90 select-none"
            referrerPolicy="no-referrer"
          />
          
          {/* Tier badge overlay */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getTierColor(gym.tier)}`}>
              {gym.tier}
            </span>
          </div>

          {/* Access info overlay */}
          <div className="absolute bottom-3 right-3">
            {isAccessible ? (
              <span className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg border border-indigo-500/30">
                <CheckCircle2 size={11} className="animate-pulse" /> Доступно
              </span>
            ) : (
              <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg">
                Потрібен {gym.tier}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          {/* Title, rating */}
          <div className="flex justify-between items-start gap-2">
            <h3 
              className="font-black text-sm text-neutral-100 leading-snug cursor-pointer hover:text-indigo-400 transition-colors"
              onClick={() => onSelect(gym)}
            >
              {gym.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-400 font-bold text-xs shrink-0 select-none">
              <Star size={11} fill="currentColor" />
              <span>{gym.rating}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1 text-[11px] text-neutral-400">
            <MapPin size={12} className="shrink-0 mt-0.5 text-indigo-400" />
            <span className="line-clamp-1">{gym.address}, {gym.city}</span>
          </div>

          {/* Categories / Tags */}
          <div className="flex flex-wrap gap-1">
            {gym.categories.map((cat, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-950 text-neutral-350 border border-neutral-850"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="pt-2.5 border-t border-neutral-805 flex items-center justify-between gap-2">
          <motion.button
            id={`btn-details-${gym.id}`}
            onClick={() => onSelect(gym)}
            whileHover={{ x: 3 }}
            className="text-xs font-bold text-neutral-400 hover:text-indigo-400 transition-colors px-2 py-1 cursor-pointer"
          >
            Детальніше
          </motion.button>

          {isAccessible ? (
            <motion.button
              id={`btn-checkin-${gym.id}`}
              onClick={() => onCheckIn(gym)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
            >
              Вхід по QR
            </motion.button>
          ) : (
            <motion.button
              id={`btn-upgrade-${gym.id}`}
              onClick={() => onSelect(gym)} // Opening details to upgrade
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-neutral-800 hover:bg-neutral-750 px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-350 transition-colors border border-neutral-750 cursor-pointer"
            >
              Підняти тариф
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
