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
  status: 'pending' | 'doing' | 'done';
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
  status: 'pending' | 'active' | 'completed' | 'dropped';
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlanItem {
  taskId: string;
  steps: string[]; // stepIds
  timeSlot: string;
  status: 'scheduled' | 'done' | 'postponed';
}

export interface DailyPlan {
  id: string;
  date: string;
  items: DailyPlanItem[];
  totalHours: number;
  completedHours: number;
  pusherFeedback: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'pusher';
  content: string;
  timestamp: number;
  type?: 'text' | 'task_confirm';
  taskData?: any;
}
