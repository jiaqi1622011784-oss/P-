import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Sparkles, Coffee, Play } from 'lucide-react';
import { DailyPlanItem, Task } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DailyTimelineProps {
  items: DailyPlanItem[];
  tasks: Task[];
  onToggleStatus: (taskId: string, stepId: string) => void;
}

export default function DailyTimeline({ items, tasks, onToggleStatus }: DailyTimelineProps) {
  return (
    <div className="relative pl-12 space-y-12 pb-24">
      {/* Timeline Line */}
      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100" />

      {items.map((item, idx) => {
        const task = tasks.find(t => t.id === item.taskId);
        if (!task) return null;
        
        const step = task.steps.find(s => item.steps.includes(s.step_id));
        if (!step) return null;

        return (
          <div key={`${item.taskId}-${idx}`} className="relative group">
            {/* Time Indicator */}
            <div className="absolute -left-12 top-0 w-10 text-right">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{item.timeSlot.split('-')[0]}</span>
            </div>

            {/* Timeline Dot */}
            <div className={cn(
              "absolute -left-7 top-1.5 w-3 h-3 rounded-full border-2 bg-white z-10 transition-all",
              item.status === 'done' ? "border-success bg-success scale-125 shadow-lg shadow-success/20" : "border-gray-300"
            )} />

            {/* Task Card */}
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                "p-5 rounded-3xl border-2 transition-all",
                item.status === 'done' ? "bg-success/5 border-success/20" : "bg-white border-transparent shadow-sm hover:border-gray-100"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.milestone && <Sparkles className="w-4 h-4 text-yellow-500" />}
                    <h4 className={cn(
                      "font-bold text-lg",
                      item.status === 'done' ? "text-success line-through opacity-60" : "text-text-primary"
                    )}>
                      {task.title}：{step.action}
                    </h4>
                  </div>
                  <div className="flex gap-3 text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>预计 {step.hours} 小时</span>
                    </div>
                    {step.milestone && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-widest">里程碑</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => onToggleStatus(item.taskId, step.step_id)}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    item.status === 'done' ? "text-success bg-success/10" : "text-text-tertiary hover:text-blue-500 hover:bg-blue-50"
                  )}
                >
                  {item.status === 'done' ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                </button>
              </div>

              {item.status !== 'done' && (
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    开始专注
                  </button>
                  <button className="px-4 py-2.5 bg-bg-secondary text-text-secondary rounded-xl text-xs font-bold">
                    推迟
                  </button>
                </div>
              )}
            </motion.div>

            {/* Auto-inserted Break (Simulated) */}
            {idx % 2 === 1 && (
              <div className="relative mt-12 mb-12 py-4 px-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
                <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-orange-300 bg-white z-10" />
                <Coffee className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">休息时间</p>
                  <p className="text-sm text-orange-600">喝杯咖啡，放松 30 分钟 ☕</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
