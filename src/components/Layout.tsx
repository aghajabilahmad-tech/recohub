import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Flame, Coins, Zap } from 'lucide-react';
import Sidebar from './Sidebar';
import type { User } from '@/lib/supabase';

type LayoutProps = {
  user: User | null;
};

export default function Layout({ user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const streak = user?.streak ?? 0;
  const coins = user?.coins ?? 0;
  const level = user?.level ?? 1;
  const avatar = user?.avatar ?? '🦊';
  const username = user?.username ?? 'You';

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-base font-bold text-white">RecoHub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">{streak}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1">
              <Coins className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">{coins}</span>
            </div>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/60 px-8 py-4 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1.5">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{coins} Coins</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5">
              <span className="text-lg">{avatar}</span>
              <span className="text-sm font-medium text-slate-300">{username}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-accent-500/10 px-3 py-1.5 border border-brand-500/20">
              <Zap className="h-4 w-4 text-brand-400" />
              <span className="text-sm font-semibold text-white">Lv. {level}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
