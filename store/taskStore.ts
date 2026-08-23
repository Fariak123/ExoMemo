import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    cancelTaskNotifications,
    scheduleTaskNotifications
} from '../utils/notifications';

import type {
    AddTaskInput,
    Priority,
    Screen,
    Task,
    TypeFilter,
} from '../types/task';

interface TaskStore {
  tasks: Task[];

  screen: Screen;
  typeFilter: TypeFilter;

  searchOpen: boolean;
  searchQuery: string;

  priorityFilter: Priority | 'all';
  reverseOrder: boolean;

  historyEditMode: boolean;

  selectedTaskId: string | null;

  // Task actions
  addTask: (
  input: AddTaskInput,
) => Promise<string>;

  updateTask: (
    id: string,
    data: Partial<Task>,
  ) => void;

  completeTask: (id: string) => void;
  reopenTask: (id: string) => void;

  deleteTask: (id: string) => void;

  getTask: (id: string) => Task | undefined;

  // Navigation
  setScreen: (screen: Screen) => void;

  // Filters
  setTypeFilter: (filter: TypeFilter) => void;

  setPriorityFilter: (
    filter: Priority | 'all',
  ) => void;

  setReverseOrder: (value: boolean) => void;

  // Search
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  // History
  setHistoryEditMode: (value: boolean) => void;

  // Details
  setSelectedTaskId: (id: string | null) => void;

  resetTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      screen: 'agenda',

      typeFilter: 'all',

      searchOpen: false,
      searchQuery: '',

      priorityFilter: 'all',
      reverseOrder: false,

      historyEditMode: false,

      selectedTaskId: null,

      addTask: async (input) => {
        const now = new Date().toISOString();

        const task: Task = {
            id: Crypto.randomUUID(),

            type: input.type,

            title: input.title.trim(),
            description: input.description.trim(),

            priority: input.priority,

            hasDeadline: input.hasDeadline,
            deadline: input.hasDeadline
            ? input.deadline
            : null,

            notifyMe: input.hasDeadline
            ? input.notifyMe
            : false,

            completed: false,
            completedAt: null,

            createdAt: now,
            updatedAt: now,

            notificationIds: [],
        };

        let notificationIds: string[] = [];

        if (task.notifyMe) {
            notificationIds =
            await scheduleTaskNotifications(
                task,
            );
        }

        const finalTask: Task = {
            ...task,
            notificationIds,
        };

        set((state) => ({
            tasks: [
            finalTask,
            ...state.tasks,
            ],
        }));

        return finalTask.id;
        },

      updateTask: (id, data) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      completeTask: async (id) => {
        const task = get().tasks.find(
            (task) => task.id === id,
        );

        if (!task) {
            return;
        }

        if (task.notificationIds.length > 0) {
            await cancelTaskNotifications(
            task.notificationIds,
            );
        }

        const now = new Date().toISOString();

        set((state) => ({
            tasks: state.tasks.map((task) =>
            task.id === id
                ? {
                    ...task,
                    completed: true,
                    completedAt: now,
                    updatedAt: now,
                    notificationIds: [],
                }
                : task,
            ),
        }));
      },

      reopenTask: async (id) => {
        const task = get().tasks.find(
            (task) => task.id === id,
        );

        if (!task) {
            return;
        }

        const reopenedTask: Task = {
            ...task,
            completed: false,
            completedAt: null,
            notificationIds: [],
            updatedAt:
            new Date().toISOString(),
        };

        let notificationIds: string[] = [];

        if (
            reopenedTask.notifyMe &&
            reopenedTask.hasDeadline &&
            reopenedTask.deadline
        ) {
            notificationIds =
            await scheduleTaskNotifications(
                reopenedTask,
            );
        }

        set((state) => ({
            tasks: state.tasks.map((task) =>
            task.id === id
                ? {
                    ...reopenedTask,
                    notificationIds,
                }
                : task,
            ),
        }));
      },

      deleteTask: async (id) => {
        const task = get().tasks.find(
            (task) => task.id === id,
        );

        if (!task) {
            return;
        }

        if (task.notificationIds.length > 0) {
            await cancelTaskNotifications(
                task.notificationIds,
            );
        }

        set((state) => ({
            tasks: state.tasks.filter(
                (task) => task.id !== id,
            ),
        }));
      },

      getTask: (id) =>
        get().tasks.find((task) => task.id === id),

      setScreen: (screen) => {
        set({
          screen,
          searchOpen: false,
          searchQuery: '',
          historyEditMode:
            screen === 'history'
              ? get().historyEditMode
              : false,
        });
      },

      setTypeFilter: (typeFilter) => {
        set({ typeFilter });
      },

      setPriorityFilter: (priorityFilter) => {
        set({ priorityFilter });
      },

      setReverseOrder: (reverseOrder) => {
        set({ reverseOrder });
      },

      setSearchOpen: (searchOpen) => {
        set({
          searchOpen,
          ...(searchOpen
            ? {}
            : { searchQuery: '' }),
        });
      },

      setSearchQuery: (searchQuery) => {
        set({ searchQuery });
      },

      setHistoryEditMode: (historyEditMode) => {
        set({ historyEditMode });
      },

      setSelectedTaskId: (selectedTaskId) => {
        set({ selectedTaskId });
      },

      resetTasks: () => {
        set({
            tasks: [
            {
                id: '1',
                type: 'task',
                title: 'Finish database assignment',
                description:
                'Complete the schema and database migration.',
                priority: 'high',
                hasDeadline: true,
                deadline: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                notifyMe: false,
                completed: false,
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                notificationIds: [],
            },
            {
                id: '2',
                type: 'plan',
                title: 'Plan weekend trip',
                description:
                'Decide where to go and book transport.',
                priority: 'medium',
                hasDeadline: true,
                deadline: new Date(
                Date.now() + 6 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                notifyMe: false,
                completed: false,
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                notificationIds: [],
            },
            ],
        });
        },
    }),

    {
      name: 'todo-app-storage',

      storage: {
        getItem: async (name) => {
          const value =
            await AsyncStorage.getItem(name);

          return value
            ? JSON.parse(value)
            : null;
        },

        setItem: async (name, value) => {
          await AsyncStorage.setItem(
            name,
            JSON.stringify(value),
          );
        },

        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);