import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TreePine, Sparkles, Share2, ChevronLeft, ChevronRight, Info, Award, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TreeStatus, TreeType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Achievement() {
  const { achievements } = useStore();
  const [viewMode, setViewMode] = useState<'forest' | 'calendar'>('forest');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = achievements.logs.find(l => l.date === todayStr);

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">成就</h1>
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Share2 className="w-6 h-6 text-text-secondary" />
        </button>
      </div>

      <div className="px-6 space-y-8">
        {/* Stats Summary */}
        <div className="flex justify-around py-4 bg-white rounded-[32px] shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">本月种植</p>
            <p className="text-xl font-black text-text-primary">{achievements.totalTrees} 棵树</p>
          </div>
          <div className="w-px h-10 bg-gray-100 self-center" />
          <div className="text-center">
            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">连续打卡</p>
            <p className="text-xl font-black text-orange-500">🔥 {achievements.currentStreak} 天</p>
          </div>
          <div className="w-px h-10 bg-gray-100 self-center" />
          <div className="text-center">
            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">最长记录</p>
            <p className="text-xl font-black text-text-primary">{achievements.longestStreak} 天</p>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-lg font-black text-text-primary">3月森林</h3>
            <p className="text-xs text-text-secondary">已点亮 {achievements.logs.filter(l => l.status !== 'none').length}/31 天</p>
          </div>

          <div className="h-64 mt-8 relative flex items-center justify-center">
            <ForestCanvas logs={achievements.logs} />
          </div>

          <div className="flex gap-2 mt-8">
            <button 
              onClick={() => setViewMode('forest')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'forest' ? "bg-blue-500 text-white shadow-lg shadow-blue-100" : "bg-bg-secondary text-text-tertiary"
              )}
            >
              近景视图
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'calendar' ? "bg-blue-500 text-white shadow-lg shadow-blue-100" : "bg-bg-secondary text-text-tertiary"
              )}
            >
              日历网格
            </button>
          </div>
        </div>

        {/* Calendar Grid (Conditional) */}
        {viewMode === 'calendar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-sm text-text-primary uppercase tracking-widest">2026年3月</h4>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-bg-secondary rounded-lg"><ChevronLeft size={20} /></button>
                <button className="p-1 hover:bg-bg-secondary rounded-lg"><ChevronRight size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['日','一','二','三','四','五','六'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-text-tertiary uppercase mb-2">{d}</div>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const date = `2026-03-${String(i + 1).padStart(2, '0')}`;
                const log = achievements.logs.find(l => l.date === date);
                return (
                  <div key={i} className="aspect-square flex flex-col items-center justify-center relative group">
                    <TreeIcon status={log?.status || 'none'} type={log?.treeType || 'oak'} size="sm" />
                    <span className="text-[8px] font-bold text-text-tertiary mt-1">{i + 1}</span>
                    {log && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-text-primary text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {log.status === 'lush' ? '🌲 茂盛' : log.status === 'growing' ? '🌳 成长中' : '🌱 幼苗'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
              <div className="flex gap-4">
                <LegendItem icon="🌱" label="幼苗" />
                <LegendItem icon="🌳" label="成长" />
                <LegendItem icon="🌲" label="茂盛" />
              </div>
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">☐ 未点亮</span>
            </div>
          </motion.div>
        )}

        {/* Recent Achievements */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest">🏆 最近解锁</h4>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">查看全部</button>
          </div>
          <div className="space-y-4">
            <AchievementBadge 
              icon="🌸" 
              title="持之以恒" 
              desc="连续7天点亮树木" 
              date="3月15日解锁" 
              color="pink"
            />
            <AchievementBadge 
              icon="🌵" 
              title="专注大师" 
              desc="单日专注时长超过 6 小时" 
              date="3月12日解锁" 
              color="green"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ForestCanvas({ logs }: { logs: any[] }) {
  // Simple representation of a forest
  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center gap-4 p-4">
      {logs.filter(l => l.status !== 'none').slice(-12).map((log, i) => (
        <motion.div
          key={log.date}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative"
        >
          <TreeIcon status={log.status} type={log.treeType} size="lg" />
          {log.isSpecial && (
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 text-yellow-500"
            >
              <Sparkles size={16} />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TreeIcon({ status, type, size }: { status: TreeStatus, type: TreeType, size: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 16, md: 24, lg: 48 };
  const s = sizes[size];

  if (status === 'none') return <div className="w-4 h-4 rounded-full bg-gray-100" />;

  const icons: Record<TreeType, string> = {
    oak: status === 'lush' ? '🌲' : status === 'growing' ? '🌳' : '🌱',
    sakura: '🌸',
    pine: '🌲',
    bamboo: '🎋',
    maple: '🍁',
    divine: '👑',
    mushroom: '🍄',
    sunflower: '🌻'
  };

  return (
    <motion.span 
      animate={status === 'lush' ? { rotate: [0, 2, -2, 0] } : {}}
      transition={{ repeat: Infinity, duration: 3 }}
      style={{ fontSize: s }}
      className="inline-block"
    >
      {icons[type] || '🌳'}
    </motion.span>
  );
}

function LegendItem({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] font-bold text-text-tertiary uppercase">{label}</span>
    </div>
  );
}

function AchievementBadge({ icon, title, desc, date, color }: { icon: string, title: string, desc: string, date: string, color: string }) {
  const colors: Record<string, string> = {
    pink: 'bg-pink-50 text-pink-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-all">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm", colors[color])}>
        {icon}
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-text-primary mb-0.5">{title}</h5>
        <p className="text-xs text-text-secondary line-clamp-1">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{date}</p>
      </div>
    </div>
  );
}
