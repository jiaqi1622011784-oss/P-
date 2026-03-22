import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Settings, LayoutGrid, LayoutList, ListChecks, Clock, Zap, TreePine, Play, CheckCircle2, Circle, Sparkles, Coffee } from 'lucide-react';
import { Project, Task, WeeklyPlan, DailySchedule, DailyScheduleItem } from '../types';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'tasks'>('weekly');
  const { tasks, updateTask, updateProject } = useStore();

  const progress = (project.stats.completedSteps / project.stats.totalSteps) * 100 || 0;
  const currentWeek = project.weeklyPlans.find(w => w.status === 'in_progress') || project.weeklyPlans[0];

  const handleToggleStatus = (taskId: string, stepId: string, date: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const step = task.steps.find(s => s.step_id === stepId);
    if (!step) return;

    const newStatus = step.status === 'done' ? 'pending' : 'done';
    const hourDiff = newStatus === 'done' ? step.hours : -step.hours;

    // Update Task
    const updatedSteps = task.steps.map(s => s.step_id === stepId ? { ...s, status: newStatus as any } : s);
    updateTask(taskId, { 
      steps: updatedSteps, 
      completed_hours: task.completed_hours + hourDiff,
      status: (task.completed_hours + hourDiff) >= task.total_hours ? 'completed' : 'active'
    });

    // Update Project
    const updatedWeeklyPlans = project.weeklyPlans.map(w => {
      const updatedDailySchedules = w.dailySchedules.map(d => {
        if (d.date === date) {
          const updatedItems = d.items.map(item => 
            (item.taskId === taskId && item.stepId === stepId) 
              ? { ...item, status: newStatus === 'done' ? 'done' as any : 'pending' as any } 
              : item
          );
          return { 
            ...d, 
            items: updatedItems,
            totalCompleted: d.totalCompleted + (newStatus === 'done' ? 1 : -1)
          };
        }
        return d;
      });
      return { ...w, dailySchedules: updatedDailySchedules };
    });

    updateProject(project.id, { 
      weeklyPlans: updatedWeeklyPlans,
      stats: {
        ...project.stats,
        completedSteps: project.stats.completedSteps + (newStatus === 'done' ? 1 : -1)
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-text-secondary" />
            </button>
            <h1 className="text-xl font-black text-text-primary tracking-tight">{project.name}</h1>
          </div>
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <Settings className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">总进度 {Math.round(progress)}%</span>
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">预计剩余 {project.stats.totalSteps - project.stats.completedSteps} 步</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-gray-200/50 p-1 rounded-2xl">
          {(['weekly', 'daily', 'tasks'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                viewMode === mode ? "bg-white text-text-primary shadow-sm" : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {mode === 'weekly' ? '每周视图' : mode === 'daily' ? '每日视图' : '任务清单'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <AnimatePresence mode="wait">
          {viewMode === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <WeeklyView week={currentWeek} tasks={tasks} onToggleStatus={handleToggleStatus} />
            </motion.div>
          )}
          {viewMode === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <DailyView week={currentWeek} tasks={tasks} onToggleStatus={handleToggleStatus} />
            </motion.div>
          )}
          {viewMode === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TaskListView project={project} tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function WeeklyView({ week, tasks, onToggleStatus }: { week: WeeklyPlan, tasks: Task[], onToggleStatus: (tid: string, sid: string, date: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">📅 本周 ({week.weekStart} - {week.weekEnd})</h2>
      </div>

      {week.dailySchedules.map(day => (
        <div key={day.date} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-text-tertiary uppercase tracking-widest">{day.date.split('-')[2]}日 周{['日','一','二','三','四','五','六'][new Date(day.date).getDay()]}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {day.isRestDay ? (
            <div className="p-6 bg-orange-50 rounded-[32px] border border-orange-100 flex items-center gap-4">
              <Coffee className="w-6 h-6 text-orange-400" />
              <p className="text-sm font-bold text-orange-700">🏃 休息日</p>
            </div>
          ) : (
            <div className="space-y-3">
              {day.items.map((item, idx) => {
                const task = tasks.find(t => t.id === item.taskId);
                const step = task?.steps.find(s => s.step_id === item.stepId);
                if (!task || !step) return null;

                return (
                  <div key={`${item.taskId}-${item.stepId}-${idx}`} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group">
                    <div className="flex-1">
                      <h4 className={cn(
                        "font-bold text-sm mb-1",
                        item.status === 'done' ? "text-success line-through opacity-60" : "text-text-primary"
                      )}>
                        {step.action}
                      </h4>
                      <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">来自：{task.title}</p>
                    </div>
                    <button 
                      onClick={() => onToggleStatus(item.taskId, item.stepId, day.date)}
                      className={cn(
                        "p-2 rounded-full transition-all",
                        item.status === 'done' ? "text-success bg-success/10" : "text-text-tertiary hover:text-blue-500 hover:bg-blue-50"
                      )}
                    >
                      {item.status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DailyView({ week, tasks, onToggleStatus }: { week: WeeklyPlan, tasks: Task[], onToggleStatus: (tid: string, sid: string, date: string) => void }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const today = week.dailySchedules.find(d => d.date === todayStr) || week.dailySchedules[0];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-100" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: today.totalCompleted / (today.items.length || 1) }} className="text-blue-500" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-text-primary">{Math.round((today.totalCompleted / (today.items.length || 1)) * 100)}%</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-text-primary mb-1">今天进度</h3>
          <p className="text-xs text-text-secondary">专注时长目标：4小时</p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">🌱 已点亮今日树木</span>
          </div>
        </div>
      </div>

      <div className="relative pl-12 space-y-12 pb-24">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100" />
        {today.items.map((item, idx) => {
          const task = tasks.find(t => t.id === item.taskId);
          const step = task?.steps.find(s => s.step_id === item.stepId);
          if (!task || !step) return null;

          return (
            <div key={`${item.taskId}-${item.stepId}-${idx}`} className="relative group">
              <div className="absolute -left-12 top-0 w-10 text-right">
                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{item.timeSlot.split('-')[0]}</span>
              </div>
              <div className={cn(
                "absolute -left-7 top-1.5 w-3 h-3 rounded-full border-2 bg-white z-10 transition-all",
                item.status === 'done' ? "border-success bg-success scale-125 shadow-lg shadow-success/20" : "border-gray-300"
              )} />
              
              <motion.div whileHover={{ x: 4 }} className={cn(
                "p-5 rounded-[32px] border-2 transition-all",
                item.status === 'done' ? "bg-success/5 border-success/20" : "bg-white border-transparent shadow-sm hover:border-gray-100"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {step.milestone && <Sparkles className="w-4 h-4 text-yellow-500" />}
                      <h4 className={cn("font-bold text-lg", item.status === 'done' ? "text-success line-through opacity-60" : "text-text-primary")}>
                        {step.action}
                      </h4>
                    </div>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">来自：{task.title}</p>
                  </div>
                  <button onClick={() => onToggleStatus(item.taskId, item.stepId, today.date)} className={cn("p-2 rounded-full transition-all", item.status === 'done' ? "text-success bg-success/10" : "text-text-tertiary hover:text-blue-500 hover:bg-blue-50")}>
                    {item.status === 'done' ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                  </button>
                </div>
                {item.status !== 'done' && (
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 fill-current" /> 开始专注
                    </button>
                    <button className="px-4 py-2.5 bg-bg-secondary text-text-secondary rounded-2xl text-xs font-black">推迟</button>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskListView({ project, tasks }: { project: Project, tasks: Task[] }) {
  const projectTasks = tasks.filter(t => project.taskIds.includes(t.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">本项目包含的原始任务</h2>
      </div>
      {projectTasks.map(task => (
        <div key={task.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <h4 className="font-bold text-lg text-text-primary mb-2">{task.title}</h4>
          <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
            <span>进度：{task.steps.filter(s => s.status === 'done').length}/{task.steps.length} 步骤</span>
            <span>预计剩余：{task.total_hours - task.completed_hours}h</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(task.completed_hours / task.total_hours) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
