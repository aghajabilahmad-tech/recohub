import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategory } from '@/data/mockData';
import { supabase, type SavedRecommendation } from '@/lib/supabase';

type DashboardPageProps = {
  savedItems: SavedRecommendation[];
  setSavedItems: React.Dispatch<React.SetStateAction<SavedRecommendation[]>>;
};

export default function DashboardPage({ savedItems, setSavedItems }: DashboardPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('saved_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setSavedItems(data as SavedRecommendation[]);
    }
    setLoading(false);
  };

  const filtered = savedItems.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.snippet.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || item.category === filter;
    return matchSearch && matchFilter;
  });

  const handleRemove = async (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    await supabase.from('saved_recommendations').delete().eq('id', id);
  };

  const usedCategories = Array.from(new Set(savedItems.map((i) => i.category)));

  return (
    <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 border border-brand-500/20">
              <Bookmark className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Saved Recommendations</h2>
              <p className="text-sm text-slate-400">
                {savedItems.length} rekomendasi tersimpan
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="glass flex items-center gap-2 px-3 py-2.5 flex-1">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari rekomendasi tersimpan..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter(null)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                !filter
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'glass text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {usedCategories.map((catId) => {
              const cat = getCategory(catId);
              return (
                <button
                  key={catId}
                  onClick={() => setFilter(catId)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    filter === catId
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((item) => (
                <SavedCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function SavedCard({ item, onRemove }: { item: SavedRecommendation; onRemove: (id: string) => void }) {
  const cat = getCategory(item.category);
  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="glass glass-hover group relative flex flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]`}>
            <cat.icon className={`h-5 w-5 ${cat.color}`} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">{cat.label}</span>
            <p className="text-xs text-slate-600">{timeAgo(item.created_at)}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-white">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400 line-clamp-3">{item.snippet}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-3">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Sparkles className="h-3 w-3" />
          AI Recommended
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20"
        >
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <Bookmark className="h-8 w-8 text-slate-600" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-white">Belum ada rekomendasi tersimpan</h3>
        <p className="mt-1 text-sm text-slate-400">
          Chat dengan AI dan klik tombol bookmark untuk menyimpan rekomendasi favoritmu.
        </p>
      </div>
    </div>
  );
}
