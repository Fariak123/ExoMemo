import React, { useRef } from 'react';

import {
    Check,
    Trash2,
} from 'lucide-react-native';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import type {
    SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors } from '../constants/theme';
import type { Task } from '../types/task';

import { TaskCard } from './TaskCard';

interface SwipeableTaskCardProps {
  task: Task;
  now: Date;

  onPress: () => void;
  onComplete: () => void;
}

export function SwipeableTaskCard({
  task,
  now,
  onPress,
  onComplete,
}: SwipeableTaskCardProps) {
  const swipeableRef =
    useRef<SwipeableMethods>(null);

  const handleOpen = (
    direction: 'left' | 'right',
  ) => {
    swipeableRef.current?.close();

    if (direction === 'right') {
      if (!task.completed) {
        onComplete();
      }

      return;
    }

    if (direction === 'left') {
      // Open the normal task details modal.
      // The existing delete confirmation remains there.
      onPress();
    }
  };

  return (
    <View style={styles.wrapper}>
      <Swipeable
        ref={swipeableRef}

        friction={1.5}

        leftThreshold={55}
        rightThreshold={55}

        // dragOffsetFromLeft={15}
        // dragOffsetFromRight={-15}
        dragOffsetFromLeftEdge={15}
        dragOffsetFromRightEdge={15}

        overshootLeft={false}
        overshootRight={false}

        overshootFriction={8}

        renderLeftActions={() => {
          if (task.completed) {
            return null;
          }

          return (
            <View
              style={[
                styles.action,
                styles.completeAction,
              ]}
            >
              <Check
                size={22}
                color={colors.background}
              />

              <Text
                style={
                  styles.completeText
                }
              >
                Complete
              </Text>
            </View>
          );
        }}

        renderRightActions={() => (
          <View
            style={[
              styles.action,
              styles.deleteAction,
            ]}
          >
            <Trash2
              size={22}
              color={colors.text}
            />

            <Text
              style={
                styles.deleteText
              }
            >
              Delete
            </Text>
          </View>
        )}

        onSwipeableOpen={
          handleOpen
        }
      >
        <TaskCard
          task={task}
          now={now}
          onPress={onPress}
          onComplete={onComplete}
        />
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  action: {
    width: 105,

    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  completeAction: {
    backgroundColor: colors.green,
  },

  deleteAction: {
    backgroundColor: colors.red,
  },

  completeText: {
    color: colors.background,

    fontSize: 12,
    fontWeight: '800',
  },

  deleteText: {
    color: colors.text,

    fontSize: 12,
    fontWeight: '800',
  },
});