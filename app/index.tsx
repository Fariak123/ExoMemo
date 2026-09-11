import {
  CalendarDays,
  Clock3,
  History,
  ListFilter,
  Plus,
  Search,
} from 'lucide-react-native';

import {
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FilterModal } from '@/components/FilterModal';
import { SwipeableTaskCard } from '@/components/SwipeableTaskCard';
import { TaskModal } from '@/components/TaskModal';
import { colors, layout } from '@/constants/theme';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { groupHistoryTasks } from '@/utils/history';
import { configureNotifications, reconcileTaskNotifications } from '@/utils/notifications';
import React, { useEffect } from 'react';
import { AddTaskModal } from '../components/AddTaskModal';
import { useTaskStore } from '../store/taskStore';
import type { Screen } from '../types/task';
import { getVisibleTasks } from '../utils/taskFilters';

const screens: {
  id: Screen;
  label: string;
}[] = [
  {
    id: 'agenda',
    label: 'Agenda',
  },
  {
    id: 'today',
    label: 'Today',
  },
  {
    id: 'history',
    label: 'History',
  },
];

function getEmptyState(
  screen: Screen,
) {
  switch (screen) {
    case 'agenda':
      return {
        title: 'All clear',
        description:
          'You have no ongoing tasks or plans.',
      };

    case 'today':
      return {
        title: 'Nothing for today',
        description:
          'Tasks due today will appear here.',
      };

    case 'history':
      return {
        title: 'No completed tasks',
        description:
          'Completed tasks will appear here.',
      };
  }
}

export default function HomeScreen() {

  const insets = useSafeAreaInsets();

  const [
    filterModalVisible,
    setFilterModalVisible,
  ] = React.useState(false);

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const tasks = useTaskStore(
    (state) => state.tasks,
  );

  const screen = useTaskStore(
    (state) => state.screen,
  );

  const typeFilter = useTaskStore(
    (state) => state.typeFilter,
  );

  const searchOpen = useTaskStore(
    (state) => state.searchOpen,
  );

  const searchQuery = useTaskStore(
    (state) => state.searchQuery,
  );

  const priorityFilter = useTaskStore(
    (state) => state.priorityFilter,
  );

  const reverseOrder = useTaskStore(
    (state) => state.reverseOrder,
  );

  const selectedTaskId = useTaskStore(
    (state) => state.selectedTaskId,
  );

  const selectedTask = useTaskStore(
    (state) =>
      state.tasks.find(
        (task) => task.id === selectedTaskId,
      ) ?? null,
  );

  const addTask = useTaskStore(
    (state) => state.addTask,
  );

  const reopenTask = useTaskStore(
    (state) => state.reopenTask,
  );

  const updateTask = useTaskStore(
    (state) => state.updateTask,
  );

  const setScreen = useTaskStore(
    (state) => state.setScreen,
  );

  const setTypeFilter = useTaskStore(
    (state) => state.setTypeFilter,
  );

  const setSearchOpen = useTaskStore(
    (state) => state.setSearchOpen,
  );

  const setSearchQuery = useTaskStore(
    (state) => state.setSearchQuery,
  );

  const completeTask = useTaskStore(
    (state) => state.completeTask,
  );

  const setSelectedTaskId = useTaskStore(
    (state) => state.setSelectedTaskId,
  );

  const now = useCurrentTime();

  const visibleTasks = getVisibleTasks({
    tasks,
    screen,
    typeFilter,
    searchQuery,
    priorityFilter,
    reverseOrder,
    now,
  });

  const deleteTask = useTaskStore(
    (state) => state.deleteTask,
  );

  const historyGroups =
    screen === 'history'
      ? groupHistoryTasks(visibleTasks)
      : [];

  const setPriorityFilter = useTaskStore(
    (state) => state.setPriorityFilter,
  );

  const setReverseOrder = useTaskStore(
    (state) => state.setReverseOrder,
  );

  const hasActiveFilter =
    priorityFilter !== 'all' ||
    reverseOrder;

  const emptyState = getEmptyState(screen);

  useEffect(() => {
    const initialize =
      async () => {
        try {
          await configureNotifications();

          const tasks =
            useTaskStore
              .getState()
              .tasks;

          await reconcileTaskNotifications(
            tasks,
          );
        } catch (error) {
          console.warn(
            'Notification initialization failed:',
            error,
          );
        }
      };

    initialize();
  }, []);

  const renderScreenIcon = () => {
    if (screen === 'agenda') {
      return (
        <CalendarDays
          size={22}
          color={colors.text}
        />
      );
    }

    if (screen === 'today') {
      return (
        <Clock3
          size={22}
          color={colors.text}
        />
      );
    }

    return (
      <History
        size={22}
        color={colors.text}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View
        style={[
          styles.topArea,
          {
            paddingTop: insets.top,
          },
        ]}
      >
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          {renderScreenIcon()}

          <Text style={styles.title}>
            {screen}
          </Text>
        </View>

        <View style={styles.topActions}>
          <View style={styles.typeFilter}>
            <Pressable
              style={[
                styles.typeOption,
                typeFilter === 'task' &&
                  styles.typeOptionActive,
              ]}
              onPress={() =>
                setTypeFilter(
                  typeFilter === 'task'
                    ? 'all'
                    : 'task',
                )
              }
            >
              <Text
                style={[
                  styles.typeOptionText,
                  typeFilter === 'task' &&
                    styles.typeOptionTextActive,
                ]}
              >
                Tasks
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeOption,
                typeFilter === 'plan' &&
                  styles.typeOptionActive,
              ]}
              onPress={() =>
                setTypeFilter(
                  typeFilter === 'plan'
                    ? 'all'
                    : 'plan',
                )
              }
            >
              <Text
                style={[
                  styles.typeOptionText,
                  typeFilter === 'plan' &&
                    styles.typeOptionTextActive,
                ]}
              >
                Plans
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.iconButton}
            onPress={() =>
              setSearchOpen(!searchOpen)
            }
          >
            <Search
              size={20}
              color={colors.text}
            />
          </Pressable>

          <Pressable
            style={[
              styles.iconButton,
              hasActiveFilter &&
                styles.iconButtonActive,
            ]}
            onPress={() =>
              setFilterModalVisible(true)
            }
          >
            <ListFilter
              size={20}
              color={
                hasActiveFilter
                  ? colors.accent
                  : colors.text
              }
            />
          </Pressable>
        </View>
      </View>
      </View>

      {/* SEARCH */}
      {searchOpen && (
        <View 
        style={[
          styles.searchOverlay,
          {
            top: insets.top,
          },
        ]}>
          <Search
            size={20}
            color={colors.secondary}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              screen === 'history'
                ? 'Search completed...'
                : screen === 'today'
                  ? 'Search today...'
                  : 'Search ongoing...'
            }
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />

          <Pressable
            onPress={() => {
              setSearchQuery('');
              setSearchOpen(false);
            }}
            hitSlop={8}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      )}

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {screen === 'agenda'
                ? 'Ongoing'
                : screen === 'today'
                  ? 'Today'
                  : 'Completed'}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {visibleTasks.length}{' '}
              {visibleTasks.length === 1
                ? 'item'
                : 'items'}
            </Text>
          </View>

          {hasActiveFilter && (
            <View style={styles.filteredBadge}>
              <Text style={styles.filteredBadgeText}>
                Filtered
              </Text>
            </View>
          )}
        </View>

        {visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              {screen === 'agenda' && (
                <CalendarDays
                  size={24}
                  color={colors.accent}
                />
              )}

              {screen === 'today' && (
                <Clock3
                  size={24}
                  color={colors.accent}
                />
              )}

              {screen === 'history' && (
                <History
                  size={24}
                  color={colors.accent}
                />
              )}
            </View>

            <Text style={styles.emptyTitle}>
              {emptyState.title}
            </Text>

            <Text style={styles.emptyText}>
              {emptyState.description}
            </Text>
          </View>
        ) : screen === 'history' ? (
          <View style={styles.historyList}>
            {historyGroups.map((group) => (
              <View
                key={group.key}
                style={styles.historyGroup}
              >
                <Text style={styles.dateHeader}>
                  {group.label}
                </Text>

                <View style={styles.taskList}>
                  {group.tasks.map((task) => (
                    <SwipeableTaskCard
                      key={task.id}
                      task={task}
                      now={now}
                      onPress={() =>
                        setSelectedTaskId(task.id)
                      }
                      onComplete={() =>
                        completeTask(task.id)
                      }
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.taskList}>
            {visibleTasks.map((task) => (
              <SwipeableTaskCard
                key={task.id}
                task={task}
                now={now}
                onPress={() =>
                  setSelectedTaskId(task.id)
                }
                onComplete={() =>
                  completeTask(task.id)
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      {screen !== 'history' && (
        <Pressable
          style={[styles.addButton,
            {
              bottom:
                layout.bottomBarHeight +
                insets.bottom +
                12,
            }
          ]}
          onPress={() => setAddModalVisible(true)}
        >
          <Plus
            size={28}
            color={colors.background}
          />
        </Pressable>
      )}

      {/* BOTTOM BAR */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom,
            height:
              layout.bottomBarHeight +
              insets.bottom,
          },
        ]}
      >
        {screens.map((item) => {
          const active = item.id === screen;

          return (
            <Pressable
              key={item.id}
              style={styles.bottomItem}
              onPress={() => {
                setScreen(item.id);
              }}
            >
              <Text
                style={[
                  styles.bottomText,
                  active &&
                    styles.bottomTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FilterModal
        visible={filterModalVisible}
        priorityFilter={priorityFilter}
        reverseOrder={reverseOrder}
        onPriorityChange={setPriorityFilter}
        onReverseChange={setReverseOrder}
        onReset={() => {
          setPriorityFilter('all');
          setReverseOrder(false);
        }}
        onClose={() =>
          setFilterModalVisible(false)
        }
      />
      <AddTaskModal
        visible={addModalVisible}
        onClose={() =>
          setAddModalVisible(false)
        }
        onAdd={async (data) => {
          await addTask(data);
          setAddModalVisible(false);
        }}
      />
      <TaskModal
        task={selectedTask}
        visible={selectedTask !== null}
        onClose={() =>
          setSelectedTaskId(null)
        }
        onComplete={async () => {
          if (!selectedTask) {
            return;
          }

          await completeTask(
            selectedTask.id,
          );

          setSelectedTaskId(null);
        }}
        onReopen={async () => {
          if (!selectedTask) {
            return;
          }

          await reopenTask(
            selectedTask.id,
          );

          setSelectedTaskId(null);
        }}
        onSave={async (data) => {
          if (!selectedTask) {
            return;
          }

          await updateTask(
            selectedTask.id,
            data,
          );
        }}
        onDelete={async () => {
          if (!selectedTask) {
            return;
          }

          await deleteTask(selectedTask.id);
          setSelectedTaskId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topArea: {
    position: 'relative',
    backgroundColor: colors.surface,
  },

  topBar: {
    height: 64,
    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  typeButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 8,

    backgroundColor: colors.elevated,
  },

  typeButtonActive: {
    backgroundColor: colors.accent,
  },

  typeButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },

  typeButtonTextActive: {
    color: colors.background,
  },

  iconButton: {
    width: 36,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',
  },

  searchOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    zIndex: 20,

    height: 64,

    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,

    backgroundColor: colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  searchInput: {
    flex: 1,

    color: colors.text,

    fontSize: 16,
  },

  cancelText: {
    color: colors.accent,

    fontSize: 14,
    fontWeight: '600',
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 20,

    paddingBottom:
      130,
  },

  taskList: {
    gap: 14,
  },

  emptyState: {
    paddingVertical: 90,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 52,
    height: 52,

    marginBottom: 16,

    borderRadius: 26,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(143, 184, 255, 0.1)',
  },

  emptyTitle: {
    color: colors.text,

    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    maxWidth: 280,
    marginTop: 7,

    color: colors.secondary,

    fontSize: 14,
    lineHeight: 20,

    textAlign: 'center',
  },

  addButton: {
    position: 'absolute',

    right: 20,
    bottom: 80,

    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: colors.accent,

    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBar: {
    height: 68,

    flexDirection: 'row',

    backgroundColor: colors.surface,

    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  bottomItem: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomText: {
    color: colors.muted,

    fontSize: 13,
  },

  bottomTextActive: {
    color: colors.text,
    fontWeight: '700',
  },

  historyList: {
    gap: 28,
  },

  historyGroup: {
    gap: 12,
  },

  dateHeader: {
    color: colors.secondary,

    fontSize: 13,
    fontWeight: '700',

    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  iconButtonActive: {
    backgroundColor:
      'rgba(143, 184, 255, 0.1)',
    borderRadius: 10,
  },

  typeFilter: {
    flexDirection: 'row',

    padding: 3,

    borderRadius: 10,

    backgroundColor: colors.elevated,
  },

  typeOption: {
    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 8,
  },

  typeOptionActive: {
    backgroundColor: colors.accent,
  },

  typeOptionText: {
    color: colors.secondary,

    fontSize: 11,
    fontWeight: '700',
  },

  typeOptionTextActive: {
    color: colors.background,
  },

  sectionHeader: {
    marginBottom: 18,

    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 24,
    fontWeight: '800',
  },

  sectionSubtitle: {
    marginTop: 4,

    color: colors.muted,

    fontSize: 13,
  },

  filteredBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 7,

    backgroundColor:
      'rgba(143, 184, 255, 0.1)',
  },

  filteredBadgeText: {
    color: colors.accent,

    fontSize: 10,
    fontWeight: '700',
  },
});