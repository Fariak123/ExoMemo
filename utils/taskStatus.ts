import type { Task } from '../types/task';

export type DeadlineStatus =
  | 'none'
  | 'green'
  | 'yellow'
  | 'red';

export function getDeadlineStatus(
  task: Task,
): DeadlineStatus {
  if (
    task.completed ||
    !task.hasDeadline ||
    !task.deadline
  ) {
    return 'none';
  }

  const now = Date.now();

  const deadline = new Date(
    task.deadline,
  ).getTime();

  const difference =
    deadline - now;

  const threeDays =
    3 * 24 * 60 * 60 * 1000;

  const sevenDays =
    7 * 24 * 60 * 60 * 1000;

  if (difference <= threeDays) {
    return 'red';
  }

  if (difference <= sevenDays) {
    return 'yellow';
  }

  return 'green';
}