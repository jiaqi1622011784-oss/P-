import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutList, Calendar, Settings as SettingsIcon, MessageCircle } from 'lucide-react';
import { PersonalityType, Task, DailyPlan, DailyPlanItem } from './types';
import { useStore } from './store/useStore';
import Onboarding from './pages/Onboarding';
import TaskLibrary from './pages/TaskLibrary';
import TodayPlan from './pages/TodayPlan';
import Settings from './pages/Settings';
import ChatPanel from './components/ChatPanel';
import ConfirmModal from './components/ConfirmModal';
import PusherAvatar from './components/PusherAvatar';
import { getDailyFeedback } from './services/ai';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { 
    personality, setPersonality, 
    tasks, addTask, updateTask, deleteTask,
    dailyPlans, setDailyPlans,
    currentPusher 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'library' | 'today' | 'settings'>('library');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingTask, setPendingTask] = useState<any>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Current plan for today
  const todayStr = new Date().toISOString().split('T')[0];
  const currentPlan = dailyPlans.find(p => p.date === todayStr) || null;

  const handleTaskParsed = (taskData: any) => {
    setPendingTask(taskData);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmTask = (task: Task) => {
    addTask(task);
    if (personality) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [currentPusher?.primaryColor || '#3B82F6', '#FFFFFF']
      });
    }
  };

  const generatePlan = async (selectedIds: string[]) => {
    const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
    const items: DailyPlanItem[] = [];
    let totalHours = 0;

    selectedTasks.forEach(task => {
      const pendingSteps = task.steps.filter(s => s.status === 'pending');
      pendingSteps.forEach((step, idx) => {
        if (totalHours + step.hours <= 8) { // Max 8 hours per day
          items.push({
            taskId: task.id,
            steps: [step.step_id],
            timeSlot: `${9 + totalHours}:00-${9 + totalHours + step.hours}:00`,
            status: 'scheduled'
          });
          totalHours += step.hours;
        }
      });
    });

    const feedback = await getDailyFeedback(0, items.length, personality!);

    const newPlan: DailyPlan = {
      id: Date.now().toString(),
      date: todayStr,
      items,
      totalHours,
      completedHours: 0,
      pusherFeedback: feedback
    };

    setDailyPlans(prev => [...prev.filter(p => p.date !== todayStr), newPlan]);
    setActiveTab('today');
  };

  const toggleStepStatus = (taskId: string, stepId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !currentPlan) return;

    const step = task.steps.find(s => s.step_id === stepId);
    if (!step) return;

    const newStatus = step.status === 'done' ? 'pending' : 'done';
    const hourDiff = newStatus === 'done' ? step.hours : -step.hours;

    // Update task
    const updatedSteps = task.steps.map(s => s.step_id === stepId ? { ...s, status: newStatus as any } : s);
    const completedHours = task.completed_hours + hourDiff;
    updateTask(taskId, { 
      steps: updatedSteps, 
      completed_hours: completedHours,
      status: completedHours >= task.total_hours ? 'completed' : 'active'
    });

    // Update plan
    const updatedItems = currentPlan.items.map(item => 
      (item.taskId === taskId && item.steps.includes(stepId)) 
        ? { ...item, status: newStatus === 'done' ? 'done' as any : 'scheduled' as any } 
        : item
    );
    
    const newCompletedHours = currentPlan.completedHours + hourDiff;
    setDailyPlans(prev => prev.map(p => p.id === currentPlan.id ? {
      ...p,
      items: updatedItems,
      completedHours: newCompletedHours
    } : p));

    if (newStatus === 'done') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: [currentPusher?.primaryColor || '#3B82F6']
      });
    }
  };

  if (!personality) {
    return <Onboarding onSelect={setPersonality} />;
  }

  return (
    <div className="relative min-h-screen bg-bg-secondary max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'library' && (
            <motion.div key="library" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <TaskLibrary 
                tasks={tasks} 
                onAddTask={() => setIsChatOpen(true)} 
                onUpdateTask={updateTask}
                onGeneratePlan={generatePlan} 
              />
            </motion.div>
          )}
          {activeTab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <TodayPlan plan={currentPlan} tasks={tasks} onBack={() => setActiveTab('library')} onToggleStatus={toggleStepStatus} />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Settings personality={personality} onUpdatePersonality={setPersonality} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Pusher */}
      <div className="fixed bottom-24 left-6 z-40">
        <PusherAvatar 
          personality={personality} 
          onClick={() => setIsChatOpen(true)}
          status={isChatOpen ? 'speaking' : 'idle'}
          className="shadow-2xl"
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-6 safe-bottom z-40">
        <NavButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<LayoutList />} label="任务库" />
        <NavButton active={activeTab === 'today'} onClick={() => setActiveTab('today')} icon={<Calendar />} label="今日" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon />} label="设置" />
      </div>

      {/* Overlays */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        personality={personality} 
        onTaskParsed={handleTaskParsed}
      />
      
      <ConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        onConfirm={handleConfirmTask}
        taskData={pendingTask}
      />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-blue-500 scale-110" : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-colors",
        active ? "bg-blue-50" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
