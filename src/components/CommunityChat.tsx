/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Dumbbell, Award, Flame, Send, Users, TreePine, RefreshCw, 
  Sparkles, MessageSquare, AlertCircle, CheckCircle, Search, Plus, X,
  UserPlus, UserMinus, UserCheck, User, Trash2
} from "lucide-react";

export interface Athlete {
  id: string;
  name: string;
  city: string;
  tier: "Лайт" | "Стандарт" | "Ультра";
  favoriteGym: string;
  avatarUrl: string;
  streak: number;
  workouts: number;
  about: string;
}

export const DEFAULT_ATHLETES: Athlete[] = [
  {
    id: "alex_kiev",
    name: "Олександр (Київ)",
    city: "Київ",
    tier: "Лайт",
    favoriteGym: "Sport Life Подол",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    streak: 12,
    workouts: 45,
    about: "Активний плавець та любитель ранкового воркауту. Займаюсь 3 рази на тиждень."
  },
  {
    id: "maria_lviv",
    name: "Марія (Львів)",
    city: "Львів",
    tier: "Ультра",
    favoriteGym: "Shanti Yoga Львів",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    streak: 8,
    workouts: 32,
    about: "Йогиня зі стажем. Люблю медитації, стретчинг та гарний настій після тренувань."
  },
  {
    id: "vlad_irpin",
    name: "Владислав",
    city: "Ірпінь",
    tier: "Стандарт",
    favoriteGym: "ReForma Premium Club",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    streak: 15,
    workouts: 60,
    about: "Кросфіт та SPA зона — це мій ідеальний вечір. Завжди відкритий до спільних занять."
  },
  {
    id: "katya_irpin",
    name: "Катерина",
    city: "Ірпінь",
    tier: "Стандарт",
    favoriteGym: "Stimul Club",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    streak: 5,
    workouts: 18,
    about: "Люблю важку атлетику та бігати парками Ірпеня. Приєднуйтесь!"
  },
  {
    id: "dima_odessa",
    name: "Дмитро (Одеса)",
    city: "Одеса",
    tier: "Ультра",
    favoriteGym: "Fitness Stadium Одеса",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
    streak: 22,
    workouts: 98,
    about: "Силові триборства, правильне харучування та протеїнові шейки. Будую міцне тіло."
  },
  {
    id: "max_dnipro",
    name: "Максим (Дніпро)",
    city: "Дніпро",
    tier: "Стандарт",
    favoriteGym: "Fit4You Дніпро",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    streak: 14,
    workouts: 54,
    about: "Мій фокус — залізо та витривалість. Займаюся у спортивній спільноті GymPass понад рік."
  },
  {
    id: "tanya_kiev",
    name: "Тетяна",
    city: "Київ",
    tier: "Лайт",
    favoriteGym: "Apollo Next Poznyaky",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    streak: 9,
    workouts: 24,
    about: "Обожнюю флай-йогу на правому березі Києва. Рада знайомству!"
  },
  {
    id: "olga_piriatyn",
    name: "Ольга (Пирятин)",
    city: "Пирятин",
    tier: "Лайт",
    favoriteGym: "Apollo Next",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80",
    streak: 6,
    workouts: 20,
    about: "Регулярно відвідую групові класи, стретчинг та пілатес. Спорт дарує гармонію."
  },
];

export const getRandomResponseForFriend = (name: string, groupName: string) => {
  const cleanName = name.split(" (")[0].trim();
  const responses: Record<string, string[]> = {
    "Олександр": [
      `Привіт усім! Дякую за запрошення. Хто зараз на Подолі, пішли поплаваємо? 🏊‍♂️`,
      `Всім привіт у чаті "${groupName}"! Гарного дня та продуктивного воркауту! 💪`
    ],
    "Марія": [
      `Привіт, друзі! 🧘 Дякую за запрошення. Дуже рада приєднатися до вас у групі "${groupName}"! ✨`,
      `Вітаннячка! Бажаю всім плідної розминки та гарного тренування сьогодні!`
    ],
    "Владислав": [
      `Привіт усім любителям спорту! 💪 Завжди радий новим тренуванням та класній компанії!`,
      `Привіт! ReForma Club — це топ! Хтось збирається туди на вечірній заплив чи кардіо?`
    ],
    "Катерина": [
      `Привіт! О, круті люди зібралися! Хто завтра на кросфіт? 🔥`,
      `Всім привіт спортсмени! 👟 Обов'язково треба влаштувати спільне функціональне тренування.`
    ],
    "Дмитро": [
      `Всім здоровим духом салют! 💪 Готуємось до нових силових рекордів у "${groupName}".`,
      `Привіт! Дякую за додавання, залізо саме себе не підніме 💪`
    ],
    "Максим": [
      `Привіт спортсмени! 💪 Дякую за додавання, тренуємось до відмови!`,
      `Будьте готові викладатися на всі 100%! Радий бачити ваші успіхи.`
    ],
    "Тетяна": [
      `Вітаннячка! Дякую, що додали мене 🌸 Шукаю якраз партнерку на стретчинг!`,
      `Привіт! Йога на правому березі — моє життя, рада бути з вами!`
    ],
    "Ольга": [
      `Усім привіт! Дуже приємно приєднатися до вашої спільноти!`,
      `Доброго дня колеги-спортсмени! Спорт і здоров'я понад усе ✨`
    ],
  };

  const list = responses[cleanName] || [
    `Всім привіт! Дякую за запрошення, радий бути частиною вашої спортивної тусовки! 👟🔥`,
    `Радий приєднатися до групи "${groupName}"! Всім продуктивних занять!`
  ];
  return list[Math.floor(Math.random() * list.length)];
};

