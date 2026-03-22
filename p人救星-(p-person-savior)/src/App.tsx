import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutList, Zap, TreePine, User } from 'lucide-react';
import { PersonalityType, Task, Project } from './types';
import { useStore } from './store/useStore';
import Onboarding from './pages/Onboarding';
import TaskLibrary from './pages/TaskLibrary';
import Action from './pages/Action';
import Achievement from './pages/Achievement';
import Settings from './pages/Settings';
import ChatPanel from './components/ChatPanel';
import ConfirmModal from './components/ConfirmModal';
import PusherAvatar from './components/PusherAvatar';
import HomePusher from './pages/HomePusher';
import ProjectCreate from './pages/ProjectCreate';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AppTab = 'home' | 'library' | 'action' | 'achievement' | 'settings';

export default function App() {
  const { 
    personality, setPersonality, 
    tasks, addTask, updateTask, deleteTask,
    projects, addProject, updateProject,
    currentPusher 
  } = useStore();

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingTask, setPendingTask] = useState<any>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedTaskIdsForProject, setSelectedTaskIdsForProject] = useState<string[]>([]);

  const handleTaskParsed = (taskData: any) => {
    setPendingTask(taskData);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmTask = (task: Task) => {
    addTask(task);
  };

  const handleStartProjectCreate = (taskIds: string[]) => {
    setSelectedTaskIdsForProject(taskIds);
    setIsCreatingProject(true);
  };

  const handleFinishProjectCreate = (project: Project) => {
    addProject(project);
    setIsCreatingProject(false);
    setActiveTab('action');
  };

  if (!personality) {
    return <Onboarding onSelect={setPersonality} />;
  }

  if (isCreatingProject) {
    return (
      <ProjectCreate 
        selectedTaskIds={selectedTaskIdsForProject}
        onCancel={() => setIsCreatingProject(false)}
        onFinish={handleFinishProjectCreate}
        tasks={tasks}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-secondary max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomePusher onOpenChat={() => setIsChatOpen(true)} />
            </motion.div>
          )}
          {activeTab === 'library' && (
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TaskLibrary 
                tasks={tasks} 
                onAddTask={() => setIsChatOpen(true)} 
                onUpdateTask={updateTask}
                onGenerateProject={handleStartProjectCreate}
              />
            </motion.div>
          )}
          {activeTab === 'action' && (
            <motion.div key="action" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Action />
            </motion.div>
          )}
          {activeTab === 'achievement' && (
            <motion.div key="achievement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Achievement />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Settings personality={personality} onUpdatePersonality={setPersonality} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Pusher (Context Aware) */}
      <div className="fixed bottom-24 left-6 z-40">
        <PusherAvatar 
          personality={personality} 
          onClick={() => setIsChatOpen(true)}
          status={isChatOpen ? 'speaking' : 'idle'}
          className="shadow-2xl"
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 safe-bottom z-40">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="首页" />
        <NavButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<LayoutList />} label="任务库" />
        <NavButton active={activeTab === 'action'} onClick={() => setActiveTab('action')} icon={<Zap />} label="行动" />
        <NavButton active={activeTab === 'achievement'} onClick={() => setActiveTab('achievement')} icon={<TreePine />} label="成就" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<User />} label="我的" />
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
        "flex flex-col items-center gap-1 transition-all flex-1",
        active ? "text-blue-500 scale-110" : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-colors",
        active ? "bg-blue-50" : "bg-transparent"
      )}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
