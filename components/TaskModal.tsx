import React, { useEffect, useState } from 'react';

import {
    AlertTriangle,
    CalendarDays,
    Check,
    Clock3,
    Edit3,
    X
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
    Task,
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

  yellow: '#E6C76A',
  red: '#F06B6B',
};

interface TaskModalProps {
  task: Task | null;
  visible: boolean;

  onClose: () => void;

  onComplete: () => void;
  onReopen: () => void;

  onSave: (
    data: Partial<Task>,
  ) => Promise<void>;

  onDelete: () => void;
}

export function TaskModal({
  task,
  visible,
  onClose,
  onComplete,
  onReopen,
  onSave,
  onDelete,
}: TaskModalProps) {
  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [priority, setPriority] =
    useState<Priority>('medium');

  const [hasDeadline, setHasDeadline] =
    useState(false);

  const [deadline, setDeadline] =
    useState(new Date());

  const [notifyMe, setNotifyMe] =
    useState(false);

  const [showPicker, setShowPicker] =
    useState(false);

  const handleClose = () => {
    setEditing(false);
    setShowPicker(false);
    setConfirmDelete(false);

    onClose();
  };

  useEffect(() => {
    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setHasDeadline(task.hasDeadline);
    setNotifyMe(task.notifyMe);

    setDeadline(
      task.deadline
        ? new Date(task.deadline)
        : new Date(),
    );

    setEditing(false);
    setShowPicker(false);
  }, [task]);

  if (!task) {
    return null;
  }

  const formatDeadline = () => {
    if (!hasDeadline) {
      return 'No deadline';
    }

    return deadline.toLocaleString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = async () => {
    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      return;
    }

    await onSave({
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

    setEditing(false);
    setShowPicker(false);
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
          {confirmDelete && (
            <View style={styles.confirmOverlay}>
                <View style={styles.confirmModal}>
                <View style={styles.confirmIcon}>
                    <AlertTriangle
                    size={24}
                    color={colors.red}
                    />
                </View>

                <Text style={styles.confirmTitle}>
                    Delete task?
                </Text>

                <Text style={styles.confirmMessage}>
                    "{task.title}" will be permanently
                    deleted.
                </Text>

                <View style={styles.confirmActions}>
                    <Pressable
                    style={styles.confirmCancel}
                    onPress={() =>
                        setConfirmDelete(false)
                    }
                    >
                    <Text style={styles.confirmCancelText}>
                        Cancel
                    </Text>
                    </Pressable>

                    <Pressable
                    style={styles.confirmDelete}
                    onPress={async () => {
                        setConfirmDelete(false);
                        await onDelete();
                    }}
                    >
                    <Text style={styles.confirmDeleteText}>
                        Delete
                    </Text>
                    </Pressable>
                </View>
                </View>
            </View>
            )}
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>
                  {task.type.toUpperCase()}
                </Text>
              </View>

              {task.completed && (
                <View
                  style={
                    styles.completedBadge
                  }
                >
                  <Text
                    style={
                      styles.completedBadgeText
                    }
                  >
                    COMPLETED
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              {!editing && (
                <Pressable
                  onPress={() =>
                    setEditing(true)
                  }
                  style={styles.iconButton}
                  hitSlop={8}
                >
                  <Edit3
                    size={18}
                    color={colors.secondary}
                  />
                </Pressable>
              )}

              <Pressable
                onPress={handleClose}
                style={styles.iconButton}
                hitSlop={8}
              >
                <X
                  size={20}
                  color={colors.secondary}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.content
            }
            keyboardShouldPersistTaps="handled"
          >
            {editing ? (
              <>
                {/* TITLE */}
                <Text style={styles.label}>
                  Title
                </Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  placeholder="Task title"
                  placeholderTextColor={
                    colors.muted
                  }
                  autoCapitalize="sentences"
                />

                {/* DESCRIPTION */}
                <Text style={styles.label}>
                  Description
                </Text>

                <TextInput
                  value={description}
                  onChangeText={
                    setDescription
                  }
                  style={[
                    styles.input,
                    styles.multilineInput,
                  ]}
                  placeholder="Add some details..."
                  placeholderTextColor={
                    colors.muted
                  }
                  multiline
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />

                {/* PRIORITY */}
                <Text style={styles.label}>
                  Priority
                </Text>

                <View
                  style={styles.priorityRow}
                >
                  {(
                    [
                      'low',
                      'medium',
                      'high',
                    ] as Priority[]
                  ).map((value) => {
                    const active =
                      priority === value;

                    const color =
                      getPriorityColor(
                        value,
                      );

                    return (
                      <Pressable
                        key={value}
                        onPress={() =>
                          setPriority(
                            value,
                          )
                        }
                        style={[
                          styles.priorityButton,
                          active && {
                            borderColor:
                              color,
                            backgroundColor:
                              getPriorityBackground(
                                value,
                              ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            active && {
                              color,
                            },
                          ]}
                        >
                          {capitalize(
                            value,
                          )}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* DEADLINE */}
                <View
                  style={styles.toggleRow}
                >
                  <View
                    style={styles.toggleInfo}
                  >
                    <Text
                      style={
                        styles.toggleTitle
                      }
                    >
                      Has deadline
                    </Text>

                    <Text
                      style={
                        styles.toggleSubtitle
                      }
                    >
                      Add a date and time limit
                    </Text>
                  </View>

                  <Switch
                    value={hasDeadline}
                    onValueChange={
                      setHasDeadline
                    }
                    trackColor={{
                      false:
                        colors.elevated,
                      true:
                        colors.accent,
                    }}
                    thumbColor={
                      colors.text
                    }
                  />
                </View>

                {hasDeadline && (
                  <>
                    <Pressable
                      onPress={() =>
                        setShowPicker(
                          !showPicker,
                        )
                      }
                      style={
                        styles.dateButton
                      }
                    >
                      <CalendarDays
                        size={19}
                        color={
                          colors.secondary
                        }
                      />

                      <View
                        style={
                          styles.dateInfo
                        }
                      >
                        <Text
                          style={
                            styles.dateLabel
                          }
                        >
                          Deadline
                        </Text>

                        <Text
                          style={
                            styles.dateValue
                          }
                        >
                          {formatDeadline()}
                        </Text>
                      </View>
                    </Pressable>

                    {showPicker && (
                      <View
                        style={
                          styles.pickerContainer
                        }
                      >
                        <DateTimePicker
                          value={deadline}
                          mode="datetime"
                          display="spinner"
                          minimumDate={
                            new Date()
                          }
                          themeVariant="dark"
                          onChange={(
                            _,
                            value,
                          ) => {
                            if (
                              value
                            ) {
                              setDeadline(
                                value,
                              );
                            }
                          }}
                        />
                      </View>
                    )}

                    <View
                      style={
                        styles.toggleRow
                      }
                    >
                      <View
                        style={
                          styles.toggleInfo
                        }
                      >
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
                          Remind me before the
                          deadline
                        </Text>
                      </View>

                      <Switch
                        value={notifyMe}
                        onValueChange={
                          setNotifyMe
                        }
                        trackColor={{
                          false:
                            colors.elevated,
                          true:
                            colors.accent,
                        }}
                        thumbColor={
                          colors.text
                        }
                      />
                    </View>
                  </>
                )}

                <View
                  style={
                    styles.editActions
                  }
                >
                  <Pressable
                    onPress={() =>
                      setEditing(false)
                    }
                    style={
                      styles.cancelButton
                    }
                  >
                    <Text
                      style={
                        styles.cancelText
                      }
                    >
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSave}
                    disabled={!title.trim()}
                    style={[
                      styles.saveButton,
                      !title.trim() &&
                        styles.disabled,
                    ]}
                  >
                    <Check
                      size={18}
                      color={
                        colors.background
                      }
                    />

                    <Text
                      style={
                        styles.saveText
                      }
                    >
                      Save
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <Text
                  style={[
                    styles.title,
                    task.completed &&
                      styles.completedTitle,
                  ]}
                >
                  {task.title}
                </Text>

                {task.description ? (
                  <Text
                    style={
                      styles.description
                    }
                  >
                    {task.description}
                  </Text>
                ) : (
                  <Text
                    style={
                      styles.noDescription
                    }
                  >
                    No description
                  </Text>
                )}

                <View
                  style={styles.details}
                >
                  <View
                    style={styles.detailRow}
                  >
                    {task.hasDeadline ? (
                      <CalendarDays
                        size={20}
                        color={
                          colors.secondary
                        }
                      />
                    ) : (
                      <Clock3
                        size={20}
                        color={
                          colors.secondary
                        }
                      />
                    )}

                    <View
                      style={
                        styles.detailContent
                      }
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Deadline
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {formatDeadline()}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.detailRow}
                  >
                    <View
                      style={[
                        styles.priorityDot,
                        {
                          backgroundColor:
                            getPriorityColor(
                              task.priority,
                            ),
                        },
                      ]}
                    />

                    <View
                      style={
                        styles.detailContent
                      }
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Priority
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            color:
                              getPriorityColor(
                                task.priority,
                              ),
                          },
                        ]}
                      >
                        {capitalize(
                          task.priority,
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.detailRow}
                  >
                    <Clock3
                      size={20}
                      color={
                        colors.secondary
                      }
                    />

                    <View
                      style={
                        styles.detailContent
                      }
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Notifications
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {task.notifyMe
                          ? 'Enabled'
                          : 'Disabled'}
                      </Text>
                    </View>
                  </View>
                </View>

                {!task.completed ? (
                  <Pressable
                    style={
                      styles.completeButton
                    }
                    onPress={onComplete}
                  >
                    <Check
                      size={19}
                      color={
                        colors.background
                      }
                    />

                    <Text
                      style={
                        styles.completeText
                      }
                    >
                      Complete
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={
                      styles.reopenButton
                    }
                    onPress={onReopen}
                  >
                    <Text
                      style={
                        styles.reopenText
                      }
                    >
                      Reopen
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() =>
                    setConfirmDelete(true)
                  }
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>
                    Delete task
                  </Text>
                </Pressable>
              </>
            )}
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
  if (priority === 'high') {
    return colors.red;
  }

  if (priority === 'medium') {
    return colors.yellow;
  }

  return colors.accent;
}

function getPriorityBackground(
  priority: Priority,
) {
  if (priority === 'high') {
    return 'rgba(240, 107, 107, 0.12)';
  }

  if (priority === 'medium') {
    return 'rgba(230, 199, 106, 0.12)';
  }

  return 'rgba(143, 184, 255, 0.12)';
}

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

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 6,
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

  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 6,

    backgroundColor:
      'rgba(143, 184, 255, 0.1)',
  },

  completedBadgeText: {
    color: colors.accent,

    fontSize: 9,
    fontWeight: '800',
  },

  iconButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.elevated,
  },

  content: {
    padding: 22,
    paddingBottom: 40,
  },

  title: {
    color: colors.text,

    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },

  completedTitle: {
    color: colors.secondary,
    textDecorationLine: 'line-through',
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

  label: {
    marginTop: 12,
    marginBottom: 7,

    color: colors.secondary,

    fontSize: 12,
    fontWeight: '700',

    textTransform: 'uppercase',
    letterSpacing: 0.6,
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

    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 9,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
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

  editActions: {
    marginTop: 24,

    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,

    height: 52,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 13,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  cancelText: {
    color: colors.secondary,

    fontSize: 14,
    fontWeight: '700',
  },

  saveButton: {
    flex: 1,

    height: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    borderRadius: 13,

    backgroundColor: colors.accent,
  },

  saveText: {
    color: colors.background,

    fontSize: 14,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.35,
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

  deleteButton: {
    marginTop: 12,

    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor:
      'rgba(240, 107, 107, 0.08)',
  },

  deleteText: {
    color: colors.red,

    fontSize: 14,
    fontWeight: '700',
  },

  confirmOverlay: {
  position: 'absolute',

  top: 1,
  left: 0,
  right: 0,
  bottom: -1,

  zIndex: 100,

  alignItems: 'center',
  justifyContent: 'center',

  padding: 22,

  backgroundColor:
    'rgba(0, 0, 0, 0.72)',
  borderRadius: 23,
},

confirmModal: {
  width: '100%',

  padding: 22,

  borderRadius: 20,

  backgroundColor: colors.surface,

  borderWidth: 1,
  borderColor: colors.border,
},

confirmIcon: {
  width: 48,
  height: 48,

  borderRadius: 24,

  alignItems: 'center',
  justifyContent: 'center',

  backgroundColor:
    'rgba(240, 107, 107, 0.1)',
},

confirmTitle: {
  marginTop: 18,

  color: colors.text,

  fontSize: 21,
  fontWeight: '800',
},

confirmMessage: {
  marginTop: 8,

  color: colors.secondary,

  fontSize: 14,
  lineHeight: 20,
},

confirmActions: {
  marginTop: 24,

  flexDirection: 'row',
  gap: 10,
},

confirmCancel: {
  flex: 1,

  height: 48,

  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: 12,

  borderWidth: 1,
  borderColor: colors.border,

  backgroundColor: colors.elevated,
},

confirmCancelText: {
  color: colors.secondary,

  fontSize: 14,
  fontWeight: '700',
},

confirmDelete: {
  flex: 1,

  height: 48,

  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: 12,

  backgroundColor:
    'rgba(240, 107, 107, 0.14)',
  },

  confirmDeleteText: {
    color: colors.red,

    fontSize: 14,
    fontWeight: '800',
  },
});