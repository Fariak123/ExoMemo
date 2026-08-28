import type {
  Priority,
  Screen,
  Task,
  TypeFilter,
} from '../types/task';

interface GetVisibleTasksParams {
  tasks: Task[];
  screen: Screen;
  typeFilter: TypeFilter;
  searchQuery: string;
  priorityFilter: Priority | 'all';
  reverseOrder: boolean;
  now: Date;
}

function isSameDay(
  dateA: Date,
  dateB: Date,
) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function getVisibleTasks({
  tasks,
  screen,
  typeFilter,
  searchQuery,
  priorityFilter,
  reverseOrder,
  now,
}: GetVisibleTasksParams): Task[] {
  let result = [...tasks];

  // -------------------------
  // Screen filter
  // -------------------------

  if (screen === 'agenda') {
    result = result.filter(
      (task) => !task.completed,
    );
  }

  if (screen === 'history') {
    result = result.filter(
      (task) => task.completed,
    );
  }

  if (screen === 'today') {
    result = result.filter((task) => {
      // Completed task:
      // show only if it was completed today.
      if (task.completed) {
        if (!task.completedAt) {
          return false;
        }

        return isSameDay(
          new Date(task.completedAt),
          now,
        );
      }

      // Ongoing task:
      // show only if its deadline is today.
      if (!task.hasDeadline || !task.deadline) {
        return false;
      }

      return isSameDay(
        new Date(task.deadline),
        now,
      );
    });
  }

  // -------------------------
  // Task / Plan
  // -------------------------

  if (typeFilter !== 'all') {
    result = result.filter(
      (task) => task.type === typeFilter,
    );
  }

  // -------------------------
  // Priority
  // -------------------------

  if (priorityFilter !== 'all') {
    result = result.filter(
      (task) =>
        task.priority === priorityFilter,
    );
  }

  // -------------------------
  // Search
  // -------------------------

  const query = searchQuery
    .trim()
    .toLowerCase();

  if (query) {
    result = result.filter((task) => {
      return (
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          .toLowerCase()
          .includes(query)
      );
    });
  }

  // -------------------------
  // Sorting
  // -------------------------

  if (screen === 'agenda') {
    result.sort((a, b) => {
      if (
        a.deadline === null &&
        b.deadline !== null
      ) {
        return 1;
      }

      if (
        a.deadline !== null &&
        b.deadline === null
      ) {
        return -1;
      }

      if (
        a.deadline &&
        b.deadline
      ) {
        return (
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      return 0;
    });
  }

  if (screen === 'today') {
    result.sort((a, b) => {
      if (
        a.completed !== b.completed
      ) {
        return a.completed ? 1 : -1;
      }

      if (
        !a.completed &&
        !b.completed &&
        a.deadline &&
        b.deadline
      ) {
        return (
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      if (
        a.completed &&
        b.completed &&
        a.completedAt &&
        b.completedAt
      ) {
        return (
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime()
        );
      }

      return 0;
    });
  }

  if (screen === 'history') {
    result.sort((a, b) => {
      return (
        new Date(
          b.completedAt!,
        ).getTime() -
        new Date(
          a.completedAt!,
        ).getTime()
      );
    });
  }

  if (reverseOrder) {
    result.reverse();
  }

  return result;
}