/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Gym, SubscriptionPackage, VisitLog, UserProfile, SupportRequest } from "./types";
import { GYMS, CITIES, CATEGORIES, SUBSCRIPTION_PACKAGES } from "./data/gyms";
import { BAR_ITEMS, BarItem, BarOrder } from "./data/barItems";
import { GymCard } from "./components/GymCard";
import { GymMap } from "./components/GymMap";
import { PassScanner } from "./components/PassScanner";
import { SubscriptionSelector } from "./components/SubscriptionSelector";
import { UserStats } from "./components/UserStats";
import { AiAssistant } from "./components/AiAssistant";
import { MobileFrame } from "./components/MobileFrame";
import { CommunityChat } from "./components/CommunityChat";
import { 
  Search, ShieldCheck, MapPin, Calendar, Clock, Phone, Dumbbell, Award, 
  User, Compass, Sparkles, QrCode, Filter, ChevronRight, CheckCircle2, 
  Map, Info, X, Flame, MessageSquareHeart, Pencil, Send, Instagram, Mail, HelpCircle,
  Trash2, Check, LogOut, Coffee, ShoppingBag, Plus, Minus
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // User Profile State backed by localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("gympass_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      name: "Максим Оваль",
      phone: "+38 (067) 123-45-67",
      email: "ovalmaxim@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      currentCity: "Київ",
      balanceLessons: 8,
      currentTier: "Лайт",
      currentStreak: 3,
      totalWorkouts: 12,
      activePassQr: null
    };
  });

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("gympass_logged_in");
    return saved !== "false";
  });
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCity, setRegCity] = useState("Київ");
  const [regPassword, setRegPassword] = useState("");
  const [regAvatar, setRegAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Sports nutrition & Gym bar states
  const [barCart, setBarCart] = useState<{
    product: BarItem;
    quantity: number;
    selectedFlavor?: string;
    selectedLiquid?: string;
  }[]>([]);
  const [barSelectedCategory, setBarSelectedCategory] = useState<string>("all");
  const [barUserCoins, setBarUserCoins] = useState<number>(() => {
    const saved = localStorage.getItem("gympass_user_coins");
    return saved ? parseInt(saved, 10) : 350; // Every client gets 350 starting bonus loyalty coins!
  });
  const [barOrders, setBarOrders] = useState<BarOrder[]>(() => {
    const saved = localStorage.getItem("gympass_bar_orders");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [barOrderGymId, setBarOrderGymId] = useState<string>("gym_1");
  const [isShakeBuilderOpen, setIsShakeBuilderOpen] = useState(false);
  const [barPaymentMethod, setBarPaymentMethod] = useState<"coins" | "card" | "reception">("coins");

  // Custom Shake builder states
  const [shakeBase, setShakeBase] = useState<string>("Молоко 2.5%");
  const [shakeProtein, setShakeProtein] = useState<string>("Сироватковий (Whey Isolate)");
  const [shakeFlavor, setShakeFlavor] = useState<string>("Солона Карамель");
  const [shakeAdditions, setShakeAdditions] = useState<string[]>([]);
  const [shakeQuantity, setShakeQuantity] = useState<number>(1);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);

  // Sync bar persistence
  useEffect(() => {
    localStorage.setItem("gympass_user_coins", String(barUserCoins));
  }, [barUserCoins]);

  useEffect(() => {
    localStorage.setItem("gympass_bar_orders", JSON.stringify(barOrders));
  }, [barOrders]);

  useEffect(() => {
    localStorage.setItem("gympass_logged_in", String(isLoggedIn));
  }, [isLoggedIn]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const trimmedInput = loginEmailOrPhone.trim().toLowerCase();
    
    // Simple verification check - if user types nothing or simple text
    if (!trimmedInput || !loginPassword.trim()) {
      setAuthError("Будь ласка, заповніть всі поля");
      return;
    }

    // Checking if logging in with current loaded profile details or a default profile
    if (
      (trimmedInput === userProfile.email.toLowerCase() || trimmedInput === userProfile.phone)
    ) {
      setIsLoggedIn(true);
      setLoginEmailOrPhone("");
      setLoginPassword("");
    } else {
      // Simulate successful login of a simulated user if credentials are valid format
      // Let's adopt input details or generate a beautiful new session!
      setUserProfile({
        name: trimmedInput.split("@")[0].toUpperCase(),
        phone: "+38 (099) 000-00-00",
        email: trimmedInput.includes("@") ? trimmedInput : `${trimmedInput}@example.com`,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        currentCity: "Київ",
        balanceLessons: 0,
        currentTier: null,
        currentStreak: 0,
        totalWorkouts: 0,
        activePassQr: null
      });
      setIsLoggedIn(true);
      setLoginEmailOrPhone("");
      setLoginPassword("");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError("Будь ласка, заповніть всі важливі поля");
      return;
    }

    // Set new profile details from registration form
    const newUser: UserProfile = {
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      avatarUrl: regAvatar,
      currentCity: regCity,
      balanceLessons: 0,
      currentTier: null,
      currentStreak: 0,
      totalWorkouts: 0,
      activePassQr: null
    };

    setUserProfile(newUser);
    setIsLoggedIn(true);
    
    // Clear registration fields
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegPassword("");
  };

  // Subscription cancel confirmation state
  const [showCancelSubsModal, setShowCancelSubsModal] = useState(false);

  // Support and FAQ states
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("Технічна підтримка");
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportSentSuccess, setSupportSentSuccess] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Administrative Support Appeals list backed by localStorage with Ukrainian localized seed data
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(() => {
    const saved = localStorage.getItem("gympass_support_requests");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: "req_1",
        category: "Технічна підтримка",
        message: "Доброго дня! Не можу відсканувати QR-код у залі на Подолі. Пише помилку авторизації.",
        email: "client_vlad@ukr.net",
        phone: "+380 (063) 987-65-43",
        userName: "Владислав Сиренко",
        date: "03 червня",
        time: "14:20",
        status: "вирішено",
        replyContent: "Вітаємо! Перевірили ваш профіль, наразі все налаштовано вірно. Спробуйте оновити сторінку з QR-кодом перед наступним візитом або очистити кеш браузера. Вдячні за звернення!"
      },
      {
        id: "req_2",
        category: "Запитання щодо оплат",
        message: "Привіт! Чи можу я перейти на Сімейний тариф якщо у мене зараз тариф Стандарт? Як зніметься решта грошей?",
        email: "marina_sports@gmail.com",
        phone: "+380 (050) 111-22-33",
        userName: "Марина Кравцова",
        date: "04 червня",
        time: "09:12",
        status: "новий",
      },
      {
        id: "req_3",
        category: "Пропозиція співпраці",
        message: "Ми відкриваємо новий басейн та фітнес-студію 'Аква-Лагуна' в Одесі, хочемо приєднатися до вашої мережі партнерів. З ким можна обговорити комерційні умови?",
        email: "director_aqua@laguna.od.ua",
        phone: "+380 (048) 700-80-80",
        userName: "Сергій Коваленко (директор)",
        date: "04 червня",
        time: "10:05",
        status: "в процесі",
      },
      {
        id: "req_max_1",
        category: "Запитання щодо оплат",
        message: "Я приєднав картку, але хочу уточнити, чи є якась комісія при автоматичному списанні за Сімейний тариф?",
        email: "ovalmaxim@gmail.com",
        phone: "+38 (067) 123-45-67",
        userName: "Максим Оваль",
        date: "02 червня",
        time: "11:30",
        status: "вирішено",
        replyContent: "Вітаємо, Максиме! Жодних прихованих комісій при автопродовженні тарифів немає. Списується рівно сума, вказана в описі тарифу. Бажаємо продуктивних тренувань!"
      },
      {
        id: "req_max_2",
        category: "Технічна підтримка",
        message: "Хотів би дізнатися, чи планується розширення залів у Львові найближчим часом?",
        email: "ovalmaxim@gmail.com",
        phone: "+38 (067) 123-45-67",
        userName: "Максим Оваль",
        date: "04 червня",
        time: "08:15",
        status: "в процесі"
      }
    ];
  });

  // Admin panel filters & operations states
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>("all");
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>("all"); // Starts as empty or we'll filter below
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>("");

  useEffect(() => {
    // Reset search query on mount or use empty string
    setAdminSearchQuery("");
  }, []);

  const handleChangeRequestStatus = (id: string, newStatus: "новий" | "в процесі" | "вирішено") => {
    setSupportRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  const handleSendAdminReply = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    setSupportRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          status: "вирішено", 
          replyContent: adminReplyText.trim() 
        };
      }
      return req;
    }));
    setAdminReplyText("");
    setReplyingToId(null);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingRequestId(id);
  };

  const confirmDeleteRequest = () => {
    if (deletingRequestId) {
      setSupportRequests(prev => prev.filter(req => req.id !== deletingRequestId));
      setDeletingRequestId(null);
    }
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSendingSupport(true);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    const formattedTime = today.toLocaleTimeString("uk-UA", { hour: "numeric", minute: "2-digit" });

    const newRequest: SupportRequest = {
      id: "req_" + Date.now(),
      category: supportCategory,
      message: supportMessage.trim(),
      email: userProfile.email,
      phone: userProfile.phone,
      userName: userProfile.name,
      date: formattedDate,
      time: formattedTime,
      status: "новий"
    };

    setTimeout(() => {
      setIsSendingSupport(false);
      setSupportSentSuccess(true);
      setSupportMessage("");
      setSupportRequests(prev => [newRequest, ...prev]);
    }, 1000);
  };

  // Sports Bar operational handlers
  const handleAddToCart = (product: BarItem, flavor?: string, liquid?: string) => {
    setBarCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedFlavor === flavor && 
        item.selectedLiquid === liquid
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1
        };
        return updated;
      }
      return [...prev, { product, quantity: 1, selectedFlavor: flavor, selectedLiquid: liquid }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number, flavor?: string, liquid?: string) => {
    setBarCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === productId && 
        item.selectedFlavor === flavor && 
        item.selectedLiquid === liquid
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + delta;
        if (newQty <= 0) {
          return updated.filter((_, idx) => idx !== existingIdx);
        }
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty
        };
        return updated;
      }
      return prev;
    });
  };

  const handleRemoveFromCart = (productId: string, flavor?: string, liquid?: string) => {
    setBarCart(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedFlavor === flavor && 
        item.selectedLiquid === liquid)
    ));
  };

  const handleClearCart = () => {
    setBarCart([]);
  };

  const handlePlaceBarOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (barCart.length === 0) return;

    let subTotal = barCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // If pay with coins, verify balance
    if (barPaymentMethod === "coins") {
      if (barUserCoins < subTotal) {
        alert(`❌ Недостатньо GP-бонусів на балансі! Разом: ${subTotal} GP, на вашому балансі: ${barUserCoins} GP.`);
        return;
      }
      setBarUserCoins(prev => prev - subTotal);
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    const formattedTime = today.toLocaleTimeString("uk-UA", { hour: "numeric", minute: "2-digit" });
    
    // Find target gym center
    const gymNode = GYMS.find(g => g.id === barOrderGymId) || GYMS[0];

    const newOrder: BarOrder = {
      id: "bar_" + Date.now(),
      items: barCart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedFlavor: item.selectedFlavor,
        selectedLiquid: item.selectedLiquid,
      })),
      totalPrice: subTotal,
      pickupGymId: gymNode.id,
      pickupGymName: gymNode.name,
      date: formattedDate,
      time: formattedTime,
      status: "в очікуванні",
      pickupCode: "GP-BAR-" + Math.floor(100 + Math.random() * 900),
      isPaidOnline: barPaymentMethod !== "reception",
    };

    setBarOrders(prev => [newOrder, ...prev]);
    setBarCart([]);
    
    alert(`🎉 Замовлення ${newOrder.pickupCode} успішно надіслано! Приходьте до бару в "${gymNode.name}" — ваше замовлення вже готують!`);
  };

  const handleAddCustomShakeToCart = () => {
    let priceCalculated = 80;
    if (shakeBase.includes("Мигдалеве") || shakeBase.includes("Кокосове")) {
      priceCalculated += 15;
    }
    priceCalculated += shakeAdditions.length * 10;
    
    const virtualItem: BarItem = {
      id: "custom_shake_" + Date.now(),
      name: `Свій Коктейль (${shakeProtein})`,
      category: "shakes",
      categoryLabel: "Коктейлі",
      description: `Індивідуальний мікс: Основа (${shakeBase}), Доповнення: [${shakeAdditions.join(", ") || "немає"}].`,
      price: priceCalculated,
      imageUrl: "https://images.unsplash.com/photo-1579758629938-03607ccfbad2?auto=format&fit=crop&w=405&q=80",
      calories: 160 + (shakeAdditions.length * 45),
      protein: 26 + (shakeProtein.includes("Isolate") ? 5 : 0),
      carbs: 6 + (shakeBase.includes("Молоко") ? 9 : 2),
      fat: 2 + (shakeAdditions.includes("Арахісова паста") ? 6 : 0),
    };

    setBarCart(prev => [
      ...prev,
      {
        product: virtualItem,
        quantity: shakeQuantity,
        selectedFlavor: shakeFlavor,
        selectedLiquid: shakeBase,
      }
    ]);

    setIsShakeBuilderOpen(false);
    setShakeAdditions([]);
    setShakeQuantity(1);
    
    alert("🥤 Створений вами спортивний шейк додано до кошика!");
  };

  const openEditProfile = () => {
    setEditName(userProfile.name);
    setEditPhone(userProfile.phone);
    setEditEmail(userProfile.email);
    setEditCity(userProfile.currentCity);
    setEditAvatarUrl(userProfile.avatarUrl);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      currentCity: editCity,
      avatarUrl: editAvatarUrl
    }));
    setIsEditingProfile(false);
  };

  // Booking history backed by localStorage, pre-populated with realistic historic visits
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>(() => {
    const saved = localStorage.getItem("gympass_logs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: "log_1",
        gymId: "gym_1",
        gymName: "Sport Life Подол",
        date: "28 травня",
        time: "18:45",
        qrCodeUsed: "GYMPASS-UA-GYM1-828AHSJH",
        status: "завершено"
      },
      {
        id: "log_2",
        gymId: "gym_3",
        gymName: "Apollo Next Poznyaky",
        date: "1 червня",
        time: "08:15",
        qrCodeUsed: "GYMPASS-UA-GYM3-912UHSAK",
        status: "завершено"
      }
    ];
  });

  // Search & filter parameters
  const [selectedCity, setSelectedCity] = useState("Всі міста");
  const [selectedCategory, setSelectedCategory] = useState("Всі заняття");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailModalGym, setDetailModalGym] = useState<Gym | null>(null);
  const [selectedGymForScanner, setSelectedGymForScanner] = useState<Gym | null>(null);

  // Synchronize with Local Storage
  useEffect(() => {
    localStorage.setItem("gympass_user", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("gympass_logs", JSON.stringify(visitLogs));
  }, [visitLogs]);

  useEffect(() => {
    localStorage.setItem("gympass_support_requests", JSON.stringify(supportRequests));
  }, [supportRequests]);

  // Handle buying / changing subscription packs
  const handleSelectPackage = (pkg: SubscriptionPackage) => {
    setUserProfile((prev) => ({
      ...prev,
      currentTier: pkg.name,
      balanceLessons: pkg.lessonsCount,
    }));
  };

  const handleCancelSubscription = () => {
    setShowCancelSubsModal(true);
  };

  const confirmCancelSubscription = () => {
    setUserProfile((prev) => ({
      ...prev,
      currentTier: null,
      balanceLessons: 0,
    }));
    setShowCancelSubsModal(false);
  };

  // Handle checkout scanner validation ticks
  const handleCheckInSuccess = (newLog: VisitLog) => {
    setVisitLogs((prev) => [newLog, ...prev]);
    setUserProfile((prev) => {
      const remaining = prev.balanceLessons === "Безліміт" 
        ? "Безліміт" 
        : Math.max(0, prev.balanceLessons - 1);
        
      return {
        ...prev,
        totalWorkouts: prev.totalWorkouts + 1,
        currentStreak: prev.currentStreak + 1,
        balanceLessons: remaining,
      };
    });
  };

  const handleQuickCheckInFromHome = (gym: Gym) => {
    setSelectedGymForScanner(gym);
    setActiveTab("qr");
  };

  // Match search & filter logic
  const filteredGyms = GYMS.filter((gym) => {
    const matchesCity = selectedCity === "Всі міста" || gym.city === selectedCity;
    const matchesCategory = selectedCategory === "Всі заняття" || gym.categories.includes(selectedCategory);
    const matchesSearch = 
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCity && matchesCategory && matchesSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
        {/* Ambient background accents */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-805 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative z-10 animate-fade-in">
          {/* Logo Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mx-auto">
              <Dumbbell size={24} className="rotate-2" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white uppercase leading-none">
                GymPass <span className="text-indigo-400">UA</span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold font-mono mt-1 block">
                Єдиний Абонемент України
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed pt-1">
              Один абонемент для доступу до басейнів, преміум-клубів та залів по всій країні.
            </p>
          </div>

          {/* Tab selectors for Login / Registration */}
          <div className="flex p-1 bg-neutral-950 rounded-2xl border border-neutral-850">
            <button
              type="button"
              onClick={() => { setAuthMode("login"); setAuthError(""); }}
              className={`flex-1 text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer ${
                authMode === "login" 
                  ? "bg-indigo-600 text-white shadow font-sans" 
                  : "text-neutral-400 hover:text-neutral-200 font-sans"
              }`}
            >
              Вхід в кабінет
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("register"); setAuthError(""); }}
              className={`flex-1 text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer ${
                authMode === "register" 
                  ? "bg-indigo-600 text-white shadow font-sans" 
                  : "text-neutral-400 hover:text-neutral-200 font-sans"
              }`}
            >
              Реєстрація
            </button>
          </div>

          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs py-2.5 px-3.5 rounded-xl text-center font-bold">
              ⚠️ {authError}
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Телефон або Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="ovalmaxim@gmail.com або +38 (067) 123-45-67"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 mt-5 font-sans"
              >
                Увійти до кабінету
              </button>

              {/* Developer quick back door for quick testing */}
              <div className="pt-3 border-t border-neutral-850/60 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmailOrPhone("ovalmaxim@gmail.com");
                    setLoginPassword("password123");
                  }}
                  className="text-[10px] text-neutral-500 hover:text-indigo-400 transition-colors font-medium hover:underline cursor-pointer font-sans"
                >
                  Заповнити тестовими даними (Максим Оваль)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Як вас звати (ПІБ)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Олександр Коваленко"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-medium font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+380..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3 py-2.5 text-xs text-neutral-200 font-medium font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                    Місто
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-neutral-200 font-semibold font-sans"
                  >
                    {CITIES.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Електронна адреса
                </label>
                <input
                  type="email"
                  required
                  placeholder="alexander@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-medium font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider mb-1">
                  Оберіть ваш аватар
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
                  ].map((imageUrl, scaleIdx) => {
                    const isSelected = regAvatar === imageUrl;
                    return (
                      <button
                        key={scaleIdx}
                        type="button"
                        onClick={() => setRegAvatar(imageUrl)}
                        className={`relative rounded-full aspect-square overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          isSelected ? "border-indigo-500 scale-105" : "border-neutral-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={imageUrl} className="w-full h-full rounded-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider">
                  Придумайте пароль
                </label>
                <input
                  type="password"
                  required
                  placeholder="Мінімум 6 символів"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-medium font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 mt-5 font-sans"
              >
                Створити безкоштовний акаунт
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <MobileFrame activeTab={activeTab} setActiveTab={setActiveTab} userTier={userProfile.currentTier}>
      
      {/* 1. HOME TAB */}
      {activeTab === "home" && (
        <div id="tab-content-home" className="space-y-5 animate-fade-in">
          {/* Header greetings */}
          <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-3xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-11 h-11 rounded-full object-cover border border-indigo-500/20"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-neutral-900" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider font-mono">
                  Вітаємо в мережі!
                </span>
                <h2 className="text-sm font-black text-neutral-100 leading-tight">
                  {userProfile.name}
                </h2>
              </div>
            </div>
            
            <button
              id="active-badge-home"
              onClick={() => setActiveTab("profile")}
              className="text-[10px] font-black uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2.5 py-1.5 rounded-2xl flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <ShieldCheck size={11} /> {userProfile.currentTier || "Без підписки"}
            </button>
          </div>

          {/* Quick Active Pass Status indicator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            {/* Ambient light blur like the Bento header card */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-indigo-600/15 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    Ваш Абонемент
                  </span>
                  <h3 className="font-extrabold text-sm tracking-tight text-neutral-100 mt-2">PREMIUM UNLIMITED ACCESS</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Термін дії до: <span className="font-mono text-neutral-300">12.08.2026</span></p>
                </div>
                <QrCode size={20} className="text-indigo-400 opacity-90" />
              </div>

              <div className="flex items-end justify-between pt-2.5 border-t border-neutral-800">
                <div>
                  <span className="text-[9px] text-neutral-500 uppercase font-black block">Залишок занять</span>
                  <span className="text-lg font-black font-mono tracking-wide mt-0.5 block text-indigo-400">
                    {userProfile.balanceLessons === "Безліміт" ? "Безліміт 💪" : `${userProfile.balanceLessons} занять`}
                  </span>
                </div>
                
                <button
                  id="btn-open-fast-qr"
                  onClick={() => setActiveTab("qr")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-neutral-100 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-95 shadow-md border border-indigo-500/30 cursor-pointer"
                >
                  <QrCode size={13} /> Вхід по QR
                </button>
              </div>
            </div>
          </div>

          {/* Activity Streak and metrics overview widget */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-805">
              <div className="flex items-center gap-1.5">
                <Flame className="text-orange-500 animate-pulse" size={16} />
                <span className="text-xs font-black text-neutral-100 uppercase tracking-tight">Мульти-активність</span>
              </div>
              <button 
                id="btn-goto-stats"
                onClick={() => setActiveTab("profile")} 
                className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-0.5"
              >
                <span>Деталі</span> <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="py-1 border-r border-neutral-800">
                <span className="text-[9px] text-neutral-500 font-bold uppercase block">Серія регулярності</span>
                <p className="text-base font-black text-neutral-105 mt-1 font-mono">
                  🔥 {userProfile.currentStreak} днів
                </p>
              </div>
              <div className="py-1">
                <span className="text-[9px] text-neutral-500 font-bold uppercase block">Загалом підтверджено</span>
                <p className="text-base font-black text-neutral-105 mt-1 font-mono">
                  🏋️‍♂️ {userProfile.totalWorkouts} разів
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Gyms near Kyiv/Selected city */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-neutral-100 uppercase tracking-wide">
                Рекомендовані зали тижня
              </h4>
              <button 
                id="btn-goto-explore"
                onClick={() => { setSelectedCity(userProfile.currentCity); setActiveTab("explore"); }} 
                className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300"
              >
                Всі зали
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              {GYMS.slice(0, 2).map((gym) => (
                <div 
                  key={gym.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 flex gap-3 shadow-md hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer"
                  onClick={() => setDetailModalGym(gym)}
                >
                  <img
                    src={gym.imageUrl}
                    alt={gym.name}
                    className="w-18 h-18 rounded-2xl object-cover shrink-0 mt-0.5 group-hover:scale-102 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h5 className="font-extrabold text-xs text-neutral-100 line-clamp-1">
                          {gym.name}
                        </h5>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          ★ {gym.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5 flex items-center gap-0.5">
                        <MapPin size={10} className="text-neutral-500" /> {gym.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 mt-2">
                      <span className="text-[9px] font-bold text-neutral-350 px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-750">
                        {gym.tier}
                      </span>

                      <button
                        id={`btn-home-quick-${gym.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickCheckInFromHome(gym);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white px-2.5 py-1.5 rounded-xl active:scale-95 transition-colors"
                      >
                        Вхід по QR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Coach advice block */}
          <div className="bg-neutral-900 border border-neutral-800 text-white p-4 rounded-3xl relative overflow-hidden shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/15 rounded-full blur-2xl" />
            
            <div className="z-10 relative flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center font-bold">
                <Sparkles size={14} className="text-neutral-100 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-indigo-400">Розумна порада тренера 🧠</p>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  "Початок літа — ідеальний час для збалансування занять. Рекомендую комбінувати силове тренування в залі з подальшим відпочинком у басейні!"
                </p>
                <button
                  id="btn-goto-ai-home"
                  onClick={() => setActiveTab("coach")}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 pt-1 cursor-pointer"
                >
                  <span>Запитати щось інше</span> <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPLORE CATALOG TAB */}
      {activeTab === "explore" && (
        <div id="tab-content-explore" className="space-y-5 animate-fade-in">
          {/* Page header */}
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono">Спортивні Локації</span>
            <h2 className="text-lg font-black text-neutral-105">Каталог GymPass UA</h2>
          </div>

          {/* Sticky filters and search bars */}
          <div className="space-y-3 bg-neutral-900 border border-neutral-800 p-4 rounded-3xl shadow-md">
            {/* Search Box inputs */}
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Знайди клуб за назвою чи адресою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 pl-9 rounded-2xl border border-neutral-850 focus:outline-none focus:border-indigo-505 transition-colors text-neutral-105"
              />
              <Search className="absolute left-3.5 top-3 text-neutral-500" size={13} />
            </div>

            {/* City option selectors */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-neutral-500 font-mono">Оберіть місто:</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    id={`btn-city-${city.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedCity === city
                        ? "bg-indigo-600 text-neutral-100 shadow-md shadow-indigo-600/20"
                        : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Category option selectors */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-neutral-500 font-mono">Вид занять:</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    id={`btn-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-neutral-100 shadow-md shadow-indigo-600/20"
                        : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Coordinates */}
          <GymMap
            gyms={GYMS}
            selectedCity={selectedCity}
            onSelectGym={(g) => setDetailModalGym(g)}
            activeGymId={detailModalGym?.id}
          />

          {/* Gym Catalog items layout list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Доступно залів ({filteredGyms.length})
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Сортування: найближчі</span>
            </div>

            {filteredGyms.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
                <p className="text-zinc-400 text-xs">Не знайдено спортивних клубів з обраними фільтрами у вашому місті.</p>
                <button
                  id="btn-reset-filters"
                  onClick={() => { setSelectedCity("Всі міста"); setSelectedCategory("Всі заняття"); setSearchQuery(""); }}
                  className="mt-3.5 text-xs text-emerald-600 font-bold hover:underline"
                >
                  Скинути всі фільтри
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGyms.map((gym) => (
                  <GymCard
                    key={gym.id}
                    gym={gym}
                    userTier={userProfile.currentTier}
                    onSelect={(g) => setDetailModalGym(g)}
                    onCheckIn={(g) => handleQuickCheckInFromHome(g)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.10. SPORTS NUTRITION & FITNESS BAR TAB */}
      {activeTab === "bar" && (
        <div id="tab-content-bar" className="space-y-6 animate-fade-in font-sans">
          
          {/* Header & Wallet Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono font-sans">Спорт-Бар & Магазин</span>
              <h2 className="text-xl font-black text-white">Фітнес-Бар GymPass UA</h2>
              <p className="text-xs text-neutral-400 leading-relaxed mt-0.5 font-sans">
                Замовляйте сертифіковані протеїнові коктейлі, енергетики та корисні фітнес-снеки. Отримання на рецепції вашого спортклубу.
              </p>
            </div>

            {/* Glowing GP-Coins Wallet Card */}
            <div className="bg-gradient-to-r from-neutral-900 via-indigo-950/20 to-indigo-900/10 border border-indigo-500/20 px-5 py-3 rounded-2xl flex items-center justify-between gap-4 md:w-80 shrink-0 shadow-lg shadow-indigo-600/5">
              <div className="space-y-0.5">
                <span className="text-[9px] text-indigo-400 uppercase tracking-wider font-extrabold font-mono">Мій бонусний рахунок</span>
                <p className="text-base font-black text-white flex items-center gap-1.5 font-mono">
                  🪙 {barUserCoins} <span className="text-indigo-400 text-xs font-sans">GP-Coins</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setBarUserCoins(prev => prev + 150);
                  alert("🎁 Нараховано +150 GP-Coins за щоденне тренування!");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow active:scale-95 font-sans"
              >
                Отримати +150
              </button>
            </div>
          </div>

          {/* Core Store area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side products (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Interactive custom shake builder banner */}
              <div className="bg-gradient-to-r from-indigo-900/40 via-indigo-950/20 to-neutral-900 border border-indigo-550/35 p-5 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-505/5 blur-2xl rounded-full pointer-events-none" />
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="bg-indigo-500/15 border border-indigo-505/20 text-indigo-400 text-[8.5px] uppercase tracking-widest font-black font-mono px-2 py-0.5 rounded-full">Ексклюзив</span>
                    <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-0.5 font-sans">🔥 Шейк-Конструктор</span>
                  </div>
                  <h3 className="text-sm font-black text-white">Збери свій персональний Protein Shake</h3>
                  <p className="text-[10.5px] text-neutral-400 leading-relaxed max-w-sm font-sans">
                    Оберіть вид ідеального протеїну, альтернативні види молока, улюблені смаки та корисні суперфуд-добавки!
                  </p>
                </div>
                <button
                  onClick={() => setIsShakeBuilderOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 px-5 h-10 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95 transition-all w-full sm:w-auto justify-center font-sans"
                >
                  <Coffee size={14} className="animate-bounce" /> Конструктор
                </button>
              </div>

              {/* Category selector capsules */}
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                {[
                  { id: "all", label: "Все меню" },
                  { id: "shakes", label: "Коктейлі" },
                  { id: "boosters", label: "BCAA & Енергія" },
                  { id: "snacks", label: "Снеки & Фітнес-бари" },
                  { id: "supplements", label: "Живлення & Добавки" },
                ].map((cat) => {
                  const isActive = barSelectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setBarSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-2xl text-[11px] font-black tracking-tight border whitespace-nowrap transition-all cursor-pointer font-sans ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-500/30 shadow-md shadow-indigo-600/15"
                          : "bg-neutral-900 border-neutral-805 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Products list grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BAR_ITEMS.filter((item) => barSelectedCategory === "all" || item.category === barSelectedCategory).map((item) => {
                  return (
                    <div key={item.id} className="bg-neutral-905 border border-neutral-805 hover:border-neutral-750 p-4 rounded-3xl space-y-3.5 flex flex-col justify-between shadow-sm relative group overflow-hidden transition-all duration-300 font-sans">
                      {/* Product Image and Category Pill */}
                      <div className="relative h-32 rounded-2xl overflow-hidden bg-neutral-950 shrink-0 select-none">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" referrerPolicy="no-referrer" />
                        <div className="absolute top-2 left-2 bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-[8px] font-black uppercase tracking-widest font-mono px-2 py-0.5 rounded-full">
                          {item.categoryLabel}
                        </div>
                        {/* Nutrition Badge on image */}
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm border border-neutral-800/40 py-1 px-2 rounded-xl text-[8.5px] font-mono text-indigo-300 flex gap-2">
                          <span>Б: <strong>{item.protein}г</strong></span>
                          <span>К: <strong>{item.calories}</strong></span>
                        </div>
                      </div>

                      {/* Product info */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-black text-white mt-0.5 leading-snug font-sans">{item.name}</h4>
                          <span className="text-xs font-black text-indigo-400 font-mono shrink-0 select-none">{item.price} ₴</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-2 h-7 font-sans">{item.description}</p>
                      </div>

                      {/* Nutrient breakdown bars */}
                      <div className="bg-neutral-950/50 p-2 rounded-xl border border-neutral-850 grid grid-cols-3 gap-1.5 text-center text-[8px] font-semibold text-neutral-400 font-mono select-none">
                        <div>
                          <p className="text-neutral-550 font-sans uppercase">Білки</p>
                          <p className="text-neutral-200 font-bold mt-0.5">{item.protein}г</p>
                        </div>
                        <div>
                          <p className="text-neutral-550 font-sans uppercase">Вугл</p>
                          <p className="text-neutral-200 font-bold mt-0.5">{item.carbs}г</p>
                        </div>
                        <div>
                          <p className="text-neutral-555 font-sans uppercase">Жири</p>
                          <p className="text-neutral-200 font-bold mt-0.5">{item.fat}г</p>
                        </div>
                      </div>

                      {/* Flavor drop-down selector if available */}
                      {item.flavors && item.flavors.length > 0 && (
                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-neutral-450 font-mono">Оберіть Смак</label>
                          <select
                            id={`flavor-select-${item.id}`}
                            className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-lg py-1 px-2 text-[9.5px] font-medium text-neutral-300 cursor-pointer font-sans"
                          >
                            {item.flavors.map((fl) => (
                              <option key={fl} value={fl}>{fl}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Add to Cart button */}
                      <button
                        onClick={() => {
                          let chosenFlavor = undefined;
                          if (item.flavors && item.flavors.length > 0) {
                            const domSelect = document.getElementById(`flavor-select-${item.id}`) as HTMLSelectElement;
                            chosenFlavor = domSelect ? domSelect.value : item.flavors[0];
                          }
                          handleAddToCart(item, chosenFlavor);
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 hover:bg-indigo-600 hover:text-white text-neutral-300 hover:border-indigo-500/10 font-black text-[10px] uppercase tracking-wider py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow font-sans"
                      >
                        <Plus size={11} /> До кошика
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right side cart & active orders (1/3 width) */}
            <div className="space-y-6">
              
              {/* Shopping Cart card */}
              <div className="bg-neutral-900 border border-neutral-805 p-5 rounded-3xl space-y-4 shadow-lg font-sans">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Кошик замовлення</h3>
                  </div>
                  {barCart.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-[9px] text-rose-450 hover:text-rose-400 font-extrabold hover:underline cursor-pointer font-sans"
                    >
                      Очистити
                    </button>
                  )}
                </div>

                {barCart.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center text-neutral-600 mx-auto border border-neutral-850">
                      <ShoppingBag size={16} />
                    </div>
                    <p className="text-[10.5px] text-neutral-400 font-sans">Ваш кошик порожній.</p>
                    <p className="text-[9px] text-neutral-500 leading-relaxed px-5 font-sans">Додайте улюблені коктейлі або протеїнові батончики з каталогу спорт-бару.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceBarOrder} className="space-y-4">
                    
                    {/* Cart Items List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 no-scrollbar col-span-1">
                      {barCart.map((item, idx) => (
                        <div key={`${item.product.id}-${item.selectedFlavor || ""}-${item.selectedLiquid || ""}`} className="bg-neutral-950 p-2.5 rounded-2xl border border-neutral-850 flex items-start gap-2.5">
                          <img src={item.product.imageUrl} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <p className="text-[10px] font-black text-white leading-tight truncate">{item.product.name}</p>
                            {item.selectedFlavor && (
                              <p className="text-[8.5px] text-neutral-400 leading-none">Смак: {item.selectedFlavor}</p>
                            )}
                            {item.selectedLiquid && (
                              <p className="text-[8.5px] text-neutral-400 leading-none">Основа: {item.selectedLiquid}</p>
                            )}
                            <p className="text-[9.5px] text-indigo-400 font-black font-mono">{item.product.price} ₴</p>
                          </div>

                          {/* Qty adjustments */}
                          <div className="flex items-center gap-1.5 shrink-0 bg-neutral-900 border border-neutral-800 p-1 rounded-lg select-none">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, -1, item.selectedFlavor, item.selectedLiquid)}
                              className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-[10px] font-bold text-white px-1 leading-none font-mono">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, 1, item.selectedFlavor, item.selectedLiquid)}
                              className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order summary calculations */}
                    <div className="border-t border-neutral-850 pt-3 space-y-1.5 text-[10px] font-medium text-neutral-400">
                      <div className="flex justify-between items-center text-xs font-black text-white pt-1">
                        <span>Разом до сплати:</span>
                        <span className="font-mono text-indigo-400 text-sm">
                          {barCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)} ₴
                        </span>
                      </div>
                    </div>

                    {/* Gym Selector for Pick-up */}
                    <div className="space-y-1">
                      <label className="block text-[8.5px] uppercase font-bold text-neutral-400 font-mono">Точка видачі (Спортклуб)</label>
                      <select
                        value={barOrderGymId}
                        onChange={(e) => setBarOrderGymId(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-neutral-200 font-bold font-sans cursor-pointer"
                      >
                        {GYMS.map((g) => (
                          <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                        ))}
                      </select>
                    </div>

                    {/* Choose Payment Method */}
                    <div className="space-y-1.5 bg-neutral-950 p-3 rounded-2xl border border-neutral-850/60 font-sans">
                      <label className="block text-[8.5px] uppercase font-bold text-neutral-400 font-mono mb-1.5">Спосіб Оплати</label>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-[10.5px] text-neutral-300 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="barPayment"
                            checked={barPaymentMethod === "coins"}
                            onChange={() => setBarPaymentMethod("coins")}
                            className="text-indigo-600 bg-neutral-950 border-neutral-800 cursor-pointer"
                          />
                          <span>🪙 Списати з рахунку {barCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)} GP</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-[10.5px] text-neutral-300 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="barPayment"
                            checked={barPaymentMethod === "card"}
                            onChange={() => setBarPaymentMethod("card")}
                            className="text-indigo-600 bg-neutral-950 border-neutral-800 cursor-pointer"
                          />
                          <span>💳 Банківською картою</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-[10.5px] text-neutral-300 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="barPayment"
                            checked={barPaymentMethod === "reception"}
                            onChange={() => setBarPaymentMethod("reception")}
                            className="text-indigo-600 bg-neutral-950 border-neutral-800 cursor-pointer"
                          />
                          <span>🤝 Розрахунок на рецепції</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit checkout */}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-indigo-600/15 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 font-sans"
                    >
                      <Plus size={12} /> Надіслати замовлення
                    </button>

                  </form>
                )}
              </div>

              {/* My Orders History Section */}
              <div className="bg-neutral-900 border border-neutral-805 p-5 rounded-3xl space-y-4 shadow-lg font-sans">
                <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <Coffee size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Мої Електронні Чеки</h3>
                </div>

                {barOrders.length === 0 ? (
                  <div className="py-4 text-center text-neutral-550 space-y-1.5">
                    <p className="text-[10px] font-medium leading-relaxed font-sans">У вас немає активних замовлень.</p>
                    <p className="text-[8.5px] text-neutral-500 max-w-xs mx-auto font-sans leading-relaxed">Після оформлення тут з'явиться штрих-код для пред'явлення на стійці спорт-бару.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                    {barOrders.map((ord) => (
                      <div key={ord.id} className="relative bg-neutral-950 border border-neutral-850 rounded-2xl p-4 overflow-hidden space-y-3 shadow shadow-black/40 font-sans font-sans">
                        {/* Status tag & Code */}
                        <div className="flex items-center justify-between border-b border-neutral-850/60 pb-2">
                          <div>
                            <span className="text-[9px] text-neutral-450 font-semibold">{ord.date} • {ord.time}</span>
                            <h4 className="text-[11px] font-black text-white mt-0.5 font-mono">{ord.pickupCode}</h4>
                          </div>
                          <span className={`text-[8.5px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ord.status === "в очікуванні"
                              ? "bg-amber-500/15 border border-amber-550/25 text-amber-400 font-mono text-[8px]"
                              : "bg-emerald-500/15 border border-emerald-550/25 text-emerald-400 font-mono text-[8px]"
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* List items briefly */}
                        <div className="space-y-1">
                          {ord.items.map((i, k) => (
                            <div key={k} className="flex justify-between items-center text-[10px]">
                              <span className="text-neutral-350 font-medium truncate max-w-[150px] font-sans">{i.quantity}x {i.productName}</span>
                              <span className="text-neutral-450 font-mono shrink-0 font-bold">{i.price * i.quantity} ₴</span>
                            </div>
                          ))}
                        </div>

                        {/* Gym Address */}
                        <div className="flex items-start gap-1 pb-2 border-b border-neutral-850/60">
                          <MapPin size={10} className="text-neutral-500 mt-0.5 shrink-0" />
                          <p className="text-[9px] text-neutral-400 leading-relaxed font-semibold font-sans">
                            Отримати в: <span className="text-neutral-200">{ord.pickupGymName}</span>
                          </p>
                        </div>

                        {/* Interactive Receipt QR Barcode generator */}
                        <div className="p-3 bg-white text-black rounded-xl text-center space-y-1 shadow shadow-black/25 select-none animate-fade-in">
                          <div className="w-full flex items-center justify-center font-mono tracking-[4px] py-1.5 text-[14px] font-semibold leading-none select-none bg-neutral-50 rounded select-none border border-neutral-200/50">
                            |||| | || |||| | |||| | || | ||| | ||
                          </div>
                          <p className="text-[9px] font-extrabold uppercase tracking-widest leading-none font-mono pt-1 text-center text-neutral-600">
                            {ord.pickupCode}
                          </p>
                          <p className="text-[7.5px] text-neutral-400 font-sans leading-normal text-center px-1">
                            Покажіть штрих-код бармену спортклубу для отримання замовлення!
                          </p>
                        </div>

                        {/* Price footer inside ticket layout */}
                        <div className="flex justify-between items-center text-[10.5px] font-mono pt-1">
                          <span className="text-neutral-500 font-sans">Загальна сума:</span>
                          <span className="font-extrabold text-indigo-400">{ord.totalPrice} ₴</span>
                        </div>

                        {/* Tear-off ticket decorative punched holes */}
                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-neutral-900 border-r border-neutral-850 rounded-full w-4 h-4 -mt-2 z-10" />
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-neutral-900 border-l border-neutral-850 rounded-full w-4 h-4 -mt-2 z-10" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. QR CODE SCANNER CHECK-IN TAB */}
      {activeTab === "qr" && (
        <div id="tab-content-qr" className="space-y-5 animate-fade-in">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono">Рецепція Клубу</span>
            <h2 className="text-lg font-black text-neutral-105">Єдиний UA Абонемент</h2>
          </div>

          <PassScanner
            gyms={GYMS}
            activeCity={userProfile.currentCity}
            userTier={userProfile.currentTier}
            selectedGymForQr={selectedGymForScanner}
            onCheckInSuccess={handleCheckInSuccess}
            lessonsRemaining={userProfile.balanceLessons}
          />

          {/* Security details disclosure */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl shadow-md text-xs space-y-2 text-neutral-400 leading-relaxed">
            <h4 className="font-bold text-neutral-205">Як пройти через турнікет:</h4>
            <ul className="list-decimal list-inside space-y-1.5 text-[11px]">
              <li>Оберіть поточний спортивний зал у випадаючому списку вище.</li>
              <li>Піднесіть згенерований QR-код до оптичного сканера на вході.</li>
              <li>Дочекайтеся зеленою позначки зчитування (кнопка імітації).</li>
              <li>Вітаємо, турнікет відкрито! Гарного тренування! 🏅</li>
            </ul>
          </div>
        </div>
      )}

      {/* 4. AI COACH INTUITIVE ADVISER TAB */}
      {activeTab === "coach" && (
        <div id="tab-content-coach" className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono">Розумний Персональний AI</span>
              <h2 className="text-lg font-black text-neutral-105">Фітнес-Аналітик GymGPT</h2>
            </div>
            <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-1 rounded-full font-black animate-pulse">
              LIVE
            </span>
          </div>

          <AiAssistant userProfile={userProfile} />
        </div>
      )}

      {/* 4.5. COMMUNITY CHAT AND GROUPS TAB */}
      {activeTab === "chat" && (
        <div id="tab-content-chat" className="space-y-4 animate-fade-in">
          <CommunityChat
            userName={userProfile.name}
            avatarUrl={userProfile.avatarUrl}
            currentCity={userProfile.currentCity}
          />
        </div>
      )}

      {/* 4.8. SUBSCRIPTION MANAGEMENT TAB */}
      {activeTab === "subscription" && (
        <div id="tab-content-subscription" className="space-y-5 animate-fade-in font-sans">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono">Мій абонемент</span>
            <h2 className="text-lg font-black text-neutral-105">Керування підпискою</h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Обирайте один з наших єдиних абонементів для занять у басейнах та спортивних залах по всій країні або швидко скасуйте підписку.
            </p>
          </div>

          {userProfile.currentTier && (
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4 shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black font-mono">АКТИВНА ПІДПИСКА</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-base font-black text-white">GymPass «{userProfile.currentTier}»</h3>
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                      Активна
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-neutral-400 space-y-1">
                    <p>✓ Доступ до спортклубів відповідно до обраного вами тарифу.</p>
                    <p>✓ Залишок тренувань: <strong className="text-indigo-400">{userProfile.balanceLessons === "Безліміт" ? "Безліміт 💪" : `${userProfile.balanceLessons} занять`}</strong></p>
                  </div>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  className="bg-rose-950/45 hover:bg-rose-900/35 text-rose-400 hover:text-rose-300 font-extrabold text-[10.5px] py-2.5 px-4 rounded-xl border border-rose-500/25 shadow-sm transition-all cursor-pointer active:scale-95 leading-none shrink-0"
                >
                  Скасувати підписку
                </button>
              </div>

              {userProfile.currentTier === "Сімейний" && (
                <div className="bg-neutral-950 border border-indigo-950/50 p-4 rounded-2xl space-y-3 mt-1 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-905 pb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase font-mono">Родинний кабінет (Сімейний тариф)</span>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">2 з 3 місць зайнято</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2">
                        <img src={userProfile.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-neutral-200">{userProfile.name} (Ви)</span>
                      </div>
                      <span className="text-[9px] text-indigo-400 font-black uppercase font-mono bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-550/15">Голова</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&q=80" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-neutral-200">Ольга Оваль (Член сім'ї)</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-black uppercase font-mono bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-550/15">Активний</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-3 bg-neutral-900/40 rounded-xl border border-dashed border-neutral-805">
                      <span className="text-neutral-500 text-[11px] italic">Slot №3: Вільний для родича</span>
                      <button 
                        onClick={() => alert("Лист запрошення успішно надіслано члену родини для приєднання до вашого єдиного аккаунту!")}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-extrabold cursor-pointer hover:underline"
                      >
                        Запросити родича
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <SubscriptionSelector
            currentTier={userProfile.currentTier}
            onSelectPackage={handleSelectPackage}
            userName={userProfile.name}
          />
        </div>
      )}

      {/* 5. USER PROFILE & SUBSCRIPTIONS TAB */}
      {activeTab === "profile" && (
        <div id="tab-content-profile" className="space-y-6 animate-fade-in">
          
          {/* User profile parameters container */}
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/20 shadow shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-neutral-105 leading-tight truncate font-sans">
                    {userProfile.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono truncate">{userProfile.phone}</p>
                  <p className="text-[10px] text-neutral-500 font-medium truncate">{userProfile.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={openEditProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-2 px-3 h-8 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 leading-none shrink-0"
                >
                  <Pencil size={11} /> Редагувати
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 font-extrabold text-[10px] py-2 px-3 h-8 rounded-xl flex items-center justify-center gap-1.5 border border-rose-500/20 transition-all shadow cursor-pointer active:scale-95 leading-none shrink-0"
                >
                  <LogOut size={11} /> Вийти
                </button>
              </div>
            </div>

            {/* City parameter dropdown selector */}
            <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-neutral-800">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400 font-mono">Рідне місто коуча:</label>
                <select
                  id="profile-city-select"
                  value={userProfile.currentCity}
                  onChange={(e) => setUserProfile((prev) => ({ ...prev, currentCity: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  {CITIES.slice(1).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400 font-mono">Активний абонемент:</label>
                <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 block text-center min-h-[32px] flex items-center justify-center">
                  {userProfile.currentTier || "Неактивний"}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics charts and Badges nested */}
          <UserStats
            totalWorkouts={userProfile.totalWorkouts}
            currentStreak={userProfile.currentStreak}
            currentCity={userProfile.currentCity}
          />

          {/* Subscription Tab Redirect link */}
          <div className="bg-neutral-900 border border-neutral-805 p-5 rounded-3xl space-y-3 shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-[#6366f1] font-bold font-mono uppercase">Мій Абонемент</span>
              <h4 className="text-sm font-black text-neutral-105 mt-1">Керування підпискою</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                Оновіть свій тарифний план, перегляньте деталі або скористайтеся перевагами сімейного абонементу.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("subscription")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow cursor-pointer text-center whitespace-nowrap active:scale-95 leading-none font-sans"
            >
              Керувати
            </button>
          </div>

          {/* Historic checked-in visited logs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-neutral-105 uppercase tracking-wide">Історія відвідувань</h4>
            {visitLogs.length === 0 ? (
              <p className="text-center py-6 text-xs text-neutral-550 italic bg-neutral-900 border border-neutral-800 rounded-2xl">
                Ви ще не зчитували QR-код у жодному спортклубі.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {visitLogs.map((log) => (
                  <div
                    key={log.id}
                    id={`log-item-${log.id}`}
                    className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl flex items-center justify-between shadow-xs text-xs"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                        ✓
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-neutral-200 line-clamp-1">{log.gymName}</h5>
                        <p className="text-[10px] text-neutral-450 font-mono mt-0.5">{log.date} о {log.time}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-black px-2 py-0.5 rounded-lg border border-indigo-500/20 shrink-0">
                      {log.status === "завершено" ? "Візит" : "Скасовано"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4.9. OTHER APP DESCRIPTION & HELP/SUPPORT TAB */}
      {activeTab === "other" && (
        <div id="tab-content-other" className="space-y-6 animate-fade-in font-sans">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black font-mono">Інформація та підтримка</span>
            <h2 className="text-lg font-black text-neutral-105">Про GymPass UA</h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Дізнайтеся більше про нашу місію та отримайте швидку кваліфіковану допомогу від служби підтримки.
            </p>
          </div>

          {/* About core concept card */}
          <div className="bg-gradient-to-br from-indigo-950/20 via-neutral-900 to-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-505/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-550/25 text-indigo-400 flex items-center justify-center font-bold">
                <Dumbbell size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Єдиний Фітнес-Світ України</h3>
                <span className="text-[9px] uppercase tracking-widest text-[#6366f1] font-bold font-mono">Платформа Свободи Спорту</span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
              <strong>GymPass UA</strong> — це інноваційний єдиний абонемент, який відкриває двері до найкращих басейнів, преміум-фітнес-клубів, залів кросфіту, студій пілатесу та скеледромів по всій Україні без прив'язки до одного бренду. Наша місія — зробити здоровий спосіб життя максимально гнучким, вигідним і комфортним. Більше немає потреби купувати дорогі річні абонементи у декілька залів окремо: з GymPass ви самостійно обираєте, де тренуватися сьогодні!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/60 text-center">
              <div className="bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-850">
                <p className="text-base font-black text-indigo-400">50+</p>
                <p className="text-[8.5px] text-neutral-500 uppercase font-bold font-sans mt-0.5">Спортклубів в мережі</p>
              </div>
              <div className="bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-850">
                <p className="text-base font-black text-emerald-400">15+</p>
                <p className="text-[8.5px] text-neutral-500 uppercase font-bold font-sans mt-0.5">Басейнів та SPA</p>
              </div>
              <div className="bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-850">
                <p className="text-base font-black text-amber-400">5</p>
                <p className="text-[8.5px] text-neutral-500 uppercase font-bold font-sans mt-0.5">Міст України</p>
              </div>
              <div className="bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-850">
                <p className="text-base font-black text-indigo-400 font-mono">12K+</p>
                <p className="text-[8.5px] text-neutral-500 uppercase font-bold font-sans mt-0.5">Активних атлетів</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact technical support interactive form */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4 shadow-md">
              <div>
                <span className="text-[9px] text-[#6366f1] uppercase tracking-widest font-bold font-mono">Напишіть нам</span>
                <h3 className="text-sm font-black text-white mt-0.5">Служба піклування про клієнтів</h3>
              </div>

              {supportSentSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center space-y-3 animate-fade-in py-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-lg font-bold">
                    ✓
                  </div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Звернення успішно зареєстровано!</h4>
                  <p className="text-[10.5px] text-neutral-300 leading-relaxed px-1">
                    Ми отримали ваші дані. Номер звернення <strong className="font-mono text-white">#GP-4902</strong>. Черговий менеджер техпідтримки зв'яжеться з вами за адресою <span className="font-semibold text-neutral-200">{userProfile.email}</span> або по телефону вже протягом 10-15 хвилин.
                  </p>
                  <button
                    onClick={() => setSupportSentSuccess(false)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-extrabold cursor-pointer mt-2 hover:underline"
                  >
                    Надіслати нове повідомлення
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendSupport} className="space-y-3">
                  <div>
                    <label className="block text-[9px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                      Категорія питання
                    </label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-neutral-200 font-semibold"
                    >
                      <option value="Технічна підтримка">Технічна підтримка (Додаток / QR)</option>
                      <option value="Запитання щодо оплат">Запитання щодо оплат чи Тарифів</option>
                      <option value="Пропозиція співпраці">Пропозиція для спортивних залів</option>
                      <option value="Інші запитання">Інше питання</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                      Опис вашої ситуації
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Детально опишіть ваше питання або проблему..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-neutral-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingSupport}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    {isSendingSupport ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                        Відправка...
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Надіслати звернення
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Direct links contacts social cards */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <span className="text-[9px] uppercase font-bold text-neutral-400 font-mono block">Прямі контакти:</span>
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <a
                    href="https://t.me/gympass_ua"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 px-3 py-2 h-9 rounded-xl flex items-center gap-1.5 transition-colors text-indigo-400 font-bold"
                  >
                    <Send size={12} className="rotate-45 shrink-0" />
                    <span>Telegram Чат</span>
                  </a>
                  <a
                    href="https://instagram.com/gympass_ua"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 px-3 py-2 h-9 rounded-xl flex items-center gap-1.5 transition-colors text-pink-400 font-bold"
                  >
                    <Instagram size={12} className="shrink-0" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="mailto:support@gympass.ua"
                    className="bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors text-neutral-300 font-semibold"
                  >
                    <Mail size={11} className="text-neutral-500 shrink-0" />
                    <span className="truncate">support@gympass.ua</span>
                  </a>
                  <div className="bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-neutral-300 font-semibold">
                    <Phone size={11} className="text-neutral-500 shrink-0" />
                    <span>0 800 500 800</span>
                  </div>
                </div>
              </div>
            </div>

            {/* General FAQ section accordion selection */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-md space-y-4">
              <div>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold font-mono">Швидка довідка</span>
                <h3 className="text-sm font-black text-white mt-0.5">Поширені запитання (FAQ)</h3>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    q: "Як почати тренування з GymPass UA?",
                    a: "Це максимально просто! Зареєструйтесь, оберіть оптимальний для вас тарифний план у вкладці «Підписка» (Лайт, Стандарт, Ультра або Сімейний) та оплатіть за допомогою кредитної карти. Після цього у вас одразу з'явиться персональний QR-код. Пред'явіть його на рецепції будь-якого залу нашої мережі для успішного входу!"
                  },
                  {
                    q: "Які заклади включені у різні класи абонементів?",
                    a: "Наш каталог інтерактивний та розділений за класами залів. З абонементом «Лайт» вам доступні всі зали рівня Lite. Клас «Стандарт» покриває зали Lite та Standard. Абонементи «Ультра» та новий вигідний «Сімейний» відкривають повний безлімітний доступ абсолютно до всіх залів нашої мережі, включаючи преміум-комплекси з басейнами."
                  },
                  {
                    q: "Чи можу я скасувати абонемент передчасно?",
                    a: "Так! Ми цінуємо повну свободу та ваш комфорт. Ви можете скасувати підписку без жодних штрафних санкцій в один клік у розділі «Підписка» прямо в додатку. Миттєво після натискання підтвердження ваш абонемент стає неактивним без прихованих платежів."
                  },
                  {
                    q: "Як діє новий тариф «Сімейний»?",
                    a: "Це супер-вигідний тариф за зниженою родинною ціною! Купуючи один родинний абонемент, ви отримуєте право додати до 2-х додаткових членів вашої родини (всього до 3-х спортсменів). Кожен член матиме свій суверенний кабінет, додаток та унікальний QR-код для зручного входу в зали!"
                  }
                ].map((faq, idx) => {
                  const isOpen = faqOpenIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-neutral-950/60 border border-neutral-850 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left p-3.5 text-xs text-neutral-200 font-bold hover:text-white cursor-pointer select-none"
                      >
                        <span className="pr-4 leading-snug flex items-center gap-2">
                          <HelpCircle size={13} className="text-indigo-400 shrink-0" />
                          {faq.q}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`text-neutral-500 transition-transform shrink-0 ${isOpen ? "rotate-90 text-indigo-400" : ""}`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-[11px] text-neutral-400 leading-relaxed border-t border-neutral-900 animate-slide-down">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Support requests status area for the client */}
          {(() => {
            const userRequests = supportRequests.filter(req => 
              req.email.toLowerCase() === userProfile.email.toLowerCase() ||
              req.phone === userProfile.phone
            );
            
            return (
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4 shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[9px] text-[#6366f1] uppercase tracking-widest font-black font-mono">Історія звернень</span>
                    <h3 className="text-sm font-black text-white mt-0.5">Ваші тикети та відповіді підтримки</h3>
                  </div>
                  <span className="text-[10px] bg-neutral-950 border border-neutral-850 px-3 py-1 rounded-xl text-neutral-300 font-bold font-mono self-start sm:self-center">
                    Всього звернень: {userRequests.length}
                  </span>
                </div>

                {userRequests.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-950/40 rounded-2xl border border-neutral-850 border-dashed text-neutral-500">
                    <p className="text-xs">У вас ще немає зареєстрованих звернень.</p>
                    <p className="text-[10px] text-neutral-600 mt-1">Опишіть ваше звернення у формі для підтримки вище.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1 no-scrollbar-y">
                    {userRequests.map((req) => (
                      <div key={req.id} className="bg-neutral-950/55 border border-neutral-850 p-4 rounded-2xl space-y-3 hover:border-neutral-700 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold font-mono px-2 py-0.5 rounded-lg">
                              {req.category}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono">{req.date} • {req.time}</span>
                          </div>
                          
                          <div>
                            {req.status === "новий" && (
                              <span className="text-[8.5px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-black uppercase font-mono">
                                Надіслано
                              </span>
                            )}
                            {req.status === "в процесі" && (
                              <span className="text-[8.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase font-mono">
                                Опрацьовується
                              </span>
                            )}
                            {req.status === "вирішено" && (
                              <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase font-mono">
                                Вирішено
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="text-xs text-neutral-300 leading-relaxed font-semibold">
                            {req.message}
                          </div>
                          
                          {req.replyContent ? (
                            <div className="bg-emerald-950/15 border border-emerald-500/10 p-3.5 rounded-xl space-y-1.5 mt-2">
                              <span className="text-[8.5px] text-emerald-400 font-black uppercase tracking-widest font-mono flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Офіційний коментар підтримки:
                              </span>
                              <p className="text-[11px] text-neutral-200 font-medium leading-relaxed italic">
                                "{req.replyContent}"
                              </p>
                            </div>
                          ) : (
                            <div className="text-[10px] text-neutral-500 leading-snug italic mt-1 bg-neutral-900/40 px-3 py-2.5 rounded-xl border border-neutral-900/60">
                              ⏱ Очікуйте на відповідь нашого оператора підтримки. Зазвичай це займає до 10-15 хвилин.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-3xl text-center text-[10px] text-neutral-500 font-mono">
            GymPass UA • Версія 2.4.0 (Release-Build) • Розроблено для спортивної спільноти України • 2026
          </div>
        </div>
      )}

      {/* 4.10. ADMINISTRATIVE APPOINTMENT APPEALS TAB */}
      {activeTab === "admin" && (
        <div id="tab-content-admin" className="space-y-6 animate-fade-in font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Панель управління</span>
              <h2 className="text-lg font-black text-neutral-105">Звернення користувачів</h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Перегляд, фільтрація, адміністрування та надання офіційних відповідей на звернення в службу підтримки.
              </p>
            </div>
            
            {/* Direct statistics count summary chips */}
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center gap-4 text-center text-xs shrink-0">
              <div>
                <p className="text-xs font-black text-[#6366f1]">{supportRequests.length}</p>
                <p className="text-[8px] text-neutral-500 font-bold uppercase mt-0.5">Всього</p>
              </div>
              <div className="w-px h-6 bg-neutral-800" />
              <div>
                <p className="text-xs font-black text-amber-500">
                  {supportRequests.filter(r => r.status === "новий").length}
                </p>
                <p className="text-[8px] text-neutral-500 font-bold uppercase mt-0.5">Нових</p>
              </div>
              <div className="w-px h-6 bg-neutral-800" />
              <div>
                <p className="text-xs font-black text-emerald-400">
                  {supportRequests.filter(r => r.status === "вирішено").length}
                </p>
                <p className="text-[8px] text-neutral-500 font-bold uppercase mt-0.5">Вирішено</p>
              </div>
            </div>
          </div>

          {/* Interactive and functional filters & Search and Search Icon */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl space-y-3.5 shadow-md">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-950 rounded-2xl border border-neutral-850/55 flex-1">
                {[
                  { id: "all", label: "Всі звернення" },
                  { id: "новий", label: "Нові" },
                  { id: "в процесі", label: "В процесі" },
                  { id: "вирішено", label: "Вирішені" }
                ].map((tab) => {
                  const isSelected = adminStatusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminStatusFilter(tab.id)}
                      className={`flex-1 text-[10.5px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
                        isSelected 
                          ? "bg-indigo-650 text-white shadow-xs" 
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search box input selection */}
              <div className="relative shrink-0 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Пошук за ім'ям, мобільним, текстом..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl pl-9 pr-4 py-2 text-xs text-neutral-200 font-medium h-full min-h-[38px]"
                />
                {adminSearchQuery && (
                  <button
                    onClick={() => setAdminSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rendered Support Appeals lists */}
          <div className="space-y-4">
            {(() => {
              const query = adminSearchQuery.trim().toLowerCase();
              const filtered = supportRequests.filter((req) => {
                const matchesStatus = adminStatusFilter === "all" || req.status === adminStatusFilter;
                const matchesSearch = !query || 
                  req.userName.toLowerCase().includes(query) ||
                  req.email.toLowerCase().includes(query) ||
                  req.phone.includes(query) ||
                  req.message.toLowerCase().includes(query) ||
                  req.category.toLowerCase().includes(query);
                return matchesStatus && matchesSearch;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
                    <div className="w-12 h-12 bg-neutral-950 rounded-full flex items-center justify-center mx-auto text-neutral-600 border border-neutral-850">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-neutral-200">Нічого не знайдено</h3>
                      <p className="text-[10.5px] text-neutral-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                        Немає зареєстрованих звернень від користувачів за обраним фільтром або пошуковим запитом.
                      </p>
                    </div>
                  </div>
                );
              }

              return filtered.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl space-y-4 shadow-sm relative overflow-hidden animate-fade-in text-neutral-200"
                >
                  {/* Category, Date & Time status header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded-lg">
                        {req.category}
                      </span>
                      <span className="text-[10px] text-neutral-450 font-mono">
                        {req.date} • {req.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Set Status Chips dynamically */}
                      {req.status === "новий" && (
                        <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black uppercase font-mono px-2 py-0.5 rounded-md">
                          Нове звернення
                        </span>
                      )}
                      {req.status === "в процесі" && (
                        <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black uppercase font-mono px-2 py-0.5 rounded-md">
                          В процесі
                        </span>
                      )}
                      {req.status === "вирішено" && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase font-mono px-2 py-0.5 rounded-md">
                          Вирішено
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Core Customer Appeal content description */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <p className="text-xs font-black text-white">{req.userName}</p>
                      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-neutral-700" />
                      <div className="text-[10.5px] text-neutral-450 space-x-2">
                        <span className="font-mono">{req.phone}</span>
                        <span className="text-neutral-600">|</span>
                        <span>{req.email}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-semibold bg-neutral-950/45 p-3 rounded-2xl border border-neutral-850/65">
                      {req.message}
                    </p>
                  </div>

                  {/* If there is replyContent, render it gracefully */}
                  {req.replyContent && (
                    <div className="bg-emerald-950/20 border border-emerald-500/10 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest font-mono flex items-center gap-1">
                        <Check size={11} className="stroke-[3]" /> Офіційна Відповідь Адміністратора
                      </span>
                      <p className="text-xs text-neutral-300 italic leading-relaxed">
                        "{req.replyContent}"
                      </p>
                    </div>
                  )}

                  {/* Action administrative workflow controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-2">
                      {req.status !== "вирішено" && (
                        <>
                          {req.status === "новий" && (
                            <button
                              type="button"
                              onClick={() => handleChangeRequestStatus(req.id, "в процесі")}
                              className="text-[10px] bg-neutral-950 hover:bg-neutral-850 text-amber-400 font-extrabold border border-neutral-850 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                            >
                              Взяти в роботу
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingToId(req.id);
                              setAdminReplyText(req.replyContent || "");
                            }}
                            className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                          >
                            {req.replyContent ? "Змінити відповідь" : "Надати відповідь"}
                          </button>
                        </>
                      )}
                      
                      {req.status === "вирішено" && (
                        <button
                          type="button"
                          onClick={() => handleChangeRequestStatus(req.id, "в процесі")}
                          className="text-[10px] bg-neutral-950 hover:bg-neutral-850 text-neutral-400 font-bold border border-neutral-850 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
                        >
                          Повернути в роботу
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="text-[10px] hover:bg-rose-950/30 text-neutral-500 hover:text-rose-400 font-bold border border-transparent hover:border-rose-500/20 p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      title="Видалити звернення"
                    >
                      <Trash2 size={13} />
                      <span>Видалити</span>
                    </button>
                  </div>

                  {/* Active Slide out Inline response inputs area */}
                  {replyingToId === req.id && (
                    <form 
                      onSubmit={(e) => handleSendAdminReply(req.id, e)}
                      className="mt-3.5 bg-neutral-950 border border-neutral-850 rounded-2xl p-3.5 space-y-3 animate-fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase font-black text-indigo-400 block tracking-wider font-mono">
                          Текст відповіді для {req.userName}
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setReplyingToId(null)}
                          className="text-neutral-500 hover:text-white font-bold text-xs"
                        >
                          Скасувати
                        </button>
                      </div>

                      <textarea
                        required
                        rows={2}
                        placeholder="Наприклад: Вітаємо! Дякуємо за звернення. Ваше питання опрацьовано..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="w-full bg-neutral-905 border border-neutral-800 focus:outline-none focus:border-indigo-600 rounded-xl p-2.5 text-xs text-neutral-200"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10.5px] px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Check size={12} className="stroke-[3]" /> Відправити та закрити
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* 6. MODAL DETAILS OVERLAY COMPONENT FOR SPORTS CLUBS */}
      {detailModalGym && (
        <div id="detail-gym-modal" className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl animate-scale-up">
            
            {/* Banner block relative image */}
            <div className="relative h-48 w-full bg-neutral-950">
              <img
                src={detailModalGym.imageUrl}
                className="w-full h-full object-cover"
                alt={detailModalGym.name}
                referrerPolicy="no-referrer"
              />
              <button
                id="btn-close-modal"
                onClick={() => setDetailModalGym(null)}
                className="absolute top-3 right-3 bg-neutral-950/70 hover:bg-neutral-900 text-white p-2 rounded-full cursor-pointer transition-transform duration-200 active:scale-90"
              >
                <X size={14} />
              </button>
              
              <div className="absolute top-3 left-3 flex gap-1 bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-md uppercase font-mono">
                {detailModalGym.tier} Class
              </div>
            </div>

            {/* Inner details blocks */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-black text-sm text-neutral-100">{detailModalGym.name}</h3>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">
                    ★ {detailModalGym.rating} ({detailModalGym.reviewsCount})
                  </span>
                </div>
                
                <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-0.5">
                  <MapPin size={11} className="text-neutral-500" /> {detailModalGym.address}, {detailModalGym.city}
                </p>
              </div>

              {/* Description */}
              <p className="text-[11px] text-neutral-300 leading-relaxed font-semibold">
                {detailModalGym.description}
              </p>

              {/* Schedules and Contacts block */}
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl space-y-2 text-[10px] text-neutral-300">
                <p className="flex items-center gap-1.5 font-semibold">
                  <Clock size={12} className="text-neutral-500" /> 
                  <span>{detailModalGym.schedule}</span>
                </p>
                <p className="flex items-center gap-1.5 font-semibold">
                  <Phone size={12} className="text-neutral-500" /> 
                  <span>{detailModalGym.phone}</span>
                </p>
              </div>

              {/* Facilities / Amenities checklist */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-neutral-400 font-mono">Зручності в залі:</span>
                <div className="flex flex-wrap gap-1.5">
                  {detailModalGym.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-neutral-950 text-neutral-350 px-2.5 py-1 rounded-xl border border-neutral-800"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1 border-t border-neutral-800">
                <button
                  id="btn-modal-close-main"
                  onClick={() => setDetailModalGym(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-bold py-2.5 rounded-xl transition-all text-center cursor-pointer"
                >
                  Назад
                </button>
                <button
                  id="btn-modal-checkin"
                  onClick={() => {
                    handleQuickCheckInFromHome(detailModalGym);
                    setDetailModalGym(null);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow transition-all block text-center cursor-pointer"
                >
                  Вибрати для QR
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Profile Editing Modal overlay */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Мій Профіль</span>
              <h3 className="text-base font-black text-white mt-1">Редагування профілю</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1">
                Оновіть інформацію для відображення в спортивній спільноті GymPass UA
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                  ПІБ спортсмена
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр., Максим Оваль"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={30}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-3 text-xs text-neutral-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                    Телефон
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+380..."
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    maxLength={20}
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-3 py-3 text-xs text-neutral-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                    Місто
                  </label>
                  <select
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-3 py-3 text-xs text-neutral-200 font-semibold h-[42px]"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                  >
                    {CITIES.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                  Електронна адреса (Email)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  maxLength={40}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-3 text-xs text-neutral-200 font-medium"
                />
              </div>

              {/* Avatar selection list */}
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-2">
                  Виберіть свій Спортивний Аватар
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                  ].map((url, idx) => {
                    const isSelected = editAvatarUrl === url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatarUrl(url)}
                        className={`p-0.5 rounded-full border-2 transition-all cursor-pointer ${
                          isSelected ? "border-indigo-600 scale-105" : "border-transparent hover:border-neutral-750"
                        }`}
                      >
                        <img src={url} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom input path option */}
              <div>
                <label className="block text-[10px] text-neutral-400 font-mono mb-1">
                  Або введіть власне посилання на фото:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-2 text-[10.5px] text-neutral-350"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-2.5 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95"
                >
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Subscription Cancellation Modal */}
      {showCancelSubsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setShowCancelSubsModal(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="text-center py-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                <X size={22} className="stroke-[3]" />
              </div>
              <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black font-mono">Скасування Тарифу</span>
              <h3 className="text-base font-black text-white mt-1">Ви впевнені, що хочете скасувати підписку?</h3>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed px-2">
                Ви дійсно бажаєте анулювати ваш активний абонемент <strong className="text-neutral-200">GymPass «{userProfile.currentTier}»</strong>? Ви одразу втратите доступ до басейнів та залів тренувань.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelSubsModal(false)}
                className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
              >
                Ні, залишити
              </button>
              <button
                type="button"
                onClick={confirmCancelSubscription}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95"
              >
                Так, скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="text-center py-4">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                <LogOut size={22} className="stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Вихід з кабінету</span>
              <h3 className="text-base font-black text-white mt-1">Вийти з акаунта?</h3>
              <p className="text-[11px] text-neutral-450 mt-2 leading-relaxed px-2">
                Ви впевнені, що бажаєте вийти зі свого облікового запису? Ви завжди зможете увійти за допомогою вашого телефону або пошти.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center font-sans"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95 font-sans"
              >
                Так, вийти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Custom Delete Support Request Modal */}
      {deletingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative text-neutral-200">
            <button
              onClick={() => setDeletingRequestId(null)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="text-center py-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                <Trash2 size={22} className="stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-rose-400 uppercase tracking-widest font-black font-mono">Видалення тикету</span>
              <h3 className="text-base font-black text-white mt-1">Видалити це звернення?</h3>
              <p className="text-[11px] text-neutral-450 mt-2 leading-relaxed px-4">
                Ця дія незворотна. Дані про це звернення та отриману відповідь будуть назавжди видалені з бази даних.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingRequestId(null)}
                className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center font-sans"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={confirmDeleteRequest}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95 font-sans"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}

    </MobileFrame>
  );
}
