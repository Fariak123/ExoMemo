import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Task } from '../types/task';

const CHANNEL_ID = 'deadline-reminders';

export async function configureNotifications() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    CHANNEL_ID,
    {
      name: 'Deadline reminders',
      importance:
        Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    },
  );
}

export async function requestNotificationPermission() {
  const current =
    await Notifications.getPermissionsAsync();

  if (current.granted) {
    return true;
  }

  if (!current.canAskAgain) {
    return false;
  }

  const requested =
    await Notifications.requestPermissionsAsync();

  return requested.granted;
}

function getReminderDates(
  deadline: Date,
) {
  const dates: Date[] = [];

  for (
    let daysBefore = 7;
    daysBefore >= 0;
    daysBefore--
  ) {
    const reminder = new Date(deadline);

    reminder.setDate(
      reminder.getDate() -
        daysBefore,
    );

    if (
      reminder.getTime() >
      Date.now()
    ) {
      dates.push(reminder);
    }
  }

  return dates;
}

function getReminderMessage(
  reminderDate: Date,
  deadline: Date,
) {
  const difference =
    deadline.getTime() -
    reminderDate.getTime();

  const daysRemaining = Math.round(
    difference /
      (24 * 60 * 60 * 1000),
  );

  if (daysRemaining <= 0) {
    return 'Your deadline is now.';
  }

  if (daysRemaining === 1) {
    return 'Your deadline is tomorrow.';
  }

  return `${daysRemaining} days until your deadline.`;
}

export async function scheduleTaskNotifications(
  task: Task,
) {
  if (
    task.completed ||
    !task.notifyMe ||
    !task.hasDeadline ||
    !task.deadline
  ) {
    return;
  }

  const deadline = new Date(
    task.deadline,
  );

  if (
    deadline.getTime() <=
    Date.now()
  ) {
    return;
  }

  const permissionGranted =
    await requestNotificationPermission();

  if (!permissionGranted) {
    return;
  }

  const dates =
    getReminderDates(deadline);

  for (const date of dates) {
    await Notifications.scheduleNotificationAsync(
      {
        content: {
          title: task.title,

          body: getReminderMessage(
            date,
            deadline,
          ),

          data: {
            taskId: task.id,
          },

          sound: 'default',
        },

        trigger: {
          type: Notifications
            .SchedulableTriggerInputTypes
            .DATE,

          date,

          ...(Platform.OS === 'android'
            ? {
                channelId:
                  CHANNEL_ID,
              }
            : {}),
        },
      },
    );
  }
}

export async function cancelTaskNotifications(
  taskId: string,
) {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    const scheduledTaskId =
      notification.content.data
        ?.taskId;

    if (
      scheduledTaskId === taskId
    ) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}

export async function reconcileTaskNotifications(
  tasks: Task[],
) {
  let scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  const activeTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.notifyMe &&
      task.hasDeadline &&
      task.deadline &&
      new Date(task.deadline).getTime() >
        Date.now(),
  );

  const activeTaskIds = new Set(
    activeTasks.map((task) => task.id),
  );

  for (const notification of scheduled) {
    const taskId =
      notification.content.data?.taskId;

    if (
      typeof taskId === 'string' &&
      !activeTaskIds.has(taskId)
    ) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }

  scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  const permissions =
    await Notifications.getPermissionsAsync();

  if (!permissions.granted) {
    return;
  }

  const scheduledTaskIds = new Set<string>();

  for (const notification of scheduled) {
    const taskId =
      notification.content.data?.taskId;

    if (
      typeof taskId === 'string' &&
      activeTaskIds.has(taskId)
    ) {
      scheduledTaskIds.add(taskId);
    }
  }

  for (const task of activeTasks) {
    if (!scheduledTaskIds.has(task.id)) {
      await scheduleTaskNotifications(task);
    }
  }
}