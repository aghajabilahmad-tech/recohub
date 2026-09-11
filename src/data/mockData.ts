import {
  Film,
  Smartphone,
  UtensilsCrossed,
  BookOpen,
  Gamepad2,
  Music,
  Plane,
  Dumbbell,
  Shirt,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
};

export const categories: Category[] = [
  { id: 'film', label: 'Rekomendasi Film', icon: Film, color: 'text-rose-400' },
  { id: 'gadget', label: 'Gadget Terbaik', icon: Smartphone, color: 'text-sky-400' },
  { id: 'food', label: 'Tempat Makan', icon: UtensilsCrossed, color: 'text-amber-400' },
  { id: 'book', label: 'Buku Wajib Baca', icon: BookOpen, color: 'text-emerald-400' },
  { id: 'game', label: 'Game Seru', icon: Gamepad2, color: 'text-violet-400' },
  { id: 'music', label: 'Musik Playlist', icon: Music, color: 'text-fuchsia-400' },
  { id: 'travel', label: 'Destinasi Wisata', icon: Plane, color: 'text-cyan-400' },
  { id: 'fitness', label: 'Routine Fitness', icon: Dumbbell, color: 'text-lime-400' },
  { id: 'fashion', label: 'OOTD Fashion', icon: Shirt, color: 'text-pink-400' },
  { id: 'ideas', label: 'Ide Kreatif', icon: Lightbulb, color: 'text-yellow-400' },
];

export function getCategory(id: string): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  category?: string;
  timestamp: number;
  saved?: boolean;
  liked?: 'up' | 'down' | null;
};

export type SavedItem = {
  id: string;
  category: string;
  title: string;
  snippet: string;
  savedAt: number;
};

export type TrendingItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  likes: number;
  liked?: boolean;
  rank: number;
};

export type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  level: number;
  streak: number;
};

// ---- AI response generator (mock) ----

const aiResponses: Record<string, string[]> = {
  film: [
    "Berdasarkan selera kamu, berikut 3 rekomendasi film minggu ini:\n\n1. **Dune: Part Two** (2024) — Epic sci-fi dengan visual menakjubkan dan cerita yang lebih dalam dari sekuel pertama.\n2. **The Holdovers** (2023) — Drama komedi hangat dengan akting Paul Giamatti yang brilian.\n3. **Poor Things** (2023) — Fantasi gelap yang unik, visualnya seperti lukisan hidup.",
  ],
  gadget: [
    "Ini gadget terbaik untuk budget dan kebutuhan kamu:\n\n1. **Samsung Galaxy S24 Ultra** — Kamera 200MP, S-Pen built-in, layar 6.8\" anti-glare.\n2. **Sony WH-1000XM5** — Noise cancelling terbaik di kelasnya, baterai 30 jam.\n3. **iPad Air M2** — Performa desktop di tablet, cocok untuk kreativitas & produktivitas.",
  ],
  food: [
    "Tempat makan recommended di Jakarta selatan:\n\n1. **Nasi Goreng Gila Sabang** — Buka 24 jam, porsi melimpah, rasa gila-gilaan.\n2. **Kopi Manyar** — Specialty coffee dengan ambience cozy, cocak untuk WFH.\n3. **Sate Khas Senayan** — Sate ayam & kambing khas, bumbu kacangnya juara.",
  ],
  book: [
    "3 buku yang wajib kamu baca bulan ini:\n\n1. **Atomic Habits** — James Clear. Cara membangun kebiasaan kecil yang berdampak besar.\n2. **Tomorrow, and Tomorrow, and Tomorrow** — Gabrielle Zevin. Novel tentang persahabatan & game design.\n3. **The Creative Act** — Rick Rubin. Filosofi kreativitas dari produser legendaris.",
  ],
  game: [
    "Game yang lagi seru-serunya:\n\n1. **Helldivers 2** — Co-op shooter yang chaotic dan hilarious bareng teman.\n2. **Persona 3 Reload** — JRPG dengan story deep dan musik banger.\n3. **Balatro** — Roguelike poker deck-builder, simple tapi bikin candu.",
  ],
  music: [
    "Playlist untuk mood kamu sekarang:\n\n1. **Lo-fi Beats** — Untuk fokus & relax, coba channel Lofi Girl.\n2. **Indonesia Indie** — Hindia, Pamungkas, Grrrl Gang untuk vibe sore.\n3. **Synthwave Mix** — Retro 80s vibes untuk energi pagi.",
  ],
  travel: [
    "Destinasi wisata yang lagi hits:\n\n1. **Labuan Bajo** — Sunset di Padar Hill, snorkeling di Pink Beach.\n2. **Bromo Tengger** — Sunrise jeep tour, savana & lautan pasir.\n3. **Karimunjawa** — Snorkeling, island hopping, konservasi hiu paus.",
  ],
  fitness: [
    "Routine fitness untuk pemula:\n\n1. **Full Body 3x/week** — Squat, bench press, deadlift, barbell row. 3 sets x 8-12 reps.\n2. **Cardio 2x/week** — 30 min jog atau HIIT 15 min untuk stamina.\n3. **Mobility & Stretching** — 10 min setiap pagi untuk fleksibilitas & recovery.",
  ],
  fashion: [
    "OOTD inspo untuk kamu:\n\n1. **Minimalist Monochrome** — Oversized tee putih, cargo pants hitam, sneakers chunky.\n2. **Smart Casual** — Linen shirt, tailored trousers, loafers. Cocok untuk dinner.\n3. **Streetwear** — Hoodie, baggy jeans, cap & sneakers. Vibe santai tapi stylish.",
  ],
  ideas: [
    "Ide kreatif untuk diakhi ini:\n\n1. **Start a digital garden** — Catatan publik tentang hal yang kamu pelajari, pakai Obsidian.\n2. **Buat podcast mini** — 15 menit per episode, bahas topik yang kamu suka.\n3. **30-day photo challenge** — Satu foto per hari dengan tema berbeda, post ke Instagram.",
  ],
};

