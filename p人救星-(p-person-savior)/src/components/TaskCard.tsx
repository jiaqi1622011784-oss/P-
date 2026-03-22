import { motion } from 'motion/react';
import { MoreVertical, Calendar, Clock, CheckCircle2, Circle, Play, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onAction?: (id: string, action: string) => void;
  key?: string;
}

export default function TaskCard({ task, onSelect, isSelected, onAction }: TaskCardProps) {
  const progress = (task.completed_hours / task.total_hours) * 100;
  const nextStep = task.steps.find(s => s.status === 'pending');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-white rounded-3xl p-5 shadow-sm border-2 transition-all",
        isSelected ? "border-blue-500 ring-4 ring-blue-50" : "border-transparent hover:border-gray-100"
      )}
      onClick={() => onSelect?.(task.id)}
    >
      {/* Priority Bar */}
      <div className={cn(
        "absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full",
        task.tags.includes('紧急') ? "bg-danger" : "bg-info"
      )} />

      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-1">{task.title}</h3>
          <div className="flex gap-4 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{task.deadline}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>进度 {task.completed_hours}/{task.total_hours}h</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-text-tertiary" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="pl-3 mb-6">
        <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Progress</span>
          <span className="text-[10px] font-bold text-blue-500">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Next Step */}
      {nextStep && (
        <div className="pl-3 p-4 bg-bg-secondary rounded-2xl border border-border flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
              <Circle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">下一步</p>
              <p className="text-sm font-semibold text-text-primary line-clamp-1">{nextStep.action}</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(task.id, 'start');
            }}
            className="p-2 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      )}

      {/* Actions (Hidden by default, shown when selected) */}
      {isSelected && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 flex gap-2"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(task.id, 'edit');
            }}
            className="flex-1 py-2.5 bg-bg-secondary rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-200 transition-colors"
          >
            编辑
          </button>
          <button className="flex-1 py-2.5 bg-bg-secondary rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-200 transition-colors">
            推迟
          </button>
          <button className="flex-1 py-2.5 bg-bg-secondary rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-200 transition-colors">
            分解
          </button>
          <button className="flex-1 py-2.5 bg-blue-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-100">
            开始专注
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
