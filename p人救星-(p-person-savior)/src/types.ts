export type PersonalityType = 'toxic' | 'cute' | 'gentle';

export interface PusherConfig {
  type: PersonalityType;
  name: string;
  avatar: string;
  primaryColor: string;
  accentColor: string;
  greetings: string[];
}

export interface TaskStep {
  step_id: string;
  action: string;
  hours: number;
  milestone: boolean;
  dependency: string | null;
  status: 'pending' | 'done';
  scheduledDate: string | null;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  total_hours: number;
  completed_hours: number;
  steps: TaskStep[];
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSettings {
  planningMode: 'ai' | 'manual';
  dailyFocusHours: number;
  restDays: number[]; // 0-6
  startDate: string;
  targetEndDate: string;
}

export interface DailyScheduleItem {
  taskId: string;
  stepId: string;
  scheduledHours: number;
  status: 'pending' | 'doing' | 'done' | 'postponed';
  actualStart?: string;
  actualEnd?: string;
  timeSlot: string; // e.g., "09:00-10:00"
}

export interface DailySchedule {
  date: string;
  isRestDay: boolean;
  items: DailyScheduleItem[];
  totalScheduled: number;
  totalCompleted: number;
  pusherFeedback?: string;
}

export interface WeeklyPlan {
  weekId: string;
  weekStart: string;
  weekEnd: string;
  dailySchedules: DailySchedule[];
  status: 'planned' | 'in_progress' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  taskIds: string[];
  settings: ProjectSettings;
  weeklyPlans: WeeklyPlan[];
  stats: {
    totalWeeks: number;
    completedWeeks: number;
    totalSteps: number;
    completedSteps: number;
    currentStreak: number;
    longestStreak: number;
  };
  status: 'active' | 'paused' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type TreeStatus = 'none' | 'seedling' | 'growing' | 'lush' | 'withered';
export type TreeType = 'oak' | 'sakura' | 'pine' | 'bamboo' | 'maple' | 'divine' | 'mushroom' | 'sunflower';

export interface AchievementLog {
  id: string;
  date: string;
  status: TreeStatus;
  progress: {
    totalTasks: number;
    completedTasks: number;
    totalSteps: number;
    completedSteps: number;
    focusHours: number;
  };
  treeType: TreeType;
  isSpecial: boolean;
  unlockedAchievement: string | null;
}

export interface UserAchievements {
  totalTrees: number;
  currentStreak: number;
  longestStreak: number;
  lushDays: number;
  unlockedTrees: TreeType[];
  logs: AchievementLog[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'pusher';
  content: string;
  timestamp: number;
  type?: 'text' | 'task_confirm';
  taskData?: any;
}