export function generateAIResponse(categoryId: string): string {
  const responses = aiResponses[categoryId];
  if (!responses) return "Maaf, aku belum punya rekomendasi untuk kategori itu. Coba pilih kategori lain ya!";
  return responses[Math.floor(Math.random() * responses.length)];
}

// ---- Mock saved items ----

export const initialSavedItems: SavedItem[] = [
  {
    id: 's1',
    category: 'film',
    title: 'Dune: Part Two',
    snippet: 'Epic sci-fi dengan visual menakjubkan dan cerita yang lebih dalam dari sekuel pertama.',
    savedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 's2',
    category: 'gadget',
    title: 'Sony WH-1000XM5',
    snippet: 'Noise cancelling terbaik di kelasnya, baterai 30 jam, cocok untuk travel & WFH.',
    savedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 's3',
    category: 'food',
    title: 'Kopi Manyar',
    snippet: 'Specialty coffee dengan ambience cozy di Jakarta Selatan, cocok untuk WFH.',
    savedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 's4',
    category: 'travel',
    title: 'Labuan Bajo',
    snippet: 'Sunset di Padar Hill, snorkeling di Pink Beach, island hopping yang memuaskan.',
    savedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
];

// ---- Mock trending items ----

export const initialTrending: TrendingItem[] = [
  {
    id: 't1',
    category: 'film',
    title: '10 Film Sci-Fi Wajib Tonton 2026',
    content: 'Dari Dune Part Two sampai Mickey 17, ini daftar film sci-fi paling ditunggu tahun ini. Cerita, visual, dan OST yang bikin kamu nempel di kursi.',
    author: 'CinemaLover',
    avatar: '🎬',
    likes: 1240,
    rank: 1,
  },
  {
    id: 't2',
    category: 'gadget',
    title: 'Headphone IDR 1-2 Juta Terbaik',
    content: 'Review singkat 5 headphone terbaik di kelas 1-2 juta: Sony, Audio-Technica, Sennheiser, JBL, dan Edifier. Mana yang paling worth?',
    author: 'GadgetGuru',
    avatar: '🎧',
    likes: 980,
    rank: 2,
  },
  {
    id: 't3',
    category: 'food',
    title: 'Hidden Gem Cafe Jakarta',
    content: 'Bukan sekedar Kopi Klotek atau Anomali. Ini 10 cafe hidden gem dengan kopi specialty yang bikin nagih. Ada yang buka sampai tengah malam!',
    author: 'FoodieJkt',
    avatar: '☕',
    likes: 875,
    rank: 3,
  },
  {
    id: 't4',
    category: 'travel',
    title: 'Backpacking Lombok 3D2N',
    content: 'Itinerary lengkap backpacking Lombok dengan budget di bawah 1 juta. Dari Senggigi sampai Gili Trawangan, semua dijelaskan detail.',
    author: 'WanderlustID',
    avatar: '🏝️',
    likes: 760,
    rank: 4,
  },
  {
    id: 't5',
    category: 'game',
    title: 'Indie Games 2026 yang Wajib Coba',
    content: 'Balatro, Pacific Drive, Manor Lords, dan 7 indie game lain yang bikin kamu lupa waktu. Beberapa bisa jalan di laptop ringan!',
    author: 'IndieGamer',
    avatar: '🎮',
    likes: 645,
    rank: 5,
  },
  {
    id: 't6',
    category: 'book',
    title: '5 Buku Self-Improvement yang Nggak Boring',
    content: 'Kalo Atomic Habits terlalu mainstream, coba 5 buku self-improvement ini. Ditulis dengan storytelling yang nggak bikin kamu bosen.',
    author: 'BookwormID',
    avatar: '📚',
    likes: 520,
    rank: 6,
  },
  {
    id: 't7',
    category: 'fitness',
    title: 'Home Workout Tanpa Alat',
    content: 'Routine bodyweight 20 menit yang bisa kamu lakukan di rumah tanpa alat apapun. Cukup 3x seminggu untuk hasil yang kelihatan.',
    author: 'FitLife',
    avatar: '💪',
    likes: 430,
    rank: 7,
  },
  {
    id: 't8',
    category: 'music',
    title: 'Playlist untuk Productivity Boost',
    content: 'Dari lo-fi sampai ambient, 7 playlist yang terbukti bikin kamu lebih fokus saat kerja atau belajar. Ada link Spotify langsung!',
    author: 'MusicMood',
    avatar: '🎵',
    likes: 380,
    rank: 8,
  },
  {
    id: 't9',
    category: 'fashion',
    title: 'Capsule Wardrobe Pria 2026',
    content: '12 item pakaian yang bisa mix-and-match untuk 30+ OOTD. Minimalis, hemat, tapi tetap stylish. Cocok untuk yang mau simplify closet.',
    author: 'StyleHacks',
    avatar: '👔',
    likes: 310,
    rank: 9,
  },
  {
    id: 't10',
    category: 'ideas',
    title: 'Side Project Ideas untuk Developer',
    content: '10 ide side project yang bisa kamu bangun dalam weekend. Dari CLI tool sampai browser extension, semua ada tutorialnya.',
    author: 'BuildInPublic',
    avatar: '💡',
    likes: 250,
    rank: 10,
  },
];

// ---- Mock leaderboard ----

export const leaderboard: LeaderboardUser[] = [
  { id: 'u1', name: 'CinemaLover', avatar: '🎬', coins: 4820, level: 24, streak: 18 },
  { id: 'u2', name: 'GadgetGuru', avatar: '🎧', coins: 3950, level: 19, streak: 12 },
  { id: 'u3', name: 'FoodieJkt', avatar: '☕', coins: 3100, level: 16, streak: 9 },
  { id: 'u4', name: 'WanderlustID', avatar: '🏝️', coins: 2750, level: 14, streak: 7 },
  { id: 'u5', name: 'IndieGamer', avatar: '🎮', coins: 2400, level: 12, streak: 5 },
];

export const currentUser = {
  name: 'You',
  avatar: '🦊',
  coins: 1850,
  level: 9,
  streak: 5,
  rank: 6,
};
