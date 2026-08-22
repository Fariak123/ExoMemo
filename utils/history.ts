import type { Task } from '../types/task';

export interface HistoryGroup {
  key: string;
  label: string;
  tasks: Task[];
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateLabel(date: Date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function groupHistoryTasks(
  tasks: Task[],
): HistoryGroup[] {
  const groups = new Map<string, HistoryGroup>();

  const completedTasks = tasks
    .filter(
      (task) =>
        task.completed &&
        task.completedAt !== null,
    )
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() -
        new Date(a.completedAt!).getTime(),
    );

  for (const task of completedTasks) {
    const date = new Date(task.completedAt!);
    const key = getDateKey(date);

    let group = groups.get(key);

    if (!group) {
      group = {
        key,
        label: getDateLabel(date),
        tasks: [],
      };

      groups.set(key, group);
    }

    group.tasks.push(task);
  }

  return Array.from(groups.values());
}