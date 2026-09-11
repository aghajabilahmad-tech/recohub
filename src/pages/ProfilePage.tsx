import { motion } from 'framer-motion';
import { Flame, Coins, Zap, Trophy, Medal, Award, TrendingUp, Target, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { leaderboard } from '@/data/mockData';
import { supabase, type User } from '@/lib/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (!error && data) {
      setUser(data as User);
    }
    setLoading(false);
  };

  const rankBadges = [Trophy, Medal, Award];
  const rankColors = [
    'from-yellow-400 to-amber-500',
    'from-slate-300 to-slate-400',
    'from-orange-400 to-amber-600',
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  const currentUser = user ?? {
    username: 'You',
    avatar: '🦊',
    coins: 0,
    streak: 0,
    level: 1,
  };

  const stats = [
    { label: 'Current Streak', value: currentUser.streak, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { label: 'Total Coins', value: currentUser.coins, icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Level', value: currentUser.level, icon: Zap, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
  ];

  const achievements = [
    { label: 'First Chat', icon: Star, unlocked: true },
    { label: '7-Day Streak', icon: Flame, unlocked: currentUser.streak >= 7 },
    { label: 'Save 10 Items', icon: Target, unlocked: true },
    { label: 'Reach Level 10', icon: Zap, unlocked: currentUser.level >= 10 },
    { label: 'Top 5 Leaderboard', icon: Trophy, unlocked: false },
    { label: '30-Day Streak', icon: Flame, unlocked: currentUser.streak >= 30 },
  ];

  const xpInLevel = (currentUser.coins % 1000);
  const xpProgress = (xpInLevel / 1000) * 100;

  return (
    <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden p-6 lg:p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5" />
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 border border-white/10 text-5xl shadow-xl">
                {currentUser.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-white">{currentUser.username}</h2>
              <p className="text-sm text-slate-400">RecoHub Member</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 border border-white/[0.06]">
                  <span className="text-xs text-slate-400">Rank</span>
                  <span className="text-xs font-semibold text-white">#6</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 border border-brand-500/20">
                  <Zap className="h-3 w-3 text-brand-400" />
                  <span className="text-xs font-semibold text-brand-300">Level {currentUser.level}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Progress to Level {currentUser.level + 1}</span>
              <span className="font-semibold text-slate-300">{xpInLevel} / 1000 XP</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-5 ${stat.border} border`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold text-white">Achievements</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass flex flex-col items-center gap-2 p-4 text-center transition-all ${
                  ach.unlocked ? 'border-accent-500/20' : 'opacity-40'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    ach.unlocked ? 'bg-accent-500/15' : 'bg-white/[0.03]'
                  }`}
                >
                  <ach.icon className={`h-5 w-5 ${ach.unlocked ? 'text-accent-400' : 'text-slate-600'}`} />
                </div>
                <span className="text-xs font-medium text-slate-400">{ach.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-400" />
            <h3 className="font-display text-lg font-bold text-white">Leaderboard</h3>
          </div>
          <div className="glass-strong overflow-hidden">
            <div className="grid grid-cols-3 gap-2 p-5">
              {leaderboard.slice(0, 3).map((lbUser, i) => {
                const RankIcon = rankBadges[i];
                return (
                  <motion.div
                    key={lbUser.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 ${
                      i === 0 ? 'bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20' : 'bg-white/[0.02]'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${rankColors[i]} text-2xl shadow-lg`}>
                      {lbUser.avatar}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">{lbUser.name}</p>
                      <p className="text-xs text-slate-400">{lbUser.coins.toLocaleString()} coins</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <RankIcon className={`h-4 w-4 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-orange-400'}`} />
                      <span className="text-xs font-bold text-slate-300">#{i + 1}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-white/[0.04]">
              {leaderboard.map((lbUser, i) => (
                <div
                  key={lbUser.id}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02] ${
                    i !== leaderboard.length - 1 ? 'border-b border-white/[0.03]' : ''
                  } ${lbUser.name === currentUser.username ? 'bg-brand-500/5' : ''}`}
                >
                  <span className="w-6 text-center text-sm font-bold text-slate-500">{i + 1}</span>
                  <span className="text-xl">{lbUser.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{lbUser.name}</p>
                    <p className="text-xs text-slate-500">Lv. {lbUser.level} · {lbUser.streak} day streak</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-300">{lbUser.coins.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
