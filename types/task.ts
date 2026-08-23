export type TaskType = 'task' | 'plan';

export type Priority = 'low' | 'medium' | 'high';

export type Screen = 'agenda' | 'today' | 'history';

export type TypeFilter = 'all' | TaskType;

export interface Task {
  id: string;

  type: TaskType;

  title: string;
  description: string;

  priority: Priority;

  hasDeadline: boolean;
  deadline: string | null;

  notifyMe: boolean;

  completed: boolean;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AddTaskInput {
  type: TaskType;

  title: string;
  description: string;

  priority: Priority;

  hasDeadline: boolean;
  deadline: string | null;

  notifyMe: boolean;
}