import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Folder, ChevronRight, Zap, Clock, Calendar, Archive } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Project } from '../types';
import ProjectDetail from './ProjectDetail';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Action() {
  const { projects } = useStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const activeProjects = projects.filter(p => p.status === 'active');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  if (selectedProjectId) {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      return <ProjectDetail project={project} onBack={() => setSelectedProjectId(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg-secondary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">行动</h1>
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Plus className="w-6 h-6 text-text-secondary" />
        </button>
      </div>

      <div className="px-6 space-y-8">
        {/* Active Projects */}
        <section>
          <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest mb-4">进行中的项目组 ({activeProjects.length})</h4>
          {activeProjects.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-gray-200">
              <Folder className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-sm text-text-secondary font-medium">还没有项目组，从任务库创建吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map(project => (
                <div key={project.id}>
                  <ProjectCard project={project} onClick={() => setSelectedProjectId(project.id)} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Archived Projects */}
        {archivedProjects.length > 0 && (
          <section>
            <h4 className="px-4 font-bold text-text-tertiary text-[10px] uppercase tracking-widest mb-4">已归档 ({archivedProjects.length})</h4>
            <div className="space-y-4 opacity-60">
              {archivedProjects.map(project => (
                <div key={project.id}>
                  <ProjectCard project={project} onClick={() => setSelectedProjectId(project.id)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  const progress = (project.stats.completedSteps / project.stats.totalSteps) * 100 || 0;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Folder size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-text-primary group-hover:text-blue-500 transition-colors">{project.name}</h3>
            <p className="text-xs text-text-secondary">{project.taskIds.length} 个任务 · 本周进度 {Math.round(progress)}%</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-text-tertiary" />
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-text-primary">连续打卡 {project.stats.currentStreak} 天</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-text-primary">下次任务 14:00</span>
        </div>
      </div>

      <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-500 rounded-full"
        />
      </div>
    </motion.button>
  );
}
