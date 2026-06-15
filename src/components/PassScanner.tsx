/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Gym, VisitLog } from "../types";
import { QrCode, ShieldCheck, RefreshCw, Clock, CheckCircle, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PassScannerProps {
  gyms: Gym[];
  activeCity: string;
  userTier: string | null;
  selectedGymForQr?: Gym | null;
  onCheckInSuccess: (visit: VisitLog) => void;
  lessonsRemaining: number | "Безліміт";
  onNavigateToSubscription?: () => void;
}

export const PassScanner: React.FC<PassScannerProps> = ({
  gyms,
  activeCity,
  userTier,
  selectedGymForQr,
  onCheckInSuccess,
  lessonsRemaining,
  onNavigateToSubscription,
}) => {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(selectedGymForQr || null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<VisitLog | null>(null);
  const [qrCodeData, setQrCodeData] = useState("");

  // Update selected gym when prop changes
  useEffect(() => {
    if (selectedGymForQr) {
      setSelectedGym(selectedGymForQr);
    } else if (!selectedGym && gyms.length > 0) {
      // Pick first accessible gym in city by default
      const cityGyms = gyms.filter(
        (g) => (g.city === activeCity || activeCity === "Всі міста") && isGymAccessible(g)
      );
      if (cityGyms.length > 0) {
        setSelectedGym(cityGyms[0]);
      } else {
        const anyAccessible = gyms.find((g) => isGymAccessible(g));
        if (anyAccessible) setSelectedGym(anyAccessible);
      }
    }
  }, [selectedGymForQr, gyms, activeCity, userTier]);

  // Handle regenerating QR code data and countdown timer
  useEffect(() => {
    generateNewQr();
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          generateNewQr();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedGym]);

  const isGymAccessible = (gym: Gym) => {
    if (!userTier) return false;
    const weights = { "Лайт": 1, "Стандарт": 2, "Сімейний": 2, "Ультра": 3 };
    const userWeight = weights[userTier as keyof typeof weights];
    const gymWeight = weights[gym.tier as keyof typeof weights];
    if (userWeight === undefined || gymWeight === undefined) return false;
    return userWeight >= gymWeight;
  };

  const generateNewQr = () => {
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const gymId = selectedGym ? selectedGym.id : "any";
    setQrCodeData(`GYMPASS-UA-${gymId}-${Date.now()}-${randomHash}`);
  };

  const handleSimulateScan = () => {
    if (!selectedGym) return;
    setIsScanning(true);

    // Simulate beep and check-in confirmation after 1.5 seconds
    setTimeout(() => {
      setIsScanning(false);
      const now = new Date();
      const newLog: VisitLog = {
        id: `visit_${Math.random().toString(36).substring(2, 9)}`,
        gymId: selectedGym.id,
        gymName: selectedGym.name,
        date: now.toLocaleDateString("uk-UA", { day: "numeric", month: "long" }),
        time: now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
        qrCodeUsed: qrCodeData,
        status: "завершено",
      };
      setLastCheckIn(newLog);
      onCheckInSuccess(newLog);
    }, 1400);
  };

  const getAccessibleGymsInUserCity = () => {
    return gyms.filter((g) => {
      const cityMatches = activeCity === "Всі міста" || g.city === activeCity;
      return cityMatches && isGymAccessible(g);
    });
  };

  const accessibleGyms = getAccessibleGymsInUserCity();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="pass-scanner-card" 
      className="bg-neutral-900 rounded-3xl p-6 text-white border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col items-center"
    >
      {/* Absolute details bg blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full flex items-center justify-between mb-4 z-10 font-sans">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold font-mono">
            Єдина UA Перепустка
          </span>
          <h3 className="text-base font-black text-neutral-100 flex items-center gap-1.5 mt-0.5">
            <QrCode className="text-indigo-400 shrink-0" size={16} /> GymPass QR
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold font-mono">Баланс занять</span>
          <p className="text-xs font-black text-indigo-400 font-mono mt-0.5">
            {lessonsRemaining === "Безліміт" ? "Безліміт 💪" : `${lessonsRemaining} занять`}
          </p>
        </div>
      </div>

      {!userTier ? (
        <div className="py-12 px-4 text-center z-10 w-full space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-neutral-950 mx-auto flex items-center justify-center text-neutral-500 border border-neutral-800 animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-neutral-200 text-sm">Перепустку не активовано</h4>
              <p className="text-xs text-neutral-400 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                Оберіть один із тарифних планів у вкладці **«Підписка»**, щоб згенерувати особистий QR-код для входу.
              </p>
            </div>
            {onNavigateToSubscription && (
              <motion.button
                onClick={onNavigateToSubscription}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck size={14} /> Придбати підписку
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center z-10 space-y-5">
          {/* Gym Selector dropdown */}
          <div className="w-full space-y-1 font-sans">
            <label className="text-[9px] text-neutral-400 font-black uppercase tracking-wider font-mono block">
              Оберіть клуб для візиту
            </label>
            {accessibleGyms.length === 0 ? (
              <p className="text-xs text-rose-450 font-bold py-1">
                Для вашого тарифу немає доступних клубів у місті {activeCity === "Всі міста" ? "Київ" : activeCity}. Підвищіть тариф!
              </p>
            ) : (
              <select
                id="gym-scanner-select"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer font-semibold"
                value={selectedGym?.id || ""}
                onChange={(e) => {
                  const selectedObj = gyms.find((g) => g.id === e.target.value);
                  if (selectedObj) setSelectedGym(selectedObj);
                }}
              >
                {accessibleGyms.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.city}, {g.tier})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* QR Container code visualizer */}
          <div className="relative p-4 bg-white rounded-3xl shadow-xl border-4 border-indigo-500/20 w-48 h-48 flex items-center justify-center overflow-hidden">
            {/* Visual Scan laser animation when scanning or running */}
            {isScanning ? (
              <div className="absolute inset-0 bg-indigo-500/10 z-20 flex flex-col items-center justify-center">
                <motion.div 
                  initial={{ top: "4%" }}
                  animate={{ top: "94%" }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" }}
                  className="w-full h-1 bg-indigo-600 shadow-[0_0_12px_#6366f1] absolute" 
                />
                <span className="text-indigo-600 text-[10px] font-black animate-pulse uppercase tracking-widest mt-2 bg-white/95 px-2.5 py-1 rounded-xl shadow">
                  Зчитування...
                </span>
              </div>
            ) : (
              <motion.div 
                initial={{ top: "4%" }}
                animate={{ top: "94%" }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.8, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-0.5 bg-indigo-500/40 shadow-[0_0_8px_#6366f1] pointer-events-none z-20" 
              />
            )}

            {/* Custom stylized QR code graphics vector mock using SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-950 fill-current opacity-90 p-1">
              <rect x="0" y="0" width="30" height="30" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />

              <rect x="70" y="0" width="30" height="30" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />

              <rect x="0" y="70" width="30" height="30" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />

              {/* Data blocks */}
              <rect x="10" y="40" width="10" height="10" />
              <rect x="40" y="10" width="10" height="10" />
              <rect x="40" y="40" width="20" height="25" />
              <rect x="45" y="25" width="15" height="10" />
              <rect x="15" y="55" width="20" height="5" />
              <rect x="55" y="5" width="10" height="10" />
              
              <rect x="45" y="70" width="15" height="15" />
              <rect x="70" y="45" width="25" height="15" />
              <rect x="80" y="75" width="15" height="5" />
              <rect x="75" y="90" width="10" height="10" />
              <rect x="90" y="35" width="10" height="5" />
              <rect x="65" y="65" width="5" height="15" />
              <rect x="35" y="85" width="10" height="10" />
              
              {/* Dynamic Center Dot to signify updates */}
              <circle cx="50" cy="50" r="4" className="text-indigo-505" fill="currentColor" />
            </svg>
          </div>

          {/* Secure Countdown / Code display */}
          <div className="flex flex-col items-center font-sans">
            <div className="flex items-center gap-1.5 text-xs text-neutral-450">
              <Clock size={12} className="text-neutral-500 animate-spin-slow" />
              <span>Оновлення через <strong className="text-indigo-400 font-mono font-black">{secondsLeft}с</strong></span>
            </div>
            <p className="font-mono text-[9px] text-neutral-550 tracking-wider mt-1 select-all hover:text-indigo-400 transition-colors">
              ID: {qrCodeData.substring(0, 24)}...
            </p>
          </div>

          {/* Simulate Action CTA */}
          <button
            id="btn-simulate-scan"
            disabled={isScanning || !selectedGym}
            onClick={handleSimulateScan}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-950 disabled:text-neutral-600 font-bold text-xs py-3 px-4 rounded-xl text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-indigo-500/20 cursor-pointer font-sans"
          >
            {isScanning ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                <span>Зчитування турнікетом...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Зімітувати вхід у клуб 📱</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Checkin Success Feedback Popups */}
      <AnimatePresence>
        {lastCheckIn && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 15 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mt-4 w-full bg-indigo-500/5 border border-indigo-500/25 p-3.5 rounded-2xl flex items-start gap-2.5 overflow-hidden font-sans text-white"
          >
            <CheckCircle className="text-indigo-400 shrink-0 mt-0.5" size={15} />
            <div className="text-xs">
              <p className="font-black text-indigo-305 text-[11px] leading-snug">Вхід підтверджено! 🚪</p>
              <p className="text-neutral-300 mt-0.5 font-bold">{lastCheckIn.gymName}</p>
              <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
                <Flame size={10} className="animate-pulse" /> Спекотного тренування!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
