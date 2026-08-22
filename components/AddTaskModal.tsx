import {
    CalendarDays,
    Check,
    ChevronDown,
    X,
} from 'lucide-react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import type {
    Priority,
    TaskType,
} from '../types/task';

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

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: TaskType;
    title: string;
    description: string;
    priority: Priority;
    hasDeadline: boolean;
    deadline: string | null;
    notifyMe: boolean;
  }) => void;
}

export function AddTaskModal({
  visible,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [type, setType] =
    React.useState<TaskType>('task');

  const [title, setTitle] = React.useState('');

  const [description, setDescription] =
    React.useState('');

  const [priority, setPriority] =
    React.useState<Priority>('medium');

  const [hasDeadline, setHasDeadline] =
    React.useState(false);

  const [deadline, setDeadline] =
    React.useState(
      new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    );

  const [notifyMe, setNotifyMe] =
    React.useState(false);

  const [showDatePicker, setShowDatePicker] =
    React.useState(false);

  const reset = () => {
    setType('task');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setHasDeadline(false);
    setDeadline(
      new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    );
    setNotifyMe(false);
    setShowDatePicker(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAdd = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAdd({
      type,
      title: trimmedTitle,
      description: description.trim(),
      priority,
      hasDeadline,
      deadline: hasDeadline
        ? deadline.toISOString()
        : null,
      notifyMe: hasDeadline
        ? notifyMe
        : false,
    });

    reset();
  };

  const formatDeadline = () => {
    return deadline.toLocaleString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.heading}>
              Add {type}
            </Text>

            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={10}
            >
              <X
                size={21}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.content
            }
            keyboardShouldPersistTaps="handled"
          >
            {/* TYPE */}
            <Text style={styles.label}>
              Type
            </Text>

            <View style={styles.segmented}>
              <Pressable
                style={[
                  styles.segment,
                  type === 'task' &&
                    styles.segmentActive,
                ]}
                onPress={() =>
                  setType('task')
                }
              >
                <Text
                  style={[
                    styles.segmentText,
                    type === 'task' &&
                      styles.segmentTextActive,
                  ]}
                >
                  Task
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segment,
                  type === 'plan' &&
                    styles.segmentActive,
                ]}
                onPress={() =>
                  setType('plan')
                }
              >
                <Text
                  style={[
                    styles.segmentText,
                    type === 'plan' &&
                      styles.segmentTextActive,
                  ]}
                >
                  Plan
                </Text>
              </Pressable>
            </View>

            {/* TITLE */}
            <Text style={styles.label}>
              Title
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.muted}
              style={styles.input}
              returnKeyType="next"
              autoCapitalize="sentences"
            />

            {/* DESCRIPTION */}
            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add some details..."
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                styles.multilineInput,
              ]}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
            />

            {/* PRIORITY */}
            <Text style={styles.label}>
              Priority
            </Text>

            <View style={styles.priorityRow}>
              {(
                ['low', 'medium', 'high'] as Priority[]
              ).map((item) => {
                const active =
                  priority === item;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.priorityButton,
                      active &&
                        styles.priorityActive,
                      active &&
                        getPriorityBackground(
                          item,
                        ),
                    ]}
                    onPress={() =>
                      setPriority(item)
                    }
                  >
                    {active && (
                      <Check
                        size={14}
                        color={getPriorityColor(
                          item,
                        )}
                      />
                    )}

                    <Text
                      style={[
                        styles.priorityText,
                        active && {
                          color:
                            getPriorityColor(
                              item,
                            ),
                        },
                      ]}
                    >
                      {capitalize(item)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* DEADLINE */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>
                  Has deadline
                </Text>

                <Text style={styles.toggleSubtitle}>
                  Add a date and time limit
                </Text>
              </View>

              <Switch
                value={hasDeadline}
                onValueChange={
                  setHasDeadline
                }
                trackColor={{
                  false: colors.elevated,
                  true: colors.accent,
                }}
                thumbColor={colors.text}
              />
            </View>

            {hasDeadline && (
              <>
                <Pressable
                  style={styles.dateButton}
                  onPress={() =>
                    setShowDatePicker(
                      !showDatePicker,
                    )
                  }
                >
                  <CalendarDays
                    size={19}
                    color={colors.secondary}
                  />

                  <View
                    style={styles.dateInfo}
                  >
                    <Text
                      style={styles.dateLabel}
                    >
                      Deadline
                    </Text>

                    <Text
                      style={styles.dateValue}
                    >
                      {formatDeadline()}
                    </Text>
                  </View>

                  <ChevronDown
                    size={18}
                    color={colors.muted}
                  />
                </Pressable>

                {showDatePicker && (
                  <View
                    style={
                      styles.pickerContainer
                    }
                  >
                    <DateTimePicker
                      value={deadline}
                      mode="datetime"
                      display="spinner"
                      onChange={(_, value) => {
                        if (!value) {
                          return;
                        }

                        setDeadline(value);
                      }}
                      minimumDate={new Date()}
                      themeVariant="dark"
                    />
                  </View>
                )}

                {/* NOTIFY */}
                <View
                  style={styles.toggleRow}
                >
                  <View style={styles.toggleInfo}>
                    <Text
                      style={
                        styles.toggleTitle
                      }
                    >
                      Notify me
                    </Text>

                    <Text
                      style={
                        styles.toggleSubtitle
                      }
                    >
                      Remind me before the deadline
                    </Text>
                  </View>

                  <Switch
                    value={notifyMe}
                    onValueChange={
                      setNotifyMe
                    }
                    trackColor={{
                      false: colors.elevated,
                      true: colors.accent,
                    }}
                    thumbColor={
                      colors.text
                    }
                  />
                </View>
              </>
            )}

            {/* ADD */}
            <Pressable
              style={[
                styles.addButton,
                !title.trim() &&
                  styles.addButtonDisabled,
              ]}
              disabled={!title.trim()}
              onPress={handleAdd}
            >
              <Check
                size={19}
                color={colors.background}
              />

              <Text style={styles.addText}>
                Add {capitalize(type)}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function capitalize(value: string) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getPriorityColor(
  priority: Priority,
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

function getPriorityBackground(
  priority: Priority,
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

import React from 'react';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0, 0, 0, 0.7)',
  },

  modal: {
    maxHeight: '94%',

    backgroundColor: colors.surface,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    borderWidth: 1,
    borderColor: colors.border,
  },

  header: {
    height: 68,

    paddingHorizontal: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  heading: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
  },

  closeButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.elevated,
  },

  content: {
    padding: 22,
    paddingBottom: 36,

    gap: 10,
  },

  label: {
    marginTop: 10,

    color: colors.secondary,

    fontSize: 12,
    fontWeight: '700',

    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  segmented: {
    flexDirection: 'row',

    padding: 4,

    borderRadius: 12,

    backgroundColor: colors.elevated,
  },

  segment: {
    flex: 1,

    height: 40,

    borderRadius: 9,

    justifyContent: 'center',
    alignItems: 'center',
  },

  segmentActive: {
    backgroundColor: colors.surface,
  },

  segmentText: {
    color: colors.muted,

    fontSize: 14,
    fontWeight: '600',
  },

  segmentTextActive: {
    color: colors.text,
  },

  input: {
    minHeight: 48,

    paddingHorizontal: 14,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,

    color: colors.text,

    fontSize: 15,
  },

  multilineInput: {
    minHeight: 100,
    paddingTop: 13,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },

  priorityButton: {
    flex: 1,

    minHeight: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    borderRadius: 9,

    backgroundColor: colors.elevated,
  },

  priorityActive: {
    borderWidth: 1,
    borderColor: colors.border,
  },

  priorityText: {
    color: colors.secondary,

    fontSize: 13,
    fontWeight: '700',
  },

  toggleRow: {
    minHeight: 62,

    marginTop: 8,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toggleInfo: {
    flex: 1,
    paddingRight: 16,
  },

  toggleTitle: {
    color: colors.text,

    fontSize: 15,
    fontWeight: '700',
  },

  toggleSubtitle: {
    marginTop: 3,

    color: colors.muted,

    fontSize: 12,
  },

  dateButton: {
    minHeight: 64,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  dateInfo: {
    flex: 1,
  },

  dateLabel: {
    color: colors.muted,

    fontSize: 11,
    fontWeight: '600',
  },

  dateValue: {
    marginTop: 3,

    color: colors.text,

    fontSize: 14,
    fontWeight: '600',
  },

  pickerContainer: {
    marginTop: 4,

    borderRadius: 12,

    overflow: 'hidden',

    backgroundColor: colors.elevated,
  },

  addButton: {
    height: 52,

    marginTop: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    borderRadius: 14,

    backgroundColor: colors.accent,
  },

  addButtonDisabled: {
    opacity: 0.35,
  },

  addText: {
    color: colors.background,

    fontSize: 15,
    fontWeight: '800',
  },
});