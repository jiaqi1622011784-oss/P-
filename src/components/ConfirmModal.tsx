import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Clock, ListChecks, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (task: Task) => void;
  taskData: any;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, taskData }: ConfirmModalProps) {
  if (!taskData) return null;

  const handleConfirm = () => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed_hours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: taskData.steps.map((s: any) => ({
        ...s,
        status: 'pending',
        scheduledDate: null
      }))
    };
    onConfirm(newTask);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 bg-bg-secondary border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <ListChecks className="w-6 h-6" />
                  <h3 className="font-bold text-xl">📋 任务识别结果</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-text-primary mb-3">{taskData.title}</h2>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-sm text-text-secondary bg-white px-3 py-1.5 rounded-full border border-border">
                  <Calendar className="w-4 h-4" />
                  <span>{taskData.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary bg-white px-3 py-1.5 rounded-full border border-border">
                  <Clock className="w-4 h-4" />
                  <span>{taskData.total_hours}小时</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text-secondary text-sm uppercase tracking-widest">拆解步骤</h4>
                <span className="text-xs text-text-tertiary">{taskData.steps.length} 个步骤</span>
              </div>
              
              <div className="space-y-3">
                {taskData.steps.map((step: any, idx: number) => (
                  <div key={step.step_id} className="flex gap-4 p-4 bg-bg-secondary rounded-2xl border border-border group hover:border-blue-200 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-sm font-bold text-text-secondary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {step.milestone && <Sparkles className="w-4 h-4 text-yellow-500" />}
                        <p className="font-semibold text-text-primary">{step.action}</p>
                      </div>
                      <p className="text-xs text-text-secondary">预计耗时: {step.hours}h</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  AI 已将任务拆解为 2 小时以内的可执行步骤。你可以稍后在任务库中进一步调整。
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-border flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-bg-secondary text-text-primary font-bold hover:bg-gray-200 transition-colors"
              >
                修改
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-[2] py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                确认入库
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
