import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Sparkles, ChevronLeft, MoreHorizontal, Settings } from 'lucide-react';
import { Task, DailySchedule, DailyScheduleItem } from '../types';
import DailyTimeline from '../components/DailyTimeline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TodayPlanProps {
  plan: DailySchedule | null;
  tasks: Task[];
  onBack: () => void;
  onToggleStatus: (taskId: string, stepId: string) => void;
}

export default function TodayPlan({ plan, tasks, onBack, onToggleStatus }: TodayPlanProps) {
  if (!plan) return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Calendar className="w-10 h-10 text-text-tertiary" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">今日还没有计划哦</h2>
      <p className="text-text-secondary text-center mb-8">快去任务库选几个任务，让 Pusher 帮你排排期吧 ✨</p>
      <button 
        onClick={onBack}
        className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
      >
        去任务库
      </button>
    </div>
  );

  const progress = (plan.totalCompleted / plan.totalScheduled) * 100;

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-text-secondary" />
          </button>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">今日打卡</h1>
        </div>
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Settings className="w-6 h-6 text-text-secondary" />
        </button>
      </div>

      {/* Progress Card */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                className="text-blue-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-text-primary">{Math.round(progress)}%</span>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">完成</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary mb-1">3月22日 周六</h3>
            <p className="text-sm text-text-secondary mb-3">今日共安排 {plan.items.length} 个任务步骤</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                ⏱️ {plan.totalScheduled} 总计
              </span>
              <span className="px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold uppercase tracking-widest">
                ✅ {plan.totalCompleted} 已完
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-text-secondary text-sm uppercase tracking-widest">执行计划</h4>
          <button className="text-xs font-bold text-blue-500">调整可用时间</button>
        </div>
        
        <DailyTimeline 
          items={plan.items} 
          tasks={tasks} 
          onToggleStatus={onToggleStatus} 
        />
      </div>

      {/* Pusher Feedback (Bottom Sheet Style) */}
      <AnimatePresence>
        {plan.pusherFeedback && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-24 left-6 right-6 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-40"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-1">Pusher 反馈</p>
              <p className="text-sm text-text-primary font-medium italic">"{plan.pusherFeedback}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
