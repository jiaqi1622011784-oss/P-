import { useState, useEffect } from 'react';
import { Task, PersonalityType, Project, UserAchievements, ChatMessage } from '../types';
import { PUSHERS } from '../constants';

export function useStore() {
  const [personality, setPersonality] = useState<PersonalityType | null>(() => {
    return (localStorage.getItem('pusher_personality') as PersonalityType) || null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pusher_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pusher_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<UserAchievements>(() => {
    const saved = localStorage.getItem('pusher_achievements');
    return saved ? JSON.parse(saved) : {
      totalTrees: 0,
      currentStreak: 0,
      longestStreak: 0,
      lushDays: 0,
      unlockedTrees: ['oak'],
      logs: []
    };
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (personality) localStorage.setItem('pusher_personality', personality);
  }, [personality]);

  useEffect(() => {
    localStorage.setItem('pusher_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pusher_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pusher_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  };

  const currentPusher = personality ? PUSHERS[personality] : null;

  return {
    personality,
    setPersonality,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    projects,
    addProject,
    updateProject,
    achievements,
    setAchievements,
    chatHistory,
    addChatMessage,
    currentPusher
  };
}
