import {
    CalendarDays,
    Check,
    Clock3,
    Trash2,
} from 'lucide-react-native';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Task } from '../types/task';
import {
    getDeadlineStatus,
    type DeadlineStatus,
} from '../utils/taskStatus';

const colors = {
  background: '#0F1115',
  surface: '#171A21',
  elevated: '#1E222B',
  border: '#292E38',

  text: '#F5F7FA',
  secondary: '#9AA2B1',
  muted: '#687080',

  accent: '#8FB8FF',

  green: '#69D39A',
  yellow: '#E6C76A',
  red: '#F06B6B',
};

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete: () => void;
  editMode?: boolean;
  onDelete?: () => void;
}

function getStatusColor(
  status: DeadlineStatus,
) {
  switch (status) {
    case 'green':
      return colors.green;

    case 'yellow':
      return colors.yellow;

    case 'red':
      return colors.red;

    default:
      return colors.border;
  }
}

function formatDeadline(
  deadline: string | null,
) {
  if (!deadline) {
    return 'No deadline';
  }

  return new Date(deadline).toLocaleString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPriorityStyle(
  priority: Task['priority'],
) {
  switch (priority) {
    case 'high':
      return {
        backgroundColor:
          'rgba(240, 107, 107, 0.14)',
      };

    case 'medium':
      return {
        backgroundColor:
          'rgba(230, 199, 106, 0.14)',
      };

    default:
      return {
        backgroundColor:
          'rgba(143, 184, 255, 0.12)',
      };
  }
}

function getPriorityTextStyle(
  priority: Task['priority'],
) {
  switch (priority) {
    case 'high':
      return {
        color: colors.red,
      };

    case 'medium':
      return {
        color: colors.yellow,
      };

    default:
      return {
        color: colors.accent,
      };
  }
}

export function TaskCard({
  task,
  onPress,
  onComplete,
  editMode = false,
  onDelete,
}: TaskCardProps) {
  const status = getDeadlineStatus(task);

  // Completed tasks should not show a deadline warning.
  // Today specifically wants an ongoing task to have a red line.
  const statusColor = task.completed
    ? colors.border
    : getStatusColor(status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        task.completed && styles.completedCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.statusLine,
          {
            backgroundColor: statusColor,
          },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <Text
              style={[
                styles.title,
                task.completed &&
                  styles.completedTitle,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            <Text style={styles.type}>
              {task.type === 'task'
                ? 'Task'
                : 'Plan'}
            </Text>
          </View>

          {editMode ? (
            <Pressable
                onPress={(event) => {
                event.stopPropagation();
                onDelete?.();
                }}
                style={styles.deleteButton}
                hitSlop={8}
            >
                <Trash2
                size={18}
                color={colors.red}
                />
            </Pressable>
            ) : (
            <Pressable
                onPress={(event) => {
                event.stopPropagation();

                if (!task.completed) {
                    onComplete();
                }
                }}
                style={[
                styles.completeButton,
                task.completed &&
                    styles.completedButton,
                ]}
                hitSlop={8}
            >
                <Check
                size={18}
                color={
                    task.completed
                    ? colors.accent
                    : colors.secondary
                }
                />
            </Pressable>
            )}
        </View>

        {task.description.length > 0 && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.meta}>
            {task.hasDeadline ? (
              <>
                <CalendarDays
                  size={15}
                  color={colors.secondary}
                />

                <Text style={styles.metaText}>
                  {formatDeadline(
                    task.deadline,
                  )}
                </Text>
              </>
            ) : (
              <>
                <Clock3
                  size={15}
                  color={colors.secondary}
                />

                <Text style={styles.metaText}>
                  No deadline
                </Text>
              </>
            )}
          </View>

          <View
            style={[
              styles.priority,
              getPriorityStyle(
                task.priority,
              ),
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                getPriorityTextStyle(
                  task.priority,
                ),
              ]}
            >
              {task.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,

    flexDirection: 'row',

    borderRadius: 16,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: 'hidden',
  },

  completedCard: {
    opacity: 0.72,
  },

  cardPressed: {
    opacity: 0.55,
  },

  statusLine: {
    width: 4,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  titleArea: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },

  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.secondary,
  },

  type: {
    marginTop: 4,

    color: colors.muted,

    fontSize: 12,
    fontWeight: '500',

    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  completeButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: 'center',
    justifyContent: 'center',
  },

  completedButton: {
    backgroundColor:
      'rgba(143, 184, 255, 0.1)',
    borderColor: colors.accent,
  },

  description: {
    marginTop: 12,

    color: colors.secondary,

    fontSize: 14,
    lineHeight: 20,
  },

  footer: {
    marginTop: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  meta: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },

  metaText: {
    flexShrink: 1,

    color: colors.secondary,

    fontSize: 12,
  },

  priority: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 6,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  deleteButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: 'rgba(240, 107, 107, 0.35)',

    backgroundColor:
        'rgba(240, 107, 107, 0.1)',

    alignItems: 'center',
    justifyContent: 'center',
    },
});