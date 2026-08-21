import {
  CalendarDays,
  Clock3,
  History,
  ListFilter,
  Plus,
  Search,
} from 'lucide-react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { useTaskStore } from '../store/taskStore';
import type { Screen } from '../types/task';
import { getVisibleTasks } from '../utils/taskFilters';

const BOTTOM_BAR_HEIGHT = 68;
const FAB_SIZE = 56;
const FAB_BOTTOM_OFFSET = 24;

const colors = {
  background: '#0F1115',
  surface: '#171A21',
  elevated: '#1E222B',
  border: '#292E38',

  text: '#F5F7FA',
  secondary: '#9AA2B1',
  muted: '#687080',

  accent: '#8FB8FF',
};

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

export default function HomeScreen() {
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

  const reopenTask = useTaskStore(
    (state) => state.reopenTask,
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

  const visibleTasks = getVisibleTasks({
    tasks,
    screen,
    typeFilter,
    searchQuery,
    priorityFilter,
    reverseOrder,
  });

  const reset = useTaskStore(
    (state) => state.resetTasks,
  )

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
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          {renderScreenIcon()}

          <Text style={styles.title}>
            {screen}
          </Text>
        </View>

        <View style={styles.topActions}>
          <Pressable
            style={[
              styles.typeButton,
              typeFilter === 'task' &&
                styles.typeButtonActive,
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
                styles.typeButtonText,
                typeFilter === 'task' &&
                  styles.typeButtonTextActive,
              ]}
            >
              Tasks
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeButton,
              typeFilter === 'plan' &&
                styles.typeButtonActive,
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
                styles.typeButtonText,
                typeFilter === 'plan' &&
                  styles.typeButtonTextActive,
              ]}
            >
              Plans
            </Text>
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() =>
              setSearchOpen(true)
            }
          >
            <Search
              size={20}
              color={colors.text}
            />
          </Pressable>

          <Pressable style={styles.iconButton}>
            <ListFilter
              size={20}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>

      {/* SEARCH */}
      {searchOpen && (
        <View style={styles.searchBar}>
          <Search
            size={20}
            color={colors.secondary}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoFocus
          />

          <Pressable
            onPress={() => {
              setSearchQuery('');
              setSearchOpen(false);
            }}
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
                  : 'History'}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {visibleTasks.length}{' '}
              {visibleTasks.length === 1
                ? 'item'
                : 'items'}
            </Text>
          </View>
        </View>

        {visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              Nothing here yet
            </Text>

            <Text style={styles.emptyText}>
              {screen === 'agenda'
                ? 'Add a task or plan to get started.'
                : screen === 'today'
                  ? 'You have nothing scheduled for today.'
                  : 'Completed tasks will appear here.'}
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
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
              bottom: BOTTOM_BAR_HEIGHT + FAB_SIZE / 2 + FAB_BOTTOM_OFFSET
            }
          ]}
          onPress={() => {
            // Add Task modal comes next.
            reset()
          }}
        >
          <Plus
            size={28}
            color={colors.background}
          />
        </Pressable>
      )}

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        {screens.map((item) => {
          const active =
            item.id === screen;

          return (
            <Pressable
              key={item.id}
              style={styles.bottomItem}
              onPress={() =>
                setScreen(item.id)
              }
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
      <TaskModal
        task={selectedTask}
        visible={selectedTask !== null}
        onClose={() =>
          setSelectedTaskId(null)
        }
        onComplete={() => {
          if (!selectedTask) {
            return;
          }

          completeTask(selectedTask.id);
          setSelectedTaskId(null);
        }}
        onReopen={() => {
          if (!selectedTask) {
            return;
          }

          reopenTask(selectedTask.id);
          setSelectedTaskId(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

  searchBar: {
    height: 56,
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
    padding: 20,
    paddingBottom: 110,
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 20,
    fontWeight: '700',
  },

  sectionSubtitle: {
    marginTop: 4,

    color: colors.muted,

    fontSize: 13,
  },

  taskList: {
    gap: 12,
  },

  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },

  emptyTitle: {
    color: colors.text,

    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    maxWidth: 280,
    marginTop: 8,

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
});