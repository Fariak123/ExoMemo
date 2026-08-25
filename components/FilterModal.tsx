import {
  Check,
  RotateCcw,
  X,
} from 'lucide-react-native';

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/constants/theme';
import type { Priority } from '../types/task';

interface FilterModalProps {
  visible: boolean;
  priorityFilter: Priority | 'all';
  reverseOrder: boolean;

  onPriorityChange: (
    value: Priority | 'all',
  ) => void;

  onReverseChange: (
    value: boolean,
  ) => void;

  onReset: () => void;
  onClose: () => void;
}

export function FilterModal({
  visible,
  priorityFilter,
  reverseOrder,
  onPriorityChange,
  onReverseChange,
  onReset,
  onClose,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Filter
            </Text>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={10}
            >
              <X
                size={20}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          {/* PRIORITY */}
          <Text style={styles.sectionTitle}>
            Priority
          </Text>

          <View style={styles.options}>
            <FilterOption
              label="All"
              active={
                priorityFilter === 'all'
              }
              onPress={() =>
                onPriorityChange('all')
              }
            />

            <FilterOption
              label="Low"
              active={
                priorityFilter === 'low'
              }
              color={colors.accent}
              onPress={() =>
                onPriorityChange('low')
              }
            />

            <FilterOption
              label="Medium"
              active={
                priorityFilter === 'medium'
              }
              color={colors.yellow}
              onPress={() =>
                onPriorityChange('medium')
              }
            />

            <FilterOption
              label="High"
              active={
                priorityFilter === 'high'
              }
              color={colors.red}
              onPress={() =>
                onPriorityChange('high')
              }
            />
          </View>

          {/* ORDER */}
          <Text style={styles.sectionTitle}>
            Order
          </Text>

          <View style={styles.options}>
            <FilterOption
              label="Default"
              active={!reverseOrder}
              onPress={() =>
                onReverseChange(false)
              }
            />

            <FilterOption
              label="Reverse"
              active={reverseOrder}
              icon={<RotateCcw
                size={16}
                color={
                  reverseOrder
                    ? colors.background
                    : colors.secondary
                }
              />}
              onPress={() =>
                onReverseChange(true)
              }
            />
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Pressable
              style={styles.resetButton}
              onPress={onReset}
            >
              <Text style={styles.resetText}>
                Reset
              </Text>
            </Pressable>

            <Pressable
              style={styles.applyButton}
              onPress={onClose}
            >
              <Text style={styles.applyText}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface FilterOptionProps {
  label: string;
  active: boolean;
  color?: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

function FilterOption({
  label,
  active,
  color = colors.accent,
  icon,
  onPress,
}: FilterOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        active && {
          backgroundColor:
            color === colors.red
              ? 'rgba(240, 107, 107, 0.12)'
              : color === colors.yellow
                ? 'rgba(230, 199, 106, 0.12)'
                : 'rgba(143, 184, 255, 0.12)',
          borderColor: color,
        },
      ]}
    >
      {active ? (
        <Check
          size={16}
          color={color}
        />
      ) : (
        icon
      )}

      <Text
        style={[
          styles.optionText,
          active && {
            color,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0, 0, 0, 0.7)',
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: colors.text,
    fontSize: 22,
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

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,

    color: colors.secondary,

    fontSize: 12,
    fontWeight: '700',

    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  options: {
    gap: 8,
  },

  option: {
    minHeight: 48,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 9,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  optionText: {
    color: colors.secondary,

    fontSize: 14,
    fontWeight: '600',
  },

  actions: {
    marginTop: 28,

    flexDirection: 'row',
    gap: 10,
  },

  resetButton: {
    flex: 1,

    height: 50,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 13,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  resetText: {
    color: colors.secondary,

    fontSize: 14,
    fontWeight: '700',
  },

  applyButton: {
    flex: 1,

    height: 50,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 13,

    backgroundColor: colors.accent,
  },

  applyText: {
    color: colors.background,

    fontSize: 14,
    fontWeight: '800',
  },
});