import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
    cancelTaskNotifications,
    scheduleTaskNotifications,
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

  selectedTaskId: string | null;

  // -------------------------
  // Tasks
  // -------------------------

  addTask: (
    input: AddTaskInput,
  ) => Promise<string>;

  updateTask: (
    id: string,
    data: Partial<Task>,
  ) => Promise<void>;

  completeTask: (
    id: string,
  ) => Promise<void>;

  reopenTask: (
    id: string,
  ) => Promise<void>;

  deleteTask: (
    id: string,
  ) => Promise<void>;

  getTask: (
    id: string,
  ) => Task | undefined;

  // -------------------------
  // Navigation
  // -------------------------

  setScreen: (
    screen: Screen,
  ) => void;

  // -------------------------
  // Filters
  // -------------------------

  setTypeFilter: (
    filter: TypeFilter,
  ) => void;

  setPriorityFilter: (
    filter: Priority | 'all',
  ) => void;

  setReverseOrder: (
    value: boolean,
  ) => void;

  // -------------------------
  // Search
  // -------------------------

  setSearchOpen: (
    open: boolean,
  ) => void;

  setSearchQuery: (
    query: string,
  ) => void;

  // -------------------------
  // Details
  // -------------------------

  setSelectedTaskId: (
    id: string | null,
  ) => void;
}

export const useTaskStore =
  create<TaskStore>()(
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

        // =================================
        // ADD TASK
        // =================================

        addTask: async (input) => {
          const now =
            new Date().toISOString();

          const task: Task = {
            id: Crypto.randomUUID(),

            type: input.type,

            title: input.title.trim(),
            description:
              input.description.trim(),

            priority: input.priority,

            hasDeadline:
              input.hasDeadline,

            deadline:
              input.hasDeadline
                ? input.deadline
                : null,

            notifyMe:
              input.hasDeadline
                ? input.notifyMe
                : false,

            completed: false,
            completedAt: null,

            createdAt: now,
            updatedAt: now,
          };

          if (
            task.notifyMe &&
            task.hasDeadline &&
            task.deadline
          ) {
            await scheduleTaskNotifications(
              task,
            );
          }

          set((state) => ({
            tasks: [
              task,
              ...state.tasks,
            ],
          }));

          return task.id;
        },

        // =================================
        // UPDATE TASK
        // =================================

        updateTask: async (
          id,
          data,
        ) => {
          const currentTask =
            get().tasks.find(
              (task) =>
                task.id === id,
            );

          if (!currentTask) {
            return;
          }

          // Cancel existing reminders
          // belonging to this task.
          await cancelTaskNotifications(
            id,
          );

          const updatedTask: Task = {
            ...currentTask,
            ...data,

            updatedAt:
              new Date().toISOString(),
          };

          // Schedule new reminders if
          // the updated task needs them.
          if (
            !updatedTask.completed &&
            updatedTask.notifyMe &&
            updatedTask.hasDeadline &&
            updatedTask.deadline
          ) {
            await scheduleTaskNotifications(
              updatedTask,
            );
          }

          set((state) => ({
            tasks: state.tasks.map(
              (task) =>
                task.id === id
                  ? updatedTask
                  : task,
            ),
          }));
        },

        // =================================
        // COMPLETE
        // =================================

        completeTask: async (id) => {
          const task =
            get().tasks.find(
              (task) =>
                task.id === id,
            );

          if (!task) {
            return;
          }

          // Cancel all reminders for
          // this task.
          await cancelTaskNotifications(
            id,
          );

          const now =
            new Date().toISOString();

          set((state) => ({
            tasks: state.tasks.map(
              (task) =>
                task.id === id
                  ? {
                      ...task,

                      completed: true,

                      completedAt: now,

                      updatedAt: now,
                    }
                  : task,
            ),
          }));
        },

        // =================================
        // REOPEN
        // =================================

        reopenTask: async (id) => {
          const task =
            get().tasks.find(
              (task) =>
                task.id === id,
            );

          if (!task) {
            return;
          }

          const reopenedTask: Task = {
            ...task,

            completed: false,
            completedAt: null,

            updatedAt:
              new Date().toISOString(),
          };

          if (
            reopenedTask.notifyMe &&
            reopenedTask.hasDeadline &&
            reopenedTask.deadline
          ) {
            await scheduleTaskNotifications(
              reopenedTask,
            );
          }

          set((state) => ({
            tasks: state.tasks.map(
              (task) =>
                task.id === id
                  ? reopenedTask
                  : task,
            ),
          }));
        },

        // =================================
        // DELETE
        // =================================

        deleteTask: async (id) => {
          // Cancel reminders first.
          await cancelTaskNotifications(
            id,
          );

          set((state) => ({
            tasks: state.tasks.filter(
              (task) =>
                task.id !== id,
            ),
          }));
        },

        // =================================
        // GET TASK
        // =================================

        getTask: (id) =>
          get().tasks.find(
            (task) => task.id === id,
          ),

        // =================================
        // NAVIGATION
        // =================================

        setScreen: (screen) => {
          set({
            screen,

            searchOpen: false,
            searchQuery: '',
          });
        },

        // =================================
        // FILTERS
        // =================================

        setTypeFilter: (
          typeFilter,
        ) => {
          set({ typeFilter });
        },

        setPriorityFilter: (
          priorityFilter,
        ) => {
          set({ priorityFilter });
        },

        setReverseOrder: (
          reverseOrder,
        ) => {
          set({ reverseOrder });
        },

        // =================================
        // SEARCH
        // =================================

        setSearchOpen: (
          searchOpen,
        ) => {
          set({
            searchOpen,

            ...(searchOpen
              ? {}
              : {
                  searchQuery: '',
                }),
          });
        },

        setSearchQuery: (
          searchQuery,
        ) => {
          set({ searchQuery });
        },

        // =================================
        // DETAILS
        // =================================

        setSelectedTaskId: (
          selectedTaskId,
        ) => {
          set({
            selectedTaskId,
          });
        },
      }),

      {
        name: 'todo-app-storage',

        storage: {
          getItem: async (name) => {
            const value =
              await AsyncStorage.getItem(
                name,
              );

            return value
              ? JSON.parse(value)
              : null;
          },

          setItem: async (
            name,
            value,
          ) => {
            await AsyncStorage.setItem(
              name,
              JSON.stringify(value),
            );
          },

          removeItem: async (
            name,
          ) => {
            await AsyncStorage.removeItem(
              name,
            );
          },
        },
      },
    ),
  );