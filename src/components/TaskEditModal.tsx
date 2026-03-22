import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Trash2, Clock, Sparkles } from 'lucide-react';
import { Task, TaskStep } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task;
}

export default function TaskEditModal({ isOpen, onClose, onSave, task }: TaskEditModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);

  useEffect(() => {
    if (task) setEditedTask(JSON.parse(JSON.stringify(task)));
  }, [task]);

  const handleAddStep = () => {
    const newStep: TaskStep = {
      step_id: `s-${Date.now()}`,
      action: '',
      hours: 1,
      milestone: false,
      dependency: null,
      status: 'pending',
      scheduledDate: null
    };
    setEditedTask(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleRemoveStep = (id: string) => {
    setEditedTask(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.step_id !== id)
    }));
  };

  const handleStepChange = (id: string, field: keyof TaskStep, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.step_id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleSave = () => {
    const totalHours = editedTask.steps.reduce((acc, s) => acc + s.hours, 0);
    const completedHours = editedTask.steps.filter(s => s.status === 'done').reduce((acc, s) => acc + s.hours, 0);
    
    onSave({
      ...editedTask,
      total_hours: totalHours,
      completed_hours: completedHours,
      updatedAt: new Date().toISOString()
    });
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
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 bg-bg-secondary border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-text-primary">编辑任务</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              
              <input 
                value={editedTask.title}
                onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 mb-4 placeholder:text-text-tertiary"
                placeholder="任务名称"
              />
              
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <input 
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, deadline: e.target.value }))}
                  className="bg-white px-3 py-1 rounded-full border border-border focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Steps List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text-secondary text-xs uppercase tracking-widest">执行步骤</h4>
                <button 
                  onClick={handleAddStep}
                  className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  添加步骤
                </button>
              </div>
              
              <div className="space-y-3">
                {editedTask.steps.map((step, idx) => (
                  <div key={step.step_id} className="p-4 bg-bg-secondary rounded-2xl border border-border space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                        {idx + 1}
                      </div>
                      <textarea 
                        value={step.action}
                        onChange={(e) => handleStepChange(step.step_id, 'action', e.target.value)}
                        placeholder="具体动作..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 resize-none min-h-[40px]"
                      />
                      <button 
                        onClick={() => handleRemoveStep(step.step_id)}
                        className="p-1 text-text-tertiary hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                          <input 
                            type="number"
                            value={step.hours}
                            step="0.5"
                            min="0.5"
                            onChange={(e) => handleStepChange(step.step_id, 'hours', parseFloat(e.target.value))}
                            className="w-12 bg-white border border-border rounded px-1 text-xs font-bold text-center"
                          />
                          <span className="text-[10px] font-bold text-text-tertiary uppercase">h</span>
                        </div>
                        <button 
                          onClick={() => handleStepChange(step.step_id, 'milestone', !step.milestone)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                            step.milestone ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-text-tertiary"
                          )}
                        >
                          <Sparkles className="w-3 h-3" />
                          里程碑
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleStepChange(step.step_id, 'status', step.status === 'done' ? 'pending' : 'done')}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                          step.status === 'done' ? "bg-success text-white" : "bg-white text-text-secondary border border-border"
                        )}
                      >
                        {step.status === 'done' ? '已完成' : '待办'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-border flex gap-3">
              <button 
                onClick={handleSave}
                className="flex-1 py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                保存修改
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Calendar(props: any) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
