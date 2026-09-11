import type { Task } from '../types/task';

export interface HistoryGroup {
  key: string;
  label: string;
  tasks: Task[];
}

function isSameDay(
  a: Date,
  b: Date,
) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getDateLabel(date: Date) {
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  if (isSameDay(date, today)) {
    return 'Today';
  }

  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

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
  const groups = new Map<
    string,
    HistoryGroup
  >();

  for (const task of tasks) {
    if (
      !task.completed ||
      !task.completedAt
    ) {
      continue;
    }

    const completedDate = new Date(
      task.completedAt,
    );

    const key =
      getDateKey(completedDate);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: getDateLabel(
          completedDate,
        ),
        tasks: [],
      });
    }

    groups
      .get(key)!
      .tasks.push(task);
  }

  return Array.from(
    groups.values(),
  )
    .map((group) => ({
      ...group,

      // Newest completed task first
      tasks: [...group.tasks].sort(
        (a, b) =>
          new Date(
            b.completedAt!,
          ).getTime() -
          new Date(
            a.completedAt!,
          ).getTime(),
      ),
    }))
    .sort(
      (a, b) =>
        new Date(
          b.tasks[0].completedAt!,
        ).getTime() -
        new Date(
          a.tasks[0].completedAt!,
        ).getTime(),
    );
}