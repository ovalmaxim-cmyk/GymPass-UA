/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BarItem {
  id: string;
  name: string;
  category: "shakes" | "boosters" | "snacks" | "supplements";
  categoryLabel: string;
  description: string;
  price: number;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  flavors?: string[];
}

export const BAR_ITEMS: BarItem[] = [
  // Протеїнові коктейлі / Shakes
  {
    id: "bar_1",
    name: "Whey Gold Shake",
    category: "shakes",
    categoryLabel: "Коктейлі",
    description: "Сироватковий ізолят преміум класу. Насичений смак, чистий білок та швидке засвоєння м'язами.",
    price: 95,
    imageUrl: "https://images.unsplash.com/photo-1579758629938-03607ccfbad2?auto=format&fit=crop&w=405&q=80",
    calories: 145,
    protein: 26,
    carbs: 3,
    fat: 1.5,
    flavors: ["Подвійний Шоколад", "Банановий Сплеск", "Солона Карамель", "Лісова Суниця"],
  },
  {
    id: "bar_2",
    name: "Casein Night Charge",
    category: "shakes",
    categoryLabel: "Коктейлі",
    description: "Казеїновий міцелярний протеїн для тривалого та поступового підживлення м'язових волокон амінокислотами.",
    price: 105,
    imageUrl: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=405&q=80",
    calories: 150,
    protein: 28,
    carbs: 4,
    fat: 1.2,
    flavors: ["Ванільний Крем", "Шоколадне Печиво"],
  },
  {
    id: "bar_3",
    name: "Vegan Green Pea & Soy",
    category: "shakes",
    categoryLabel: "Коктейлі",
    description: "Органічний соєво-гороховий ізолят. Чисті рослинні білки з додаванням суперфудів. Без лактози та цукру.",
    price: 90,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=405&q=80",
    calories: 125,
    protein: 23,
    carbs: 2,
    fat: 0.8,
    flavors: ["М'ята-Шоколад", "Малина-Ваніль", "Натуральний"],
  },
  {
    id: "bar_4",
    name: "Mass Gainer Mega",
    category: "shakes",
    categoryLabel: "Коктейлі",
    description: "Високоенергетичний гейнер з комплексними вуглеводами для швидкого набору сухої м'язової маси.",
    price: 110,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=405&q=80",
    calories: 420,
    protein: 30,
    carbs: 65,
    fat: 3.5,
    flavors: ["Какао Карнавал", "Стиглий Банан"],
  },

  // Амінокислоти & Енергетики / Boosters
  {
    id: "bar_5",
    name: "BCAA 2:1:1 Recover Drink",
    category: "boosters",
    categoryLabel: "Амінокислоти",
    description: "Швидкорозчинний освіжаючий комплекс незамінних амінокислот (Лейцин, Ізолейцин, Валін) для запобігання катаболізму.",
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=405&q=80",
    calories: 18,
    protein: 5,
    carbs: 0.5,
    fat: 0,
    flavors: ["Зелене Яблуко", "Дика Вишня", "Синя Малина", "Апельсиновий Бум"],
  },
  {
    id: "bar_6",
    name: "Pre-Workout Fire Ignition",
    category: "boosters",
    categoryLabel: "Передтренувальні комплекси",
    description: "Потужний передтренувальний шот: таурин, кофеїн, бета-аланін та цитрулін. Максимальний драйв, фокус та пампінг.",
    price: 85,
    imageUrl: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=405&q=80",
    calories: 25,
    protein: 0,
    carbs: 4,
    fat: 0,
    flavors: ["Лаймовий Вибух", "Кавуновий Сплеск"],
  },
  {
    id: "bar_7",
    name: "L-Carnitine 3000 Active",
    category: "boosters",
    categoryLabel: "Спалювачі жиру",
    description: "Рідкий ультраконцентрований L-карнітин для прискорення метаболізму та спалювання жиру під час кардіо-навантажень.",
    price: 50,
    imageUrl: "https://images.unsplash.com/photo-1611536326696-b52be8ea45f6?auto=format&fit=crop&w=405&q=80",
    calories: 12,
    protein: 0,
    carbs: 1,
    fat: 0,
    flavors: ["Ананасовий Тропік", "Грейпфрут"],
  },
  {
    id: "bar_8",
    name: "Isotonic Hydra Drink",
    category: "boosters",
    categoryLabel: "Освіжаючі солі",
    description: "Ізотонічний вітамінно-мінеральний напій з електролітами для стабілізації водно-сольового балансу.",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=405&q=80",
    calories: 48,
    protein: 0,
    carbs: 12,
    fat: 0,
    flavors: ["Лимон-Лайм", "Ягідний Мікс", "Лохина"],
  },

  // Снеки & Шоколадки / Snacks & Bars
  {
    id: "bar_9",
    name: "Power Pro Bar 36%",
    category: "snacks",
    categoryLabel: "Снеки",
    description: "Протеїновий батончик преміум-серії без цукру, з високим вмістом клітковини, вкритий ніжним темним дієтичним шоколадом.",
    price: 40,
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=405&q=80",
    calories: 180,
    protein: 22,
    carbs: 12,
    fat: 6,
    flavors: ["Кокосовий Нугат", "Солона Арахісова Паста", "Фісташкове Праліне"],
  },
  {
    id: "bar_10",
    name: "Fit Cookie Choco Chip",
    category: "snacks",
    categoryLabel: "Снеки",
    description: "Ніжне та поживне вівсяне печиво без цукру, насичене сироватковим білком та шматочками натурального шоколаду.",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190fc9959b?auto=format&fit=crop&w=405&q=80",
    calories: 155,
    protein: 11,
    carbs: 18,
    fat: 4.8,
  },
  {
    id: "bar_11",
    name: "Organic Granola Energy Bar",
    category: "snacks",
    categoryLabel: "Снеки",
    description: "Хрусткий натуральний батончик із запечених злаків, гарбузового насіння, волоських горіхів, кураги та бджолиного меду.",
    price: 30,
    imageUrl: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=405&q=80",
    calories: 130,
    protein: 4,
    carbs: 22,
    fat: 3.2,
  },

  // Спортивні добавки / Supplements
  {
    id: "bar_12",
    name: "Creatine Pure Creapure",
    category: "supplements",
    categoryLabel: "Добавки",
    description: "Порція найчистішого мікронізованого креатину моногідрату. Максимальний приріст силових показників та гідратація клітин.",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=405&q=80",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    id: "bar_13",
    name: "Athlete Multivitamin Shaker",
    category: "supplements",
    categoryLabel: "Добавки",
    description: "Збалансований комплекс ключових вітамінів (A, C, D, E, B-група) та мінералів (цинк, залізо, магній) для захисту організму.",
    price: 30,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=405&q=80",
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
  },
  {
    id: "bar_14",
    name: "Collagen Joint Protect",
    category: "supplements",
    categoryLabel: "Добавки",
    description: "Порційний питний гідролізований пептидний колаген типу I/III з вітаміном С та гіалуроновою кислотою для зв'язок.",
    price: 40,
    imageUrl: "https://images.unsplash.com/photo-1626202378265-d412de3108ff?auto=format&fit=crop&w=405&q=80",
    calories: 35,
    protein: 8,
    carbs: 0,
    fat: 0,
    flavors: ["Апельсин", "Лісові Ягоди"],
  }
];

export interface BarOrder {
  id: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedFlavor?: string;
    selectedLiquid?: string;
  }[];
  totalPrice: number;
  pickupGymId: string;
  pickupGymName: string;
  date: string;
  time: string;
  status: "в очікуванні" | "готовий до видачі" | "видано";
  pickupCode: string;
  isPaidOnline: boolean;
}
