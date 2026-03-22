import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Settings, History, LayoutGrid, LayoutList, Calendar, Check, ArrowRight } from 'lucide-react';
import { Task, PersonalityType } from '../types';
import TaskCard from '../components/TaskCard';
import TaskEditModal from '../components/TaskEditModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskLibraryProps {
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onGeneratePlan: (taskIds: string[]) => void;
}

export default function TaskLibrary({ tasks, onAddTask, onUpdateTask, onGeneratePlan }: TaskLibraryProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'done'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return t.status !== 'completed';
    if (filter === 'done') return t.status === 'completed';
    return true; // Simple filter for now
  });

  const toggleSelection = (id: string) => {
    if (!isSelectionMode) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleTaskAction = (id: string, action: string) => {
    if (action === 'edit') {
      const task = tasks.find(t => t.id === id);
      if (task) setEditingTask(task);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">任务库</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <History className="w-6 h-6 text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <Settings className="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Tabs & View Switcher */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="flex bg-gray-200/50 p-1 rounded-2xl">
          {(['all', 'today', 'week', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                filter === f ? "bg-white text-text-primary shadow-sm" : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {f === 'all' ? '全部' : f === 'today' ? '今日' : f === 'week' ? '本周' : '已完成'}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setViewMode(prev => prev === 'list' ? 'kanban' : 'list')}
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          {viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <LayoutList className="w-5 h-5" />}
        </button>
      </div>

      {/* Selection Mode Toggle */}
      <div className="px-6 mb-4 flex justify-between items-center">
        <button 
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]);
          }}
          className={cn(
            "text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors",
            isSelectionMode ? "bg-blue-500 text-white" : "bg-white text-text-secondary border border-border"
          )}
        >
          {isSelectionMode ? '取消选择' : '选择任务生成计划'}
        </button>
        {isSelectionMode && (
          <span className="text-xs font-bold text-blue-500">{selectedIds.length} 个已选</span>
        )}
      </div>

      {/* Task List */}
      <div className="px-6 space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Calendar className="w-10 h-10 text-text-tertiary" />
            </div>
            <p className="text-text-secondary font-medium">还没有任务哦，快去跟 Pusher 聊聊吧</p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'list' ? "space-y-4" : "grid grid-cols-2 gap-4"
          )}>
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isSelected={selectedIds.includes(task.id)}
                onSelect={(id) => isSelectionMode ? toggleSelection(id) : null}
                onAction={handleTaskAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isSelectionMode ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onAddTask}
            className="fixed bottom-24 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-300 flex items-center justify-center z-40 active:scale-95 transition-transform"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        ) : selectedIds.length > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => onGeneratePlan(selectedIds)}
            className="fixed bottom-24 left-6 right-6 py-4 bg-blue-500 text-white rounded-3xl shadow-2xl shadow-blue-300 flex items-center justify-center gap-3 z-40 active:scale-95 transition-transform font-bold"
          >
            生成今日清单
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editingTask && (
        <TaskEditModal 
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedTask) => onUpdateTask(updatedTask.id, updatedTask)}
          task={editingTask}
        />
      )}
    </div>
  );
}
