import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Folder, Calendar, Clock, Sparkles, Zap, Info } from 'lucide-react';
import { Task, Project, ProjectSettings, WeeklyPlan, DailySchedule, DailyScheduleItem } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectCreateProps {
  selectedTaskIds: string[];
  onCancel: () => void;
  onFinish: (project: Project) => void;
  tasks: Task[];
}

export default function ProjectCreate({ selectedTaskIds, onCancel, onFinish, tasks }: ProjectCreateProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [settings, setSettings] = useState<ProjectSettings>({
    planningMode: 'ai',
    dailyFocusHours: 4,
    restDays: [0, 6],
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));
  const totalHours = selectedTasks.reduce((acc, t) => acc + t.total_hours, 0);

  const handleFinish = () => {
    const project: Project = {
      id: Date.now().toString(),
      name: projectName || '未命名项目组',
      taskIds: selectedTaskIds,
      settings,
      weeklyPlans: generateMockWeeklyPlans(selectedTasks, settings),
      stats: {
        totalWeeks: 4,
        completedWeeks: 0,
        totalSteps: selectedTasks.reduce((acc, t) => acc + t.steps.length, 0),
        completedSteps: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onFinish(project);
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-text-secondary" />
          </button>
          <h1 className="text-xl font-black text-text-primary tracking-tight">创建项目组 ({step}/3)</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <h2 className="text-2xl font-black text-text-primary">选择要组合的任务</h2>
              <div className="space-y-4">
                {selectedTasks.map(task => (
                  <div key={task.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-text-primary mb-1">{task.title}</h3>
                      <p className="text-xs text-text-secondary">⏱️ {task.total_hours} 小时 | {task.steps.length} 个步骤</p>
                    </div>
                    <Check className="text-blue-500" />
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                <p className="text-sm font-bold text-blue-700">预计总时长：{totalHours} 小时</p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-black text-text-tertiary uppercase tracking-widest px-4">给项目组起个名字 *</label>
                <input 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="例如：春季学业冲刺"
                  className="w-full bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-text-tertiary uppercase tracking-widest px-4">规划模式 *</label>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, planningMode: 'ai' }))}
                    className={cn(
                      "p-6 rounded-[32px] text-left border-2 transition-all",
                      settings.planningMode === 'ai' ? "bg-blue-50 border-blue-500" : "bg-white border-transparent"
                    )}
                  >
                    <h4 className="font-bold text-lg text-text-primary mb-1">智能规划 (推荐)</h4>
                    <p className="text-xs text-text-secondary">AI 根据 DDL 和任务量自动排期</p>
                  </button>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, planningMode: 'manual' }))}
                    className={cn(
                      "p-6 rounded-[32px] text-left border-2 transition-all",
                      settings.planningMode === 'manual' ? "bg-blue-50 border-blue-500" : "bg-white border-transparent"
                    )}
                  >
                    <h4 className="font-bold text-lg text-text-primary mb-1">手动规划</h4>
                    <p className="text-xs text-text-secondary">我自己安排每周任务</p>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-text-tertiary uppercase tracking-widest px-4">每日专注时长 *</label>
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-black text-text-primary">{settings.dailyFocusHours} 小时</span>
                  <input 
                    type="range" min="1" max="8" step="1"
                    value={settings.dailyFocusHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, dailyFocusHours: parseInt(e.target.value) }))}
                    className="w-1/2"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={40} />
                </div>
                <h2 className="text-2xl font-black text-text-primary">✅ AI 已生成执行计划</h2>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="font-black text-lg text-text-primary border-b border-gray-50 pb-4">📊 计划概览</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">总时长</p>
                    <p className="text-lg font-black text-text-primary">{totalHours} 小时</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">平均每周</p>
                    <p className="text-lg font-black text-text-primary">{Math.round(totalHours / 4)} 小时</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <Info className="w-5 h-5 text-blue-500" />
                  <p className="text-xs text-blue-700">AI 已根据 DDL 自动分配了 4 周的任务量。</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
        {step > 1 && (
          <button 
            onClick={() => setStep(prev => prev - 1)}
            className="flex-1 py-4 rounded-[32px] bg-bg-secondary text-text-primary font-bold hover:bg-gray-200 transition-colors"
          >
            上一步
          </button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(prev => prev + 1) : handleFinish()}
          className="flex-[2] py-4 rounded-[32px] bg-blue-500 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {step < 3 ? '下一步' : '确认创建 ✓'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Mock function to generate weekly plans
function generateMockWeeklyPlans(tasks: Task[], settings: ProjectSettings): WeeklyPlan[] {
  const plans: WeeklyPlan[] = [];
  const today = new Date();
  
  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const dailySchedules: DailySchedule[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];
      const isRestDay = settings.restDays.includes(date.getDay());

      const items: DailyScheduleItem[] = [];
      if (!isRestDay && w === 0 && d < 3) { // Just add some mock items for the first few days
        const task = tasks[0];
        if (task) {
          items.push({
            taskId: task.id,
            stepId: task.steps[0].step_id,
            scheduledHours: 1,
            status: 'pending',
            timeSlot: '09:00-10:00'
          });
        }
      }

      dailySchedules.push({
        date: dateStr,
        isRestDay,
        items,
        totalScheduled: items.length,
        totalCompleted: 0
      });
    }

    plans.push({
      weekId: `w-${w}`,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      dailySchedules,
      status: w === 0 ? 'in_progress' : 'planned'
    });
  }

  return plans;
}
