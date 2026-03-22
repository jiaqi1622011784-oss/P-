import { useState, useEffect } from 'react';
import { Task, PersonalityType, DailyPlan, ChatMessage } from '../types';
import { PUSHERS } from '../constants';

export function useStore() {
  const [personality, setPersonality] = useState<PersonalityType>(() => {
    return (localStorage.getItem('pusher_personality') as PersonalityType) || null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pusher_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>(() => {
    const saved = localStorage.getItem('pusher_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (personality) localStorage.setItem('pusher_personality', personality);
  }, [personality]);

  useEffect(() => {
    localStorage.setItem('pusher_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pusher_plans', JSON.stringify(dailyPlans));
  }, [dailyPlans]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
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
    dailyPlans,
    setDailyPlans,
    chatHistory,
    addChatMessage,
    currentPusher
  };
}
