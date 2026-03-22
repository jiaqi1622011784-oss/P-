import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { PUSHERS } from '../constants';
import PusherAvatar from '../components/PusherAvatar';
import { MessageCircle, Sparkles, Zap, TreePine } from 'lucide-react';

interface HomePusherProps {
  onOpenChat: () => void;
}

export default function HomePusher({ onOpenChat }: HomePusherProps) {
  const { personality, currentPusher, tasks, projects, achievements } = useStore();
  const pusher = currentPusher || PUSHERS.toxic;

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const todayTrees = achievements.logs.find(l => l.date === new Date().toISOString().split('T')[0])?.status || 'none';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-secondary">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <div className="relative mb-8 inline-block">
          <PusherAvatar 
            personality={personality!} 
            size="lg" 
            className="mx-auto shadow-2xl"
            onClick={onOpenChat}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg"
          >
            <MessageCircle size={20} />
          </motion.div>
        </div>

        <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">
          {pusher.name}
        </h1>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-xs mx-auto relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t border-l border-gray-100 rotate-45" />
          <p className="text-text-secondary italic text-sm leading-relaxed">
            "{pusher.greetings[Math.floor(Math.random() * pusher.greetings.length)]}"
          </p>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <StatCard 
          icon={<Zap className="text-orange-500" />} 
          label="进行中项目" 
          value={activeProjectsCount.toString()} 
          color="orange"
        />
        <StatCard 
          icon={<TreePine className="text-green-500" />} 
          label="今日树木" 
          value={todayTrees === 'none' ? '未点亮' : '已点亮'} 
          color="green"
        />
        <StatCard 
          icon={<Sparkles className="text-blue-500" />} 
          label="待办任务" 
          value={tasks.filter(t => t.status === 'active').length.toString()} 
          color="blue"
        />
        <StatCard 
          icon={<MessageCircle className="text-purple-500" />} 
          label="连续打卡" 
          value={`${achievements.currentStreak} 天`} 
          color="purple"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenChat}
        className="mt-12 px-8 py-4 bg-blue-500 text-white rounded-full font-bold shadow-xl shadow-blue-200 flex items-center gap-3"
      >
        <MessageCircle size={24} />
        开始对话
      </motion.button>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700'
  };

  return (
    <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{label}</span>
      <span className="text-lg font-black text-text-primary">{value}</span>
    </div>
  );
}
