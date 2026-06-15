/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

// CHAT MODELS & INITIAL DATA
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

const chatChannels: ChatChannel[] = [
  {
    id: "general",
    name: "🏆 Загальний Фітнес-Чат",
    description: "Спілкування про спорт, здоров'я та тренування по всій Україні",
    icon: "Dumbbell",
    messages: [
      { id: "m1", sender: "Олександр (Київ)", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80", text: "Всім привіт! Сьогодні був у Sport Life Подол, басейн просто супер! Хтось ще ходить туди зранку?", timestamp: "09:15" },
      { id: "m2", sender: "Марія (Львів)", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", text: "А я відкрила для себе Shanti Yoga у Львові. Атмосфера неймовірна🧘‍♀️ Дуже затишно з нашою підпискою.", timestamp: "10:02" },
      { id: "m3", sender: "Coach GymPass", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80", text: "Привіт, спортсмени! З радістю нагадую, що ми додали нове місто — Ірпінь! Там вже працюють Стимул та ReForma Premium Club 🇺🇦 Всім продуктивних занять!", timestamp: "10:30", isOfficial: true },
    ]
  },
  {
    id: "irpin",
    name: "🌲 Ірпінь Спільнота",
    description: "Актуальні тренування, спільні пробіжки та відгуки про зали в Ірпені",
    icon: "TreePine",
    messages: [
      { id: "i1", sender: "Владислав", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80", text: "Круто, що нарешті додали Ірпінь! ReForma Club на Університетській — чудовий вибір, SPA зона та хамам на висоті.", timestamp: "11:15" },
      { id: "i2", sender: "Катерина", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80", text: "Так! Була вчора в Stimul на Соборній, відмінна силова зона для кросфіту, багато вільних ваг. Хто хоче завтра о 19:00 на спільне тренування?", timestamp: "12:05" }
    ]
  },
  {
    id: "iron",
    name: "🏋️‍♂️ Важка Атлетика & Залізо",
    description: "Силові вправи, пауерліфтинг, правильне харчування та ріст маси",
    icon: "Award",
    messages: [
      { id: "ir1", sender: "Дмитро (Одеса)", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80", text: "Хлопці, які протеїни зараз купуєте? Хтось пробував українські бренди чи краще Optimum Nutrition?", timestamp: "08:30" },
      { id: "ir2", sender: "Максим (Дніпро)", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", text: "Я беру класичний ізолят Optimum Nutrition, він дорожчий але смак і засвоєння топові. Після станової тяги чудово відновлює 💪", timestamp: "09:40" }
    ]
  },
  {
    id: "yoga",
    name: "🧘 Студія Йоги & Стретчинг",
    description: "Гармонія душі та тіла, пілатес, медитації, відновлення сил",
    icon: "Flower",
    messages: [
      { id: "y1", sender: "Тетяна", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80", text: "Дівчата, порадьте хорошого інструктора з флай-йоги у Києві. Бажано правий берег.", timestamp: "14:10" },
      { id: "y2", sender: "Ольга (Пирятин)", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80", text: "В Apollo Next є дуже хороші групові заняття зі стретчингу, тренер Аліна чудово веде клас!", timestamp: "14:55" }
    ]
  }
];

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.log("GEMINI_API_KEY key is missing or is placeholder. Running AI Coach in smart template mode.");
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body-parsing
  app.use(express.json());

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "GymPass UA Backend" });
  });

  // API Route: GymPass AI Coach
  app.post("/api/coach", async (req, res) => {
    try {
      const { message, history = [], userInfo = {} } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Повідомлення обов'язкове" });
      }

      const client = getAiClient();
      
      const promptInstruction = `Ти — розумний спортивний коуч, дієтолог та експерт GymPass UA.
GymPass UA — це єдина підписка (абонемент) на спортзали по всій Україні (Київ, Львів, Одеса, Дніпро, Харків, Івано-Франківськ).
Твоя місія — створювати плани тренувань, мотивувати користувача та радити найкращі заклади з нашої мережі відповідно до його улюблених занять та активної підписки.

Інформація про клієнта:
- Ім'я: ${userInfo.name || "Спортсмен"}
- Місто: ${userInfo.currentCity || "Київ"}
- Тарифний план: ${userInfo.currentTier || "Лайт"}
- Рівень тренувань за місяць: ${userInfo.totalWorkouts || 0} занять, серія регулярності: ${userInfo.currentStreak || 0} днів.

Ти повинен відповідати тільки українською мовою, у дружньому, спортивному, експертному стилі. Використовуй емодзі помірно та доречно (наприклад, 💪, 👟, 🧘, 🏊).
Будь ласка, пропонуй конкретні рекомендації. Якщо вони шукають тренажерний зал, басейн, кросфіт або йогу у своєму місті, розкажи про переваги нашої єдиної підписки та порекомендуй заклади (наприклад: Sport Life, CrossFit BANDA, Apollo Next, Alliance тощо, в залежності від їх міста й рівня підписки).
Тримай свої відповіді місткими, структурованими та легкими для читання на мобільному екрані.`;

      if (client) {
        // Prepare chat history for Gemini in the format required by contents
        const contentsArray: any[] = [];
        
        // Add past messages
        history.slice(-10).forEach((msg: any) => {
          contentsArray.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        });
        
        // Add current message
        contentsArray.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contentsArray,
          config: {
            systemInstruction: promptInstruction,
            temperature: 0.7,
          }
        });

        const textResponse = response.text || "Перепрошую, я не можу відповісти зараз. Спробуй пізніше!";
        return res.json({ reply: textResponse });
      } else {
        // Elegant rule-based Smart Fallback if Gemini is not initialized
        const text = message.toLowerCase();
        let reply = "";

        if (text.includes("привіт") || text.includes("добридень") || text.includes("здрав") || text.includes("hi") || text.includes("hello")) {
          reply = `Привіт, ${userInfo.name || "Спортсмене"}! 💪 Вітаю тебе в GymPass UA. Я твій розумний AI-Коуч.

Чим я можу тобі допомогти сьогодні?
1. 🏋️‍♂️ Скласти індивідуальну програму тренувань.
2. 🏊‍♂️ Підібрати найкращі спортклуби з басейном у твоєму місті (${userInfo.currentCity || "Київ"}).
3. 🥑 Дати поради щодо збалансованого харчування та схуднення/набору маси.

Напиши мені, яка твоя спортивна мета на сьогодні!`;
        } else if (text.includes("програм") || text.includes("план") || text.includes("тренуван") || text.includes("вправ")) {
          reply = `Чудове рішення! Складімо план тренувань для твоєї підписки **${userInfo.currentTier || "Стандарт"}**. 

Ось зразок фулбоді тренування на тиждень:
- **Понеділок (Силове)**: Присідання (4х10), Віджимання (3х12), румунська тяга (3x10), планка 1 хв. (Доступно в залі **${userInfo.currentCity === "Київ" ? "Sport Life або Apollo Next" : "Alliance чи Pride"}**).
- **Середа (Кардіо/Витривалість)**: 30-40 хв бігу з нахилом або заплив 1000м у басейні.
- **П'ятниця (Функціональне)**: Кросфіт комплекс на час (EMOM/AMRAP).

Тобі подобається такий темп, чи бажаєш змістити фокус на певну групу м'язів? 👟`;
        } else if (text.includes("клуб") || text.includes("зал") || text.includes("басейн") || text.includes("де поїхати") || text.includes("рекомендац")) {
          const city = userInfo.currentCity || "Київ";
          if (city === "Київ") {
            reply = `У Києві з підпискою **${userInfo.currentTier || "Стандарт"}** у тебе чудовий вибір! 🗺️

Рекомендую відвідати:
1. 🏊 **Sport Life Подол** (вул. Волоська, 62) — чудовий 25м басейн, величезна аквазона та SPA.
2. 🏋️ **Apollo Next Poznyaky** — технологічний smart-зал з автоматичним QR-входом.
3. 🔥 **CrossFit BANDA Pechersk** — найкраща кросфіт-спільнота міста.

Потрібна ідея для іншого виду спорту, наприклад, гарячої йоги чи танців?`;
          } else if (city === "Львів") {
            reply = `У Львові я рекомендую спробувати ці локації з твоєю підпискою:
1. 🥊 **Pride Fitness Club Center** (вул. Джерельна, 28) — чудова зона вільної ваги та боксу.
2. 🧘 **Shanti Yoga Студія** (вул. Вірменська, 12) — затишні та усвідомлені духовні практики.
3. 🏊 **Leo Sport Premium** — розкішний VIP-басейн та Technogym обладнання.

Обирай будь-який, генеруй QR-код у додатку та просто заходь на рецепцію!`;
          } else {
            reply = `У місті **${city}** у нас підключені круті партнерські заклади! 🎉

З твоєю підпискою **${userInfo.currentTier || "Стандарт"}** ти можеш завітати до будь-якої локації у каталозі твого міста. Просто відкрий вкладку "Каталог", обери фільтр "${city}" та знайди зал біля себе.

Які заняття тобі найбільше імпонують: залізо, плавання чи спокійний пілатес? 🧘`;
          }
        } else if (text.includes("харчуван") || text.includes("їст") || text.includes("дієт") || text.includes("калор")) {
          reply = `Харчування — це 70% успіху! 🥑 Ось кілька базових правил для твого ритму (${userInfo.totalWorkouts || 3} активних тренувань):

1. **Білок**: 1.6 - 2.0 г на кілограм маси тіла щодня, якщо прагнеш рельєфу (курка, риба, яйця, сочевиця).
2. **Водний баланс**: Пій 35 мл чистої води на кілограм ваги, особливо у тренувальні дні.
3. **Час прийому**: Легкий вуглеводно-білковий перекус за 1.5 години до залу дасть потужну енергію.

Хочеш, щоб я підрахував орієнтовний калораж? Напиши свій зріст, поточну вагу та ціль (схуднення чи набір). ⚖️`;
        } else {
          reply = `Спортивний приказ каже: головне — почати! 🚀

Ти згадав про це в розрізі тренувань, чи тебе цікавить як підключити інше місто до свого абонемента GymPass UA? Розкажи детальніше, і я розпишу план дій!`;
        }

        // Delay response slightly to simulate conversational AI natural feeling
        await new Promise((resolve) => setTimeout(resolve, 600));
        return res.json({ reply });
      }

    } catch (error: any) {
      console.error("Помилка AI Coach:", error);
      res.status(500).json({ error: "Внутрішня помилка сервера AI Coach" });
    }
  });

  // HTTP server wrap for WebSockets
  const server = http.createServer(app);

  // Set up WebSocket Server
  const wss = new WebSocketServer({ noServer: true });

  // Store active client connections
  const activeSockets = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    activeSockets.add(ws);
    
    // Broadcast active users count to everyone
    broadcastToAll({
      type: "presence",
      count: activeSockets.size
    });

    // Send initial channel list and message histories
    ws.send(JSON.stringify({
      type: "init",
      channels: chatChannels,
      activeUsersCount: activeSockets.size
    }));

    ws.on("message", (rawMsg: string) => {
      try {
        const data = JSON.parse(rawMsg);
        
        if (data.type === "message") {
          const { channelId, sender, avatarUrl, text } = data;
          
          if (!channelId || !sender || !text) return;

          const channel = chatChannels.find(c => c.id === channelId);
          if (channel) {
            const timeStr = new Date().toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit"
            });
            const newMsg: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              sender,
              avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
              text,
              timestamp: timeStr,
              isOfficial: data.isOfficial || false
            };

            // Limit history
            channel.messages.push(newMsg);
            if (channel.messages.length > 100) {
              channel.messages.shift();
            }

            // Broadcast message to all connected clients
            broadcastToAll({
              type: "message",
              channelId,
              message: newMsg
            });
          }
        } else if (data.type === "create_channel") {
          const { name, description, icon } = data;
          if (!name || !description) return;

          const newId = `chan_${Date.now()}`;
          const newChan: ChatChannel = {
            id: newId,
            name: name,
            description: description,
            icon: icon || "Users",
            messages: []
          };

          chatChannels.push(newChan);

          // Broadcast the newly created channel to all clients
          broadcastToAll({
            type: "channel_created",
            channel: newChan
          });
        }
      } catch (e) {
        console.error("Помилка обробки ws повідомлення:", e);
      }
    });

    ws.on("close", () => {
      activeSockets.delete(ws);
      broadcastToAll({
        type: "presence",
        count: activeSockets.size
      });
    });

    ws.on("error", () => {
      activeSockets.delete(ws);
    });
  });

  function broadcastToAll(data: any) {
    const payload = JSON.stringify(data);
    activeSockets.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  // Handle server upgrades
  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : "";
    if (pathname === "/ws" || pathname === "ws" || pathname.endsWith("/ws")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[GymPass UA Server] running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode with WebSockets enabled`);
  });
}

startServer();
