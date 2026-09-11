import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Flame, Eye } from 'lucide-react';
import { getCategory, initialTrending, type TrendingItem } from '@/data/mockData';

export default function ExplorePage() {
  const [items, setItems] = useState<TrendingItem[]>(initialTrending);

  const toggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item,
      ),
    );
  };

  const rankColors = [
    'from-yellow-400 to-amber-500',
    'from-slate-300 to-slate-400',
    'from-orange-400 to-amber-600',
  ];

  return (
    <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/10 border border-orange-500/20">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Top 10 Rekomendasi Minggu Ini</h2>
              <p className="text-sm text-slate-400">
                Rekomendasi paling populer dari komunitas RecoHub
              </p>
            </div>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="masonry columns-1 sm:columns-2 lg:columns-3">
          {items.map((item, i) => {
            const cat = getCategory(item.category);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass glass-hover group relative flex flex-col gap-3 p-5"
              >
                {/* Rank badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${
                        item.rank <= 3 ? rankColors[item.rank - 1] : 'bg-white/[0.06]'
                      } text-sm font-bold ${item.rank <= 3 ? 'text-black' : 'text-slate-400'}`}
                    >
                      {item.rank}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{item.avatar}</span>
                      <span className="text-xs font-medium text-slate-400">{item.author}</span>
                    </div>
                  </div>
                  {item.rank <= 3 && (
                    <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-400">Hot</span>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-1.5">
                  <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                  <span className="text-xs font-medium text-slate-500">{cat.label}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display font-bold text-white leading-snug">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.content}</p>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-3">
                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      item.liked
                        ? 'bg-rose-500/15 text-rose-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${item.liked ? 'fill-current' : ''}`} />
                    {item.likes}
                  </button>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Eye className="h-3.5 w-3.5" />
                    {(item.likes * 3.2).toFixed(0)} views
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
