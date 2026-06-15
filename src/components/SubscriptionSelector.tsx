/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SubscriptionPackage } from "../types";
import { SUBSCRIPTION_PACKAGES } from "../data/gyms";
import { 
  Check, Flame, Award, CreditCard, CheckCircle, Plus, Trash2, 
  Lock, RefreshCw, Smartphone, Wallet, ShoppingBag, ShieldCheck, Key, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubscriptionSelectorProps {
  currentTier: "Лайт" | "Стандарт" | "Ультра" | "Сімейний" | null;
  onSelectPackage: (pkg: SubscriptionPackage) => void;
  userName?: string;
}

export interface BankCard {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  brand: "visa" | "mastercard" | "unknown";
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  currentTier,
  onSelectPackage,
  userName = "Спортсмен",
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    SUBSCRIPTION_PACKAGES.find((p) => p.name === currentTier)?.id || null
  );
  
  // Persisted state of linked bank cards
  const [cards, setCards] = useState<BankCard[]>(() => {
    const saved = localStorage.getItem("gympass_saved_cards");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "card_1",
        cardNumber: "4444 8888 1111 2548",
        expiryDate: "09/30",
        cardholderName: userName.toUpperCase(),
        brand: "visa"
      }
    ]; // Pre-populate with one realistic card
  });

  useEffect(() => {
    localStorage.setItem("gympass_saved_cards", JSON.stringify(cards));
  }, [cards]);

  // UI state for adding new card
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardError, setCardError] = useState("");
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  // UI state for checkout process modal
  const [checkoutPkg, setCheckoutPkg] = useState<SubscriptionPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "monopay" | "gpay" | "privat">("card");
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || "");
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "otp" | "success">("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [saveThisCardDuringCheckout, setSaveThisCardDuringCheckout] = useState(true);

  // Auto-format card number as xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Auto-format expiration as MM/YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2);
    }
    setCardExpiry(val);
  };

  const detectCardBrand = (num: string): "visa" | "mastercard" | "unknown" => {
    const raw = num.replace(/\s/g, "");
    if (raw.startsWith("4")) return "visa";
    if (raw.startsWith("5")) return "mastercard";
    return "unknown";
  };

  const handleSelect = (pkg: SubscriptionPackage) => {
    setSelectedPlanId(pkg.id);
  };

  // Safe manual addition of cards
  const handleAddNewCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");

    const cleanNum = cardNumber.replace(/\s/g, "");
    if (cleanNum.length < 16) {
      setCardError("Номер картки має містити 16 цифр");
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError("Вкажіть термін дії (ММ/РР)");
      return;
    }
    if (cardCvv.length < 3) {
      setCardError("Код CVV має містити 3 цифри");
      return;
    }
    if (!cardHolder.trim()) {
      setCardError("Вкажіть ім'я власника латиницею");
      return;
    }

    const newCard: BankCard = {
      id: `card_${Date.now()}`,
      cardNumber,
      expiryDate: cardExpiry,
      cardholderName: cardHolder.toUpperCase(),
      brand: detectCardBrand(cardNumber),
    };

    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id); // Set newly added card as default
    
    // Clear inputs
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardHolder("");
    setIsAddingCard(false);
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === id);
    if (card) {
      setCardToDelete(card);
    }
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      const remaining = cards.filter(c => c.id !== cardToDelete.id);
      setCards(remaining);
      if (selectedCardId === cardToDelete.id) {
        if (remaining.length > 0) {
          setSelectedCardId(remaining[0].id);
        } else {
          setSelectedCardId("");
        }
      }
      setCardToDelete(null);
    }
  };

  // Pre-fill fields for easy evaluation
  const handleLoadDemoCard = () => {
    setCardNumber("5168 7425 9931 4452");
    setCardExpiry("12/28");
    setCardCvv("945");
    setCardHolder(userName.toUpperCase());
    setCardError("");
  };

  // Payment process handler trigger
  const handleOpenCheckout = (pkg: SubscriptionPackage) => {
    setCheckoutPkg(pkg);
    setPaymentMethod("card");
    setPaymentStep("idle");
    setOtpCode("");
    setOtpError("");
    // Ensure we reset values if card input is empty
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardHolder("");
    setIsAddingCard(false);
  };

  const handleSimulatePayment = () => {
    if (paymentMethod === "card") {
      // Validate if we have a card or are typing one
      const hasSelectedCard = cards.some(c => c.id === selectedCardId);
      const isTypingNewCardValInput = cardNumber.replace(/\s/g, "").length === 16;
      
      if (!hasSelectedCard && !isTypingNewCardValInput) {
        alert("Будь ласка, оберіть існуючу картку або заповніть форму нової картки.");
        return;
      }
    }

    setPaymentStep("processing");

    // Generate simulated 4-digit code
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(mockOtp);

    // Transition to 3D Secure / OTP verification block after 1.8 seconds
    setTimeout(() => {
      setPaymentStep("otp");
    }, 1800);
  };

  const handleConfirmOtp = () => {
    if (otpCode !== simulatedOtp && otpCode !== "1234") {
      setOtpError("Невірний код безпеки. Спробуйте ще раз або введіть 1234 для демо.");
      return;
    }

    setPaymentStep("processing");

    // Finalize payment
    setTimeout(() => {
      // Save card if typing fresh in checkout & checkbox ticked
      if (paymentMethod === "card" && cardNumber.replace(/\s/g, "").length === 16 && saveThisCardDuringCheckout) {
        const checkCardExist = cards.some(c => c.cardNumber === cardNumber);
        if (!checkCardExist) {
          const freshCard: BankCard = {
            id: `card_${Date.now()}`,
            cardNumber,
            expiryDate: cardExpiry,
            cardholderName: cardHolder ? cardHolder.toUpperCase() : userName.toUpperCase(),
            brand: detectCardBrand(cardNumber),
          };
          setCards(prev => [...prev, freshCard]);
          setSelectedCardId(freshCard.id);
        }
      }

      setPaymentStep("success");
      
      if (checkoutPkg) {
        onSelectPackage(checkoutPkg);
      }

      // Close modal after success
      setTimeout(() => {
        setCheckoutPkg(null);
        setPaymentStep("idle");
      }, 2500);
    }, 1500);
  };

  return (
    <div id="subscription-selector" className="space-y-6">
      {/* Visual representation of user's active virtual pass */}
      <div className="relative bg-neutral-900 border border-neutral-805 text-white rounded-3xl p-5 overflow-hidden shadow-2xl flex flex-col justify-between h-48">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Card header */}
        <div className="flex justify-between items-start z-10 w-full">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#6366f1] font-bold bg-indigo-950/50 border border-indigo-900 px-2.5 py-1 rounded-full font-mono">
              UA СПОРТИВНА СУПЕРКАРТКА
            </span>
            <h4 className="text-lg font-black mt-2 tracking-tight">GymPass UA</h4>
          </div>
          <CreditCard className="text-neutral-500" size={24} />
        </div>

        {/* Card middle tier display */}
        <div className="z-10 py-1">
          {currentTier ? (
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-xs">Тариф:</span>
              <span className={`text-sm font-black text-rose-50 px-3 py-0.5 rounded-full ${
                currentTier === "Ультра" 
                  ? "bg-gradient-to-r from-amber-500 to-rose-600" 
                  : currentTier === "Стандарт" 
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-700" 
                    : "bg-gradient-to-r from-cyan-500 to-indigo-650"
              }`}>
                {currentTier} Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Абонемент не активовано. Оберіть тариф нижче!</span>
            </div>
          )}
        </div>

        {/* Card Footer credentials */}
        <div className="flex justify-between items-end z-10 w-full">
          <div className="text-xs">
            <span className="text-[9px] text-neutral-500 uppercase font-bold font-mono">Власник картки</span>
            <p className="font-extrabold tracking-wide mt-0.5 text-neutral-100">{userName}</p>
          </div>
          <div className="text-right text-xs">
            <span className="text-[9px] text-neutral-500 uppercase font-bold font-mono">Термін дії</span>
            <p className="font-mono mt-0.5 text-neutral-100">07 / 2026</p>
          </div>
        </div>
      </div>

      {/* Persistent Linked Cards Manager Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-indigo-400" />
            <h4 className="text-xs font-black text-neutral-100 uppercase tracking-wide">
              Прив'язані картки для оплати
            </h4>
          </div>
          {!isAddingCard && (
            <button
              id="btn-add-card-toggle"
              onClick={() => setIsAddingCard(true)}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 border border-indigo-505/20 px-2 py-1 rounded-xl bg-indigo-500/5 cursor-pointer"
            >
              <Plus size={11} /> Прив'язати карту
            </button>
          )}
        </div>

        {/* Add Card Custom Interactive Live Preview Form */}
        {isAddingCard && (
          <form onSubmit={handleAddNewCardSubmit} className="space-y-4 p-4 border border-indigo-900/30 bg-indigo-950/10 rounded-2xl animate-fade-in font-sans">
            {/* Visual Live Representation of the Card */}
            <div className="w-full max-w-[280px] aspect-[1.586] mx-auto rounded-2xl p-4 text-white relative overflow-hidden shadow-lg flex flex-col justify-between bg-gradient-to-tr from-indigo-850 via-purple-900 to-indigo-950 border border-indigo-500/20">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-7 bg-amber-400/80 rounded-md flex items-center justify-center relative overflow-hidden">
                  {/* Card Metallic Chip mock lines */}
                  <div className="absolute inset-1 border border-zinc-950/30 rounded" />
                  <div className="w-full h-[1px] bg-zinc-950/25 absolute top-1/2" />
                  <div className="h-full w-[1px] bg-zinc-950/25 absolute left-1/2" />
                </div>
                {/* Brand label */}
                <span className="text-xs font-black tracking-widest italic opacity-75">
                  {detectCardBrand(cardNumber) === "visa" ? "VISA" : detectCardBrand(cardNumber) === "mastercard" ? "MASTERCARD" : "CARD"}
                </span>
              </div>

              {/* Number display */}
              <div className="font-mono text-sm tracking-widest text-center py-1">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div className="flex justify-between items-end">
                <div className="min-w-0">
                  <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-tight block">ім'я власника</span>
                  <p className="font-mono text-[10px] uppercase truncate max-w-[150px]">{cardHolder || "SPORTSMAN UA"}</p>
                </div>
                <div className="text-right">
                  <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-tight block">діє до</span>
                  <p className="font-mono text-[10px]">{cardExpiry || "ММ/РР"}</p>
                </div>
              </div>
            </div>

            {/* Inputs Form fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Номер картки</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4444 8888 1111 2222"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Діє до (ММ/РР)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    placeholder="12/28"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Код CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="***"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Власник картки (лат.)</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                  placeholder="MAXIM OVAL"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              {cardError && (
                <p className="text-[10px] text-rose-450 font-bold">{cardError}</p>
              )}

              {/* Actions submit/cancel */}
              <div className="flex gap-2 pt-1 font-sans">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow cursor-pointer text-center"
                >
                  Прив'язати картку
                </button>
                <button
                  type="button"
                  onClick={handleLoadDemoCard}
                  className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-bold text-xs py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center"
                  title="Швидкі демо дані"
                >
                  Демо дані
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-bold text-xs py-2 px-3 rounded-xl border border-neutral-800 transition-all cursor-pointer"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing Saved cards list */}
        {cards.length === 0 ? (
          <p className="text-center py-4 text-xs text-neutral-500 italic">
            Немає прив'язаних банківських карт. Додайте платіжні реквізити для зручної безготівкової оплати.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  selectedCardId === card.id
                    ? "border-indigo-600 bg-indigo-950/10 shadow-sm"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 font-sans">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black tracking-widest text-[#6366f1] italic">
                      {card.brand === "visa" ? "VISA" : card.brand === "mastercard" ? "MC" : "CARD"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-neutral-200 truncate font-mono">
                      •••• •••• •••• {card.cardNumber.slice(-4)}
                    </p>
                    <p className="text-[9px] text-neutral-450 mt-0.5 truncate uppercase">
                      {card.cardholderName} • {card.expiryDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedCardId === card.id && (
                    <span className="w-2 h-2 rounded-full bg-indigo-550 animate-pulse" />
                  )}
                  <button
                    onClick={(e) => handleDeleteCard(card.id, e)}
                    className="p-1.5 text-neutral-500 hover:text-rose-500 bg-transparent hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                    title="Видалити"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing packages listing */}
      <div className="space-y-4 font-sans">
        <h4 className="text-xs font-black text-neutral-105 uppercase tracking-wide font-mono">
          Доступні тарифи GymPass UA
        </h4>

        {SUBSCRIPTION_PACKAGES.map((pkg) => {
          const isActive = currentTier === pkg.name;
          const isSelected = selectedPlanId === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              id={`pkg-card-${pkg.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3, borderColor: isSelected ? "rgb(99, 102, 241)" : "rgba(99, 102, 241, 0.4)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`p-5 rounded-3xl border-2 transition-all duration-350 cursor-pointer flex flex-col justify-between gap-4 ${
                isActive
                  ? "border-indigo-600 bg-indigo-500/5 shadow-md"
                  : isSelected
                    ? "border-neutral-500 bg-neutral-850 shadow-sm"
                    : "border-neutral-850 bg-neutral-900 hover:border-neutral-750"
              }`}
              onClick={() => handleSelect(pkg)}
            >
              {/* package header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-neutral-100 text-base">
                      {pkg.name}
                    </span>
                    {pkg.name === "Стандарт" && (
                      <span className="text-[9px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 font-mono">
                        <Flame size={9} /> Популярний
                      </span>
                    )}
                    {pkg.name === "Ультра" && (
                      <span className="text-[9px] bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 font-mono">
                        <Award size={9} /> VIP Choice
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                    {pkg.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 font-bold font-mono uppercase">грн / міс</span>
                  <p className="text-lg font-black text-neutral-100 mt-0.5 leading-none font-mono">
                    {pkg.price}
                  </p>
                </div>
              </div>

              {/* package features */}
              <ul className="space-y-2 pt-2 border-t border-neutral-805">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-350">
                    <Check size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* action button */}
              <div className="pt-2">
                {isActive ? (
                  <button
                    disabled
                    className="w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle size={13} />
                    <span>Активний тариф</span>
                  </button>
                ) : (
                  <motion.button
                    id={`btn-buy-${pkg.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCheckout(pkg);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-neutral-800 text-neutral-300 border border-neutral-750 hover:bg-neutral-750"
                    }`}
                  >
                    Активувати за {pkg.price} грн
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAILED CHECKOUT MODAL OVERLAY */}
      <AnimatePresence>
        {checkoutPkg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border-indigo-900/40 font-sans text-neutral-100"
            >
              
              {/* Header branding */}
              <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-910">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-indigo-400 shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-black text-neutral-100 uppercase tracking-wide">
                      Оплата GymPass UA
                    </h4>
                    <p className="text-[10px] text-neutral-450 mt-0.5">Швидкий та безпечний платіж</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setCheckoutPkg(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer"
                >
                  <X size={15} />
                </motion.button>
              </div>

            {/* Simulated Payment Stages Content */}
            {paymentStep === "idle" && (
              <div className="p-5 space-y-5">
                {/* Selected Package Details */}
                <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-805 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-[#6366f1] font-bold font-mono uppercase">Обраний Тариф</span>
                    <h5 className="text-sm font-black text-neutral-100 mt-1">GymPass "{checkoutPkg.name}"</h5>
                    <p className="text-[10px] text-neutral-405 mt-0.5">Щомісячне списання кожні 30 днів</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-indigo-400 font-mono">{checkoutPkg.price} грн</p>
                    <p className="text-[9px] text-neutral-500 font-mono mt-0.5">До сплати зараз</p>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center gap-2.5 px-3 py-2 bg-indigo-500/5 border border-indigo-500/20 text-indigo-305 rounded-xl text-[10.5px]">
                  <Lock size={13} className="text-indigo-405 shrink-0" />
                  <span>Усі транзакції захищені надійним шифруванням 256-біт SSL.</span>
                </div>

                {/* Choose Payment Method Tabs */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-neutral-450 tracking-wider">
                    Оберіть спосіб оплати:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-indigo-600 bg-indigo-500/5 text-white shadow-sm"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <CreditCard size={14} /> Картка
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("monopay")}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                        paymentMethod === "monopay"
                          ? "border-purple-600 bg-purple-950/15 text-white shadow-sm"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      <span>MonoPay ⭐</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("gpay")}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                        paymentMethod === "gpay"
                          ? "border-rose-500 bg-rose-950/10 text-white shadow-sm"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <Smartphone size={14} /> GPay / Apple Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("privat")}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                        paymentMethod === "privat"
                          ? "border-green-600 bg-green-950/10 text-white shadow-sm"
                          : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <Wallet size={14} /> Приват24
                    </button>
                  </div>
                </div>

                {/* Sub-panels based on payment method selection */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-1">
                    {cards.length > 0 ? (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-bold text-neutral-450 tracking-wider">
                          Обрати з прив'язаних карток
                        </label>
                        <select
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          value={selectedCardId}
                          onChange={(e) => {
                            setSelectedCardId(e.target.value);
                            setCardNumber(""); // clear freshly typed on select
                          }}
                        >
                          {cards.map((c) => (
                            <option key={c.id} value={c.id}>
                              •••• •••• •••• {c.cardNumber.slice(-4)} ({c.brand.toUpperCase()})
                            </option>
                          ))}
                        </select>
                        <div className="flex justify-between items-center text-[10px] text-neutral-450 px-1">
                          <span>Власник: {cards.find(c => c.id === selectedCardId)?.cardholderName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCard(true); // triggers form in background view
                              alert("Картку можна легко додати у відповідній секції на сторінці профілю за декілька секунд!");
                            }}
                            className="text-indigo-400 hover:underline font-bold"
                          >
                            + Нова карта
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950 text-center space-y-2">
                        <p className="text-xs text-neutral-400">Немає прив'язаних карток.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setCards([
                              {
                                id: "demo_checkout_card",
                                cardNumber: "4444 8888 1111 2548",
                                expiryDate: "12/28",
                                cardholderName: userName.toUpperCase(),
                                brand: "visa"
                              }
                            ]);
                            setSelectedCardId("demo_checkout_card");
                          }}
                          className="inline-block text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                        >
                          Зімітувати прикріплення карти 💳
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === "monopay" && (
                  <div className="p-4 bg-purple-950/15 border border-purple-900/40 rounded-2xl text-center space-y-2 animate-fade-in text-xs leading-relaxed">
                    <p className="text-neutral-200">
                      Буде сформована транзакція в додатку <strong className="text-purple-400">monobank</strong>. Після оплати у вашому мобільному клієнті статус підтвердиться автоматично.
                    </p>
                    <span className="text-[10px] bg-purple-700/20 text-purple-305 border border-purple-500/20 px-2 py-0.5 rounded-full inline-block font-mono">
                      Знижка 5% за безконтакт
                    </span>
                  </div>
                )}

                {paymentMethod === "gpay" && (
                  <div className="p-4 bg-rose-950/10 border border-rose-900/30 rounded-2xl text-center space-y-2 animate-fade-in text-xs">
                    <p className="text-neutral-200 leading-relaxed">
                      Використовуйте збережені карти у вашому профілі Google Pay або Apple Wallet для оплати в один клік із FaceID/TouchID.
                    </p>
                  </div>
                )}

                {paymentMethod === "privat" && (
                  <div className="p-4 bg-green-950/10 border border-green-900/30 rounded-2xl text-center space-y-2 animate-fade-in text-xs">
                    <p className="text-neutral-200 leading-relaxed">
                      Авторизуйтесь та підтвердіть оплату у вашому додатку <strong className="text-green-400">Приват24</strong> за декілька секунд.
                    </p>
                  </div>
                )}

                {/* Submits and action drawers */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleSimulatePayment}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md hover:scale-102 active:scale-98 cursor-pointer text-center"
                  >
                    Перейти до оплати {checkoutPkg.price} грн
                  </button>
                  <button
                    onClick={() => setCheckoutPkg(null)}
                    className="bg-neutral-800 hover:bg-neutral-750 text-neutral-400 font-bold text-xs py-3.5 px-3 rounded-xl transition-all"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "processing" && (
              <div className="p-10 text-center space-y-5 animate-pulse font-sans">
                <RefreshCw size={44} className="text-indigo-400 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-neutral-100">Авторизація платежу банку...</h4>
                  <p className="text-xs text-neutral-450">Будь ласка, зачекайте, проводиться транзакція через безпечний хостинг</p>
                </div>
                <div className="text-[10px] font-mono text-neutral-550 border border-neutral-800 max-w-[150px] mx-auto py-1 rounded bg-neutral-950">
                  REF: TXN_8819381
                </div>
              </div>
            )}

            {paymentStep === "otp" && (
              <div className="p-6 space-y-4 text-center font-sans animate-fade-in">
                <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto shadow">
                  <Key size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-neutral-100 uppercase tracking-wide">3-D Secure верифікація</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed max-w-[280px] mx-auto">
                    Для підтвердження списання {checkoutPkg.price} грн, введіть 4-значний код авторизації, надісланий у ваш банкінг.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Введіть код"
                    className="w-32 mx-auto bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-center text-lg tracking-widest font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                  
                  {otpError && (
                    <p className="text-xs text-rose-450 font-bold leading-normal">{otpError}</p>
                  )}

                  {/* Demo Help Box */}
                  <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl max-w-[280px] mx-auto leading-normal text-[10.5px]">
                    <span className="text-[9px] font-bold text-neutral-500 block">ДЕМО-ПІДКАЗКА БАНКУ:</span>
                    <span className="text-neutral-350">Ваш тимчасовий код безпеки: </span>
                    <strong className="text-indigo-400 font-mono font-black">{simulatedOtp}</strong>
                    <span className="text-neutral-350">або спробуйте універсальний </span>
                    <strong className="text-indigo-300 font-mono">1234</strong>
                  </div>

                  <div className="flex gap-2 pt-1 font-sans">
                    <button
                      onClick={handleConfirmOtp}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                    >
                      Підтвердити оплату
                    </button>
                    <button
                      onClick={() => setPaymentStep("idle")}
                      className="bg-neutral-800 hover:bg-neutral-750 text-neutral-400 font-bold text-xs py-3 px-3 rounded-xl transition-all cursor-pointer"
                    >
                      Назад
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="p-8 text-center space-y-4 animate-scale-up font-sans">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-neutral-105">Платіж Успішно Завершено!</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed max-w-[280px] mx-auto">
                    Суму {checkoutPkg.price} грн успешно авторизовано банком. Ваш абонемент за тарифом "{checkoutPkg.name}" активований!
                  </p>
                </div>
                {/* Active check mark overlay badge */}
                <div className="inline-block text-[10.5px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  Абонемент згенеровано 💳
                </div>
              </div>
            )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Card Deletion Confirmation Modal Area */}
      {cardToDelete && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setCardToDelete(null)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer animate-none"
            >
              <X size={14} />
            </button>

            <div className="text-center py-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                <Trash2 size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black font-mono">Видалення Картки</span>
              <h3 className="text-base font-black text-white mt-1">Видалити карту?</h3>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed px-2">
                Ви дійсно бажаєте видалити збережену картку з номером <strong className="text-neutral-200 font-mono">•••• •••• •••• {cardToDelete.cardNumber.slice(-4)}</strong>? Надалі оплату доведеться вводити вручну.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
              >
                Ні, залишити
              </button>
              <button
                type="button"
                onClick={confirmDeleteCard}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95 animate-none"
              >
                Так, видалити
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