interface ChatMessage {
  id: string;
  sender: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  messages: ChatMessage[];
}

interface CommunityChatProps {
  userName: string;
  avatarUrl: string;
  currentCity: string;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({
  userName,
  avatarUrl,
  currentCity,
}) => {
  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: "general",
      name: "🏆 Загальний Фітнес-Чат",
      description: "Спілкування про спорт, здоров'я та тренування по всій Україні",
      icon: "Dumbbell",
      messages: [
        { id: "fallback_1", sender: "Олександр (Київ)", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80", text: "Всім привіт! Сьогодні був у Sport Life Подол, басейн просто супер! Хтось ще ходить туди зранку?", timestamp: "09:15" }
      ]
    }
  ]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("general");
  const [messageText, setMessageText] = useState("");
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [searchChannelQuery, setSearchChannelQuery] = useState("");
  
  // Custom channel creation states
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [newChannelIcon, setNewChannelIcon] = useState("Users");

  // NEW FRIENDS & GROUP ADDITIONS STATE
  const [sidebarTab, setSidebarTab] = useState<"channels" | "friends">("channels");
  const [searchFriendsQuery, setSearchFriendsQuery] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isInvitingToGroup, setIsInvitingToGroup] = useState(false);
  const [isCreatingCustomFriend, setIsCreatingCustomFriend] = useState(false);

  // Custom Friend form state
  const [customFriendName, setCustomFriendName] = useState("");
  const [customFriendCity, setCustomFriendCity] = useState("Київ");
  const [customFriendGym, setCustomFriendGym] = useState("");
  const [customFriendAbout, setCustomFriendAbout] = useState("");
  const [customFriendTier, setCustomFriendTier] = useState<"Лайт" | "Стандарт" | "Ультра">("Стандарт");

  const [friends, setFriends] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem("gympass_friends");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const seeded = [
      DEFAULT_ATHLETES[0], // Олександр
      DEFAULT_ATHLETES[1], // Марія
    ];
    localStorage.setItem("gympass_friends", JSON.stringify(seeded));
    return seeded;
  });

  const [allCandidates, setAllCandidates] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem("gympass_candidates");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_ATHLETES;
  });

  const [groupMembers, setGroupMembers] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem("gympass_group_members");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      general: ["Олександр (Київ)", "Марія (Львів)", "Coach GymPass"],
      irpin: ["Владислав", "Катерина"],
      iron: ["Дмитро (Одеса)", "Максим (Дніпро)"],
      yoga: ["Тетяна", "Ольга (Пирятин)"]
    };
  });

  // Persists helper
  const saveFriends = (newFriends: Athlete[]) => {
    setFriends(newFriends);
    localStorage.setItem("gympass_friends", JSON.stringify(newFriends));
  };

  const saveCandidates = (candidates: Athlete[]) => {
    setAllCandidates(candidates);
    localStorage.setItem("gympass_candidates", JSON.stringify(candidates));
  };

  const saveGroupMembers = (members: Record<string, string[]>) => {
    setGroupMembers(members);
    localStorage.setItem("gympass_group_members", JSON.stringify(members));
  };

  const addFriend = (athlete: Athlete) => {
    if (friends.some(f => f.id === athlete.id)) return;
    const updated = [...friends, athlete];
    saveFriends(updated);
  };

  const removeFriend = (id: string) => {
    const updated = friends.filter(f => f.id !== id);
    saveFriends(updated);
  };

  // Click on avatar to see athlete profile modal
  const openAthleteProfile = (senderName: string, customAvatarUrl?: string) => {
    const cleanSendName = senderName.split(" (")[0].trim();
    // find in all candidates
    const found = allCandidates.find(
      (a) => a.name.toLowerCase().includes(cleanSendName.toLowerCase())
    );

    if (found) {
      setSelectedAthlete(found);
    } else {
      // Dynamic profile fallback
      const mockAthlete: Athlete = {
        id: `temp_${Date.now()}`,
        name: senderName,
        city: senderName.includes("(") ? senderName.split("(")[1].replace(")", "").trim() : "Україна",
        tier: "Стандарт",
        favoriteGym: "Sport Life",
        avatarUrl: customAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
        streak: 7,
        workouts: 21,
        about: "Мотивований член спортивної родини GymPass UA! Спільна мета — здорова та міцна нація."
      };
      setSelectedAthlete(mockAthlete);
    }
  };

  const handleCreateCustomFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFriendName.trim() || !customFriendGym.trim()) return;

    // Random generic quality sports avatar
    const avatars = [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80"
    ];
    const randAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newF: Athlete = {
      id: `friend_${Date.now()}`,
      name: `${customFriendName.trim()} (${customFriendCity})`,
      city: customFriendCity,
      tier: customFriendTier,
      favoriteGym: customFriendGym.trim(),
      avatarUrl: randAvatar,
      streak: Math.floor(Math.random() * 15) + 1,
      workouts: Math.floor(Math.random() * 50) + 10,
      about: customFriendAbout.trim() || "Разом завжди веселіше та результативніше тренуватися!"
    };

    // Save in both states!
    const updatedCand = [...allCandidates, newF];
    saveCandidates(updatedCand);

    const updatedFriends = [...friends, newF];
    saveFriends(updatedFriends);

    // Reset forms
    setCustomFriendName("");
    setCustomFriendGym("");
    setCustomFriendAbout("");
    setIsCreatingCustomFriend(false);
  };

  // Invitations handling: Invites friend to group and posts a WS message + automatic reply
  const inviteFriendToChannel = (friend: Athlete) => {
    if (!activeChannel) return;
    
    const activeChanId = activeChannel.id;
    const currentMembers = groupMembers[activeChanId] || [];
    
    // 1. Add to group members locally for UI
    const updated = {
      ...groupMembers,
      [activeChanId]: [...currentMembers, friend.name]
    };
    saveGroupMembers(updated);

    // 2. Format a dynamic invitation message
    const welcomeMsg = `📢 Користувач ${userName} запросив(ла) ${friend.name} приєднатися до цієї групи! 🎉`;

    // 3. Send over websocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          channelId: activeChanId,
          sender: "Система",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
          text: welcomeMsg,
          isOfficial: true,
        })
      );

      // Simulates friend's organic response in 1.5 seconds!
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "message",
              channelId: activeChanId,
              sender: friend.name,
              avatarUrl: friend.avatarUrl,
              text: getRandomResponseForFriend(friend.name, activeChannel.name),
            })
          );
        }
      }, 1500);

    } else {
      // Offline implementation
      const timeStr = new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
      const systemMessage: ChatMessage = {
        id: `sys_inv_${Date.now()}`,
        sender: "Система",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        text: welcomeMsg,
        timestamp: timeStr,
        isOfficial: true
      };

      setChannels((prev) =>
        prev.map((chan) => {
          if (chan.id === activeChanId) {
            return {
              ...chan,
              messages: [...chan.messages, systemMessage]
            };
          }
          return chan;
        })
      );

      // Offline friend responder
      setTimeout(() => {
        const friendReply: ChatMessage = {
          id: `friend_rep_${Date.now()}`,
          sender: friend.name,
          avatarUrl: friend.avatarUrl,
          text: getRandomResponseForFriend(friend.name, activeChannel.name),
          timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })
        };

        setChannels((prev) =>
          prev.map((chan) => {
            if (chan.id === activeChanId) {
              return {
                ...chan,
                messages: [...chan.messages, friendReply]
              };
            }
            return chan;
          })
        );
      }, 1500);
    }
  };

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channels, selectedChannelId]);

  // Establish WebSocket Connection
  useEffect(() => {
    let socketUrl = "";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    socketUrl = `${protocol}//${window.location.host}/ws`;

    console.log("Connecting to WebSocket at", socketUrl);
    setConnectionStatus("connecting");

    const connect = () => {
      const ws = new WebSocket(socketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established successfully");
        setConnectionStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "init") {
            setChannels(data.channels);
            setOnlineCount(data.activeUsersCount || 1);
            // Auto select first channel if current doesn't exist in synchronized channels
            if (!data.channels.some((c: ChatChannel) => c.id === selectedChannelId)) {
              setSelectedChannelId(data.channels[0]?.id || "general");
            }
          } else if (data.type === "presence") {
            setOnlineCount(data.count);
          } else if (data.type === "message") {
            const { channelId, message } = data;
            setChannels((prevChannels) =>
              prevChannels.map((chan) => {
                if (chan.id === channelId) {
                  // Check duplicate to enforce idempotent message parsing
                  if (chan.messages.some((m) => m.id === message.id)) {
                    return chan;
                  }
                  return {
                    ...chan,
                    messages: [...chan.messages, message],
                  };
                }
                return chan;
              })
            );
          } else if (data.type === "channel_created") {
            const { channel } = data;
            setChannels((prevChannels) => {
              if (prevChannels.some(c => c.id === channel.id)) return prevChannels;
              return [...prevChannels, channel];
            });
            // Automatically select if the user who created it just got it
            setSelectedChannelId(channel.id);
          }
        } catch (error) {
          console.error("Error parsing ws message", error);
        }
      };

      ws.onclose = () => {
        console.warn("WebSocket closed. Attempting reconnect in 3 seconds...");
        setConnectionStatus("disconnected");
        // Reconnection logic
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            connect();
          }
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket encountered an error:", err);
        setConnectionStatus("disconnected");
        ws.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          channelId: selectedChannelId,
          sender: userName,
          avatarUrl: avatarUrl,
          text: messageText,
        })
      );
      setMessageText("");
    } else {
      // Offline fallback: optimistically append message locally to feel responsive immediately
      const timeStr = new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const tempId = `offline_${Date.now()}`;
      const tempMsg: ChatMessage = {
        id: tempId,
        sender: `${userName} (Офлайн-черга)`,
        avatarUrl,
        text: messageText,
        timestamp: timeStr,
      };

      setChannels((prevChannels) =>
        prevChannels.map((chan) => {
          if (chan.id === selectedChannelId) {
            return {
              ...chan,
              messages: [...chan.messages, tempMsg],
            };
          }
          return chan;
        })
      );
      setMessageText("");
    }
  };

  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newChannelDesc.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "create_channel",
          name: newChannelName.trim(),
          description: newChannelDesc.trim(),
          icon: newChannelIcon,
        })
      );
    } else {
      // Local fallback for offline mode
      const newId = `local_chan_${Date.now()}`;
      const newChan: ChatChannel = {
        id: newId,
        name: `👥 ${newChannelName.trim()}`,
        description: newChannelDesc.trim(),
        icon: newChannelIcon,
        messages: [{
          id: `welcome_${Date.now()}`,
          sender: "Коуч GymPass",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
          text: `Вітаємо у новоствореній офлайн-групі "${newChannelName.trim()}"! Почніть бесіду прямо зараз.`,
          timestamp: new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }),
          isOfficial: true
        }]
      };
      setChannels((prev) => [...prev, newChan]);
      setSelectedChannelId(newId);
    }

    // Reset and close
    setNewChannelName("");
    setNewChannelDesc("");
    setNewChannelIcon("Users");
    setIsCreatingChannel(false);
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "Dumbbell":
        return <Dumbbell size={16} className="text-indigo-400" />;
      case "TreePine":
        return <TreePine size={16} className="text-emerald-400" />;
      case "Award":
        return <Award size={16} className="text-amber-400" />;
      case "Flower":
        return <Flame size={16} className="text-rose-400" />;
      default:
        return <Users size={16} className="text-zinc-400" />;
    }
  };

  const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchChannelQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchChannelQuery.toLowerCase())
  );

  return (
    <div id="community-chats-container" className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] border border-neutral-805 bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl font-sans">
      
      {/* Top Banner Status Bar */}
      <div className="bg-neutral-950 px-5 py-4 border-b border-neutral-805 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0 z-10 select-none">
        <div>
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Ком'юніті & Спільноти</span>
          <h2 className="text-sm font-black text-neutral-100 flex items-center gap-2 mt-0.5">
            Форум Користувачів GymPass UA
          </h2>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-neutral-500" />
            <span className="text-neutral-300">
              Онлайн: <strong className="text-indigo-400 font-mono">{onlineCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-xl">
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected" 
                ? "bg-emerald-500 animate-pulse" 
                : connectionStatus === "connecting"
                  ? "bg-amber-500 animate-[pulse_1s_infinite]"
                  : "bg-rose-500"
            }`} />
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">
              {connectionStatus === "connected" 
                ? "З'єднано" 
                : connectionStatus === "connecting"
                  ? "Підключення..."
                  : "Офлайн-режим"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body splits in Sidebar vs Chat Box workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Sidebar Channel Selector List */}
        <div className="w-full sm:w-64 border-r border-neutral-805 bg-neutral-910 flex flex-col shrink-0 select-none hidden sm:flex">
          
          {/* TAB SWITCHER */}
          <div className="flex bg-neutral-950 p-1 rounded-2xl mx-3 mt-3 border border-neutral-850 shrink-0">
            <button
              onClick={() => setSidebarTab("channels")}
              className={`flex-1 py-1.5 text-center text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                sidebarTab === "channels" ? "bg-indigo-600 text-white shadow-md font-extrabold" : "text-neutral-450 hover:text-neutral-200"
              }`}
            >
              💬 Кімнати
            </button>
            <button
              onClick={() => setSidebarTab("friends")}
              className={`flex-1 py-1.5 text-center text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === "friends" ? "bg-indigo-600 text-white shadow-md font-extrabold" : "text-neutral-450 hover:text-neutral-200"
              }`}
            >
              👥 Друзі <span className="bg-neutral-900 text-indigo-400 px-1.5 py-0.2 rounded-md text-[8.5px] font-black font-mono">{friends.length}</span>
            </button>
          </div>

          {sidebarTab === "channels" ? (
            <>
              <div className="p-3 border-b border-neutral-805 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Пошук кімнати..."
                    value={searchChannelQuery}
                    onChange={(e) => setSearchChannelQuery(e.target.value)}
                    className="w-full bg-neutral-950 text-[11px] px-3 py-2 pl-8 rounded-xl border border-neutral-850 focus:outline-none focus:border-indigo-650 text-neutral-200"
                  />
                  <Search className="absolute left-2.5 top-2.5 text-neutral-500" size={11} />
                </div>
                <button
                  onClick={() => setIsCreatingChannel(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                >
                  <Plus size={12} /> Створити свою групу
                </button>
              </div>

              {/* Channels lists */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 no-scrollbar">
                {filteredChannels.map((chan) => {
                  const isSelected = chan.id === selectedChannelId;
                  return (
                    <button
                      key={chan.id}
                      onClick={() => setSelectedChannelId(chan.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex gap-3 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-500/5 shadow-sm text-neutral-100"
                          : "border-transparent text-neutral-400 hover:text-neutral-105 hover:bg-neutral-850"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                        {getChannelIcon(chan.icon)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold truncate leading-tight">{chan.name}</p>
                        <p className="text-[10px] text-neutral-500 line-clamp-1 mt-1 leading-none">{chan.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
              {/* Search Box for Athletes */}
              <div className="p-3 border-b border-neutral-805 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Пошук друга за ім'ям/містом..."
                    value={searchFriendsQuery}
                    onChange={(e) => setSearchFriendsQuery(e.target.value)}
                    className="w-full bg-neutral-950 text-[11px] px-3 py-2 pl-8 rounded-xl border border-neutral-850 focus:outline-none focus:border-indigo-650 text-neutral-200"
                  />
                  <Search className="absolute left-2.5 top-2.5 text-neutral-500" size={11} />
                </div>
                
                <button
                  onClick={() => setIsCreatingCustomFriend(true)}
                  className="w-full bg-neutral-950 border border-neutral-850 hover:bg-neutral-850 text-indigo-400 font-extrabold text-[10.5px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                >
                  <Plus size={11} /> Створити свого друга
                </button>
              </div>

              {/* Friends list */}
              <div className="p-3 space-y-2">
                <span className="text-[9px] text-[#8e8e93] uppercase font-black font-mono tracking-wider">Мої Друзі ({friends.length})</span>
                <div className="space-y-1.5">
                  {friends.length > 0 ? (
                    friends
                      .filter(f => f.name.toLowerCase().includes(searchFriendsQuery.toLowerCase()) || f.city.toLowerCase().includes(searchFriendsQuery.toLowerCase()))
                      .map(f => (
                        <div
                          key={f.id}
                          onClick={() => openAthleteProfile(f.name, f.avatarUrl)}
                          className="w-full p-2.5 rounded-2xl bg-neutral-950 border border-neutral-850 hover:border-indigo-600/30 hover:bg-indigo-600/5 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <img src={f.avatarUrl} className="w-7.5 h-7.5 rounded-full object-cover border border-neutral-800" referrerPolicy="no-referrer" />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-neutral-900" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-black text-white truncate leading-tight">{f.name}</p>
                              <p className="text-[9px] text-neutral-500 leading-none mt-1 truncate">{f.favoriteGym}</p>
                            </div>
                          </div>
                          <div className="shrink-0 pl-1">
                            <UserCheck size={12} className="text-indigo-400" />
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-[10px] text-neutral-500 italic text-center py-2">
                      Список друзів порожній.
                    </p>
                  )}
                </div>
              </div>

              {/* Discover Athletes list */}
              <div className="p-3 border-t border-neutral-805 mt-auto bg-neutral-910/50">
                <span className="text-[9px] text-[#8e8e93] uppercase font-black font-mono tracking-wider">Знайти спортсменів</span>
                <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto no-scrollbar">
                  {allCandidates
                    .filter(c => !friends.some(f => f.id === c.id))
                    .filter(c => c.name.toLowerCase().includes(searchFriendsQuery.toLowerCase()) || c.city.toLowerCase().includes(searchFriendsQuery.toLowerCase()))
                    .map(c => (
                      <div
                        key={c.id}
                        className="p-2 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between gap-1"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={c.avatarUrl} className="w-6 h-6 rounded-full object-cover border border-neutral-800 shrink-0" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-neutral-300 truncate leading-tight">{c.name}</p>
                            <p className="text-[8px] text-neutral-500 leading-none truncate mt-0.5">{c.city} • абонент {c.tier}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addFriend(c);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[8.5px] py-1 px-2 rounded-lg transition-all cursor-pointer shadow active:scale-95 shrink-0"
                        >
                          + Друг
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Chat workspace */}
        <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
          
          {/* Mobile Group Dropdown header (displayed on mobile screens only) */}
          <div className="sm:hidden p-3 bg-neutral-900 border-b border-neutral-805 flex flex-col gap-2 shrink-0 select-none z-10 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 shrink-0 w-44">
                <button
                  onClick={() => setSidebarTab("channels")}
                  className={`flex-1 py-1 text-center text-[10px] font-black rounded-lg transition-all ${
                    sidebarTab === "channels" ? "bg-indigo-600 text-white" : "text-neutral-450 hover:text-neutral-200"
                  }`}
                >
                  Кімнати
                </button>
                <button
                  onClick={() => setSidebarTab("friends")}
                  className={`flex-1 py-1 text-center text-[10px] font-black rounded-lg transition-all ${
                    sidebarTab === "friends" ? "bg-indigo-600 text-white" : "text-neutral-450 hover:text-neutral-200"
                  }`}
                >
                  Друзі ({friends.length})
                </button>
              </div>
              <button
                onClick={() => {
                  if (sidebarTab === "channels") setIsCreatingChannel(true);
                  else setIsCreatingCustomFriend(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-2.5 py-1 h-7 rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
              >
                <Plus size={10} /> {sidebarTab === "channels" ? "Створити" : "Додати"}
              </button>
            </div>
            
            {sidebarTab === "channels" ? (
              <div className="flex items-center gap-2 mt-0.5">
                <label className="text-[9px] text-[#8e8e93] uppercase font-black font-mono shrink-0">Група:</label>
                <select
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                >
                  {channels.map((chan) => (
                    <option key={chan.id} value={chan.id}>
                      {chan.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <label className="text-[9px] text-[#8e8e93] uppercase font-black font-mono shrink-0">Спортсмен:</label>
                <select
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  onChange={(e) => {
                    const found = friends.find(f => f.id === e.target.value);
                    if (found) { openAthleteProfile(found.name, found.avatarUrl); }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Оберіть друга для профілю</option>
                  {friends.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Channel Info header panel */}
          {activeChannel && (
            <div className="px-5 py-3 border-b border-neutral-805 bg-neutral-900/40 shrink-0 select-none flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold font-mono">
                  #
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-neutral-200 uppercase tracking-wider truncate">
                    {activeChannel.name}
                  </h3>
                  <p className="text-[10.5px] text-neutral-450 truncate mt-0.5 font-semibold">
                    {activeChannel.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInvitingToGroup(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 leading-none shrink-0"
              >
                <UserPlus size={12} /> <span className="hidden sm:inline">Запросити друга</span><span className="sm:hidden">Запросити</span>
              </button>
            </div>
          )}

          {/* Message List History space */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
            {activeChannel?.messages && activeChannel.messages.length > 0 ? (
              activeChannel.messages.map((msg, idx) => {
                const isMe = msg.sender === userName || msg.sender.startsWith(userName);

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {/* Participant Avatar */}
                    <img
                      src={msg.avatarUrl}
                      alt={msg.sender}
                      onClick={() => !msg.isOfficial && openAthleteProfile(msg.sender, msg.avatarUrl)}
                      className={`w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-800 ${!msg.isOfficial ? "cursor-pointer hover:opacity-80" : ""}`}
                      referrerPolicy="no-referrer"
                    />

                    {/* Chat Bubble container */}
                    <div className="space-y-1 font-sans">
                      {/* Sub-label information info */}
                      <div className={`flex items-center gap-1.5 text-[9px] text-[#a3a3a3] font-mono ${isMe ? "justify-end" : ""}`}>
                        <span 
                          onClick={() => !msg.isOfficial && openAthleteProfile(msg.sender, msg.avatarUrl)}
                          className={`font-extrabold text-neutral-350 ${!msg.isOfficial ? "cursor-pointer hover:underline hover:text-indigo-400" : ""}`}
                        >
                          {msg.sender}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.isOfficial && (
                          <span className="text-[8px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                            Офіційно
                          </span>
                        )}
                      </div>

                      {/* Content text */}
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : msg.isOfficial
                            ? "bg-slate-900 border border-indigo-950 text-indigo-100 rounded-tl-none"
                            : "bg-neutral-900 text-neutral-200 border border-neutral-805 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-10">
                <MessageSquare className="text-neutral-600 animate-pulse" size={32} />
                <p className="text-xs text-neutral-500 italic max-w-[200px]">
                  Немає повідомлень у цьому чаті. Залишіть перше повідомлення спортсменам!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form write and submit wrapper bottom */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-805 bg-neutral-910 shrink-0 z-10 flex gap-2 font-sans">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={
                connectionStatus === "connected"
                  ? `Поділися планами з колегами...`
                  : `Офлайн. Повідомлення відправиться після з'єднання`
              }
              className="flex-1 bg-neutral-950 border border-neutral-850 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-indigo-650 text-neutral-200"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-505 disabled:cursor-not-allowed text-white p-3 rounded-2xl shadow transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

        </div>

      </div>

      {/* Dynamic Creation Channel overlay modal */}
      {isCreatingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsCreatingChannel(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Створити Спільноту</span>
              <h3 className="text-base font-black text-white mt-1">Нова Чат-Кімната</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1">
                Створіть свій куточок для обговорення тренувань, міст, залів чи улюбленого спорту
              </p>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                  Назва групи
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр., 🚴‍♂️ ВелоКиїв або 🥦 Фітнес Рецепти"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  maxLength={35}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-3 text-xs text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-1">
                  Опис
                </label>
                <textarea
                  required
                  placeholder="Розкажіть про що цей чат, які правила або плани спільноти..."
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  maxLength={100}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-650 rounded-2xl px-4 py-3 text-xs text-neutral-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold mb-2">
                  Виберіть іконку напрямку
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {[
                    { id: "Dumbbell", label: "Сила", icon: Dumbbell, color: "text-indigo-400" },
                    { id: "TreePine", label: "Місто/Природа", icon: TreePine, color: "text-emerald-400" },
                    { id: "Award", label: "Спорт", icon: Award, color: "text-amber-400" },
                    { id: "Flower", label: "Гармонія", icon: Flame, color: "text-rose-400" },
                    { id: "Users", label: "Загальний", icon: Users, color: "text-zinc-400" },
                  ].map((ic) => {
                    const IconComp = ic.icon;
                    const isSelected = newChannelIcon === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setNewChannelIcon(ic.id)}
                        className={`py-3 px-1 rounded-2xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-800"
                        }`}
                      >
                        <IconComp size={16} className={isSelected ? "text-white" : ic.color} />
                        <span className="text-[8px] font-bold tracking-tight truncate w-full text-center">
                          {ic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingChannel(false)}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95"
                >
                  Створити
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Athlete Profile Preview Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans animate-fade-in text-neutral-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            
            {/* Header Ambient Background */}
            <div className="h-28 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
              <button
                onClick={() => setSelectedAthlete(null)}
                className="absolute top-3 right-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800/80 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer z-10"
              >
                <X size={14} />
              </button>
              
              {/* Category tag */}
              <span className="absolute bottom-3 left-4 bg-indigo-600/90 text-white font-mono font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Спортсмен UA
              </span>
            </div>

            {/* Profile Content Body */}
            <div className="p-5 pt-0 relative">
              
              {/* Profile Avatar overlay */}
              <div className="flex justify-between items-end -mt-10 mb-4 px-1">
                <img
                  src={selectedAthlete.avatarUrl}
                  alt={selectedAthlete.name}
                  className="w-20 h-20 rounded-full border-4 border-neutral-900 object-cover bg-neutral-950 shadow-md"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subscription Badge */}
                <div className="bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-xl text-center">
                  <p className="text-[7.5px] text-neutral-500 uppercase font-bold tracking-widest leading-none">Тариф</p>
                  <p className="text-[10px] font-black text-indigo-400 mt-1">{selectedAthlete.tier}</p>
                </div>
              </div>

              {/* Name and Locality */}
              <div>
                <h3 className="text-sm font-black text-white">{selectedAthlete.name}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                  📍 {selectedAthlete.city} • Любить: <strong className="text-neutral-300 font-bold">{selectedAthlete.favoriteGym}</strong>
                </p>
              </div>

              {/* Status Bio */}
              <div className="my-4 p-3 bg-neutral-955 border border-neutral-850 rounded-2xl">
                <h4 className="text-[8px] text-[#8e8e93] uppercase font-black tracking-wider">Про себе</h4>
                <p className="text-[11px] text-neutral-350 leading-relaxed mt-1 italic">
                  "{selectedAthlete.about}"
                </p>
              </div>

              {/* Sports Stats Row Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 select-none">
                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-2xl text-center">
                  <p className="text-[8px] text-neutral-500 uppercase font-mono font-black">Стрік активності</p>
                  <p className="text-sm font-black text-emerald-400 mt-1">🔥 {selectedAthlete.streak} дн</p>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-2xl text-center">
                  <p className="text-[8px] text-neutral-500 uppercase font-mono font-black">Тренування</p>
                  <p className="text-sm font-black text-indigo-400 mt-1">💪 {selectedAthlete.workouts}</p>
                </div>
              </div>

              {/* Action Operations Trigger */}
              <div className="space-y-2">
                {friends.some(f => f.id === selectedAthlete.id) ? (
                  <>
                    {activeChannel && (
                      <button
                        onClick={() => {
                          inviteFriendToChannel(selectedAthlete);
                          setSelectedAthlete(null);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                      >
                        <UserPlus size={13} /> Запросити в "{activeChannel.name}"
                      </button>
                    )}

                    <button
                      onClick={() => {
                        removeFriend(selectedAthlete.id);
                        setSelectedAthlete(null);
                      }}
                      className="w-full bg-neutral-950 hover:bg-rose-950 border border-neutral-850 hover:border-rose-900 text-neutral-400 hover:text-rose-200 font-extrabold text-xs py-2 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Видалити з друзів
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      addFriend(selectedAthlete);
                      setSelectedAthlete(null);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                  >
                    <UserPlus size={13} /> Додати до друзів
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. Group Invitations Modal (Invite Friends to active group) */}
      {isInvitingToGroup && activeChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans animate-fade-in text-neutral-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsInvitingToGroup(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Додати до групи</span>
              <h3 className="text-base font-black text-white mt-1">Запросити у спільноту</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1">
                Виберіть друга нижче, щоб надіслати запрошення до чату <span className="text-indigo-400 font-bold">"{activeChannel.name}"</span>
              </p>
            </div>

            {/* List of current friends with Invite state tracking */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar my-4">
              {friends.length > 0 ? (
                (() => {
                  const activeChanId = activeChannel.id;
                  const currentMembers = groupMembers[activeChanId] || [];

                  return friends.map((f) => {
                    const isAlreadyMember = currentMembers.includes(f.name) || 
                                           currentMembers.some(m => m.toLowerCase().includes(f.name.toLowerCase().split(" (")[0].trim()));
                    
                    return (
                      <div
                        key={f.id}
                        className="p-2.5 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={f.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-neutral-800 shrink-0" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-black text-white truncate leading-tight">{f.name}</p>
                            <p className="text-[9px] text-[#8e8e93] leading-none mt-1 truncate">{f.favoriteGym}</p>
                          </div>
                        </div>

                        {isAlreadyMember ? (
                          <span className="text-[9px] font-bold text-neutral-500 flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-850 rounded-xl">
                            <UserCheck size={11} className="text-emerald-500" /> Член
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              inviteFriendToChannel(f);
                              setIsInvitingToGroup(false);
                            }}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow"
                          >
                            Запросити
                          </button>
                        )}
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-neutral-500 italic">У вас поки немає друзів.</p>
                  <button
                    onClick={() => {
                      setIsInvitingToGroup(false);
                      setSidebarTab("friends");
                    }}
                    className="mt-3 text-xs bg-indigo-600/20 text-indigo-400 font-extrabold px-4 py-1.5 rounded-xl border border-indigo-600/30 hover:bg-indigo-650 transition-all cursor-pointer active:scale-95"
                  >
                    Перейти до пошуку друзів
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-850 flex">
              <button
                onClick={() => setIsInvitingToGroup(false)}
                className="w-full bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-extrabold text-xs py-2.5 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Create Custom Friend Modal */}
      {isCreatingCustomFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans animate-fade-in text-neutral-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsCreatingCustomFriend(false)}
              className="absolute top-4 right-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black font-mono">Створити Друга</span>
              <h3 className="text-base font-black text-white mt-1">Новий Спортивний Друг</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1">
                Створіть кастомного користувача, щоб протестувати додавання в друзі та залучення до спортивних чатів.
              </p>
            </div>

            <form onSubmit={handleCreateCustomFriend} className="space-y-3.5">
              <div>
                <label className="block text-[9px] text-[#8e8e93] uppercase tracking-wider font-extrabold mb-1">
                  Ім'я друга / Псевдонім
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр., Дмитро, Юлія, Олексій"
                  value={customFriendName}
                  onChange={(e) => setCustomFriendName(e.target.value)}
                  maxLength={25}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-2.5 text-xs text-neutral-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-[#8e8e93] uppercase tracking-wider font-extrabold mb-1">
                    Місто
                  </label>
                  <select
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-3 py-2.5 text-xs text-neutral-200"
                    value={customFriendCity}
                    onChange={(e) => setCustomFriendCity(e.target.value)}
                  >
                    <option value="Київ">Київ</option>
                    <option value="Ірпінь">Ірпінь</option>
                    <option value="Львів">Львів</option>
                    <option value="Одеса">Одеса</option>
                    <option value="Дніпро">Дніпро</option>
                    <option value="Харків">Харків</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-[#8e8e93] uppercase tracking-wider font-extrabold mb-1">
                    Тариф підписки
                  </label>
                  <select
                    className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-3 py-2.5 text-xs text-neutral-200 font-bold"
                    value={customFriendTier}
                    onChange={(e: any) => setCustomFriendTier(e.target.value)}
                  >
                    <option value="Лайт">Лайт</option>
                    <option value="Стандарт">Стандарт</option>
                    <option value="Ультра">Ультра</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[#8e8e93] uppercase tracking-wider font-extrabold mb-1">
                  Улюблений Спортивний Клуб / Зал
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр., Sport Life Подол, Моя Фітнес Студія"
                  value={customFriendGym}
                  onChange={(e) => setCustomFriendGym(e.target.value)}
                  maxLength={35}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-600 rounded-2xl px-4 py-2.5 text-xs text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#8e8e93] uppercase tracking-wider font-extrabold mb-1">
                  Спортивний життєпис (Bio)
                </label>
                <textarea
                  placeholder="напр., Тренуюся вже 3 роки, велогонщик чи йогіня..."
                  value={customFriendAbout}
                  onChange={(e) => setCustomFriendAbout(e.target.value)}
                  maxLength={100}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:outline-none focus:border-indigo-650 rounded-2xl px-4 py-2 text-xs text-neutral-200 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomFriend(false)}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-855 text-neutral-300 font-extrabold text-xs py-2.5 rounded-2xl border border-neutral-850 transition-all cursor-pointer text-center"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-2xl tracking-wider transition-all cursor-pointer shadow active:scale-95"
                >
                  Створити & Додати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
