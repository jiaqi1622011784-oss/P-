import React from 'react';
import { motion } from 'motion/react';
import { User, Bell, Database, Info, ChevronRight, LogOut, Trash2, Download, Cloud, Clock } from 'lucide-react';
import { PersonalityType } from '../types';
import { PUSHERS } from '../constants';
import PusherAvatar from '../components/PusherAvatar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SettingsProps {
  personality: PersonalityType;
  onUpdatePersonality: (type: PersonalityType) => void;
}

export default function Settings({ personality, onUpdatePersonality }: SettingsProps) {
  const pusher = PUSHERS[personality];

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">设置</h1>
      </div>

      {/* Profile Section */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <PusherAvatar personality={personality} size="lg" className="mb-4" />
          <h2 className="text-2xl font-black text-text-primary mb-1">{pusher.name}</h2>
          <p className="text-sm text-text-secondary mb-6 italic">"{pusher.greetings[0]}"</p>
          
          <div className="w-full grid grid-cols-3 gap-3">
            {(Object.keys(PUSHERS) as PersonalityType[]).map(type => (
              <button
                key={type}
                onClick={() => onUpdatePersonality(type)}
                className={cn(
                  "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  personality === type 
                    ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-100" 
                    : "bg-bg-secondary text-text-tertiary border-transparent hover:border-gray-200"
                )}
              >
                {type === 'toxic' ? '毒舌' : type === 'cute' ? '活泼' : '温柔'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 space-y-6">
        <section>
          <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest mb-3">时间管理</h4>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <SettingItem icon={<Clock className="w-5 h-5 text-blue-500" />} label="每日可用时长" value="6 小时" />
            <SettingItem icon={<Bell className="w-5 h-5 text-orange-500" />} label="提醒时间" value="09:00" />
          </div>
        </section>

        <section>
          <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest mb-3">数据管理</h4>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <SettingItem icon={<Download className="w-5 h-5 text-green-500" />} label="导出任务" />
            <SettingItem icon={<Cloud className="w-5 h-5 text-blue-400" />} label="云同步开关" value="已开启" />
            <SettingItem icon={<Trash2 className="w-5 h-5 text-danger" />} label="清空已完成" danger />
          </div>
        </section>

        <section>
          <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest mb-3">关于</h4>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <SettingItem icon={<Info className="w-5 h-5 text-text-secondary" />} label="使用教程" />
            <SettingItem icon={<LogOut className="w-5 h-5 text-text-secondary" />} label="退出登录" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value, danger }: { icon: React.ReactNode, label: string, value?: string, danger?: boolean }) {
  return (
    <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center">
          {icon}
        </div>
        <span className={cn("font-bold text-sm", danger ? "text-danger" : "text-text-primary")}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-bold text-text-tertiary">{value}</span>}
        <ChevronRight className="w-4 h-4 text-text-tertiary" />
      </div>
    </button>
  );
}
