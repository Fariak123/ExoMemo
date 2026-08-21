import {
    CalendarDays,
    Check,
    Clock3,
    X,
} from 'lucide-react-native';

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Task } from '../types/task';

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

interface TaskModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  onReopen: () => void;
}

function formatDeadline(
  deadline: string | null,
) {
  if (!deadline) {
    return 'No deadline';
  }

  return new Date(deadline).toLocaleString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPriorityColor(
  priority: Task['priority'],
) {
  switch (priority) {
    case 'high':
      return colors.red;
    case 'medium':
      return colors.yellow;
    default:
      return colors.accent;
  }
}

export function TaskModal({
  task,
  visible,
  onClose,
  onComplete,
  onReopen,
}: TaskModalProps) {
  if (!task) {
    return null;
  }

  const priorityColor = getPriorityColor(
    task.priority,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {task.type.toUpperCase()}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={10}
            >
              <X
                size={21}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {task.title}
          </Text>

          {/* Description */}
          {task.description ? (
            <Text style={styles.description}>
              {task.description}
            </Text>
          ) : (
            <Text style={styles.noDescription}>
              No description
            </Text>
          )}

          {/* Details */}
          <View style={styles.details}>
            {/* Deadline */}
            <View style={styles.detailRow}>
              {task.hasDeadline ? (
                <CalendarDays
                  size={20}
                  color={colors.secondary}
                />
              ) : (
                <Clock3
                  size={20}
                  color={colors.secondary}
                />
              )}

              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  Deadline
                </Text>

                <Text style={styles.detailValue}>
                  {formatDeadline(
                    task.deadline,
                  )}
                </Text>
              </View>
            </View>

            {/* Priority */}
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.priorityDot,
                  {
                    backgroundColor:
                      priorityColor,
                  },
                ]}
              />

              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  Priority
                </Text>

                <Text
                  style={[
                    styles.detailValue,
                    {
                      color:
                        priorityColor,
                    },
                  ]}
                >
                  {task.priority
                    .charAt(0)
                    .toUpperCase() +
                    task.priority.slice(1)}
                </Text>
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.detailRow}>
              <Clock3
                size={20}
                color={colors.secondary}
              />

              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  Notifications
                </Text>

                <Text style={styles.detailValue}>
                  {task.notifyMe
                    ? 'Enabled'
                    : 'Disabled'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action */}
          {task.completed ? (
            <Pressable
              style={styles.reopenButton}
              onPress={onReopen}
            >
              <Text style={styles.reopenText}>
                Reopen
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.completeButton}
              onPress={onComplete}
            >
              <Check
                size={19}
                color={colors.background}
              />

              <Text
                style={styles.completeText}
              >
                Complete
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor:
      'rgba(0, 0, 0, 0.65)',
  },

  modal: {
    padding: 22,

    backgroundColor: colors.surface,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    borderWidth: 1,
    borderColor: colors.border,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 6,

    backgroundColor: colors.elevated,
  },

  typeText: {
    color: colors.secondary,

    fontSize: 10,
    fontWeight: '800',

    letterSpacing: 0.8,
  },

  closeButton: {
    width: 36,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 18,

    backgroundColor: colors.elevated,
  },

  title: {
    marginTop: 18,

    color: colors.text,

    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },

  description: {
    marginTop: 10,

    color: colors.secondary,

    fontSize: 15,
    lineHeight: 22,
  },

  noDescription: {
    marginTop: 10,

    color: colors.muted,

    fontSize: 14,
    fontStyle: 'italic',
  },

  details: {
    marginTop: 26,

    gap: 18,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 13,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    color: colors.muted,

    fontSize: 11,
    fontWeight: '600',

    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 3,

    color: colors.text,

    fontSize: 15,
    fontWeight: '600',
  },

  priorityDot: {
    width: 10,
    height: 10,

    borderRadius: 5,
  },

  completeButton: {
    marginTop: 28,

    height: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    borderRadius: 14,

    backgroundColor: colors.accent,
  },

  completeText: {
    color: colors.background,

    fontSize: 15,
    fontWeight: '800',
  },

  reopenButton: {
    marginTop: 28,

    height: 52,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  reopenText: {
    color: colors.text,

    fontSize: 15,
    fontWeight: '700',
  },
});