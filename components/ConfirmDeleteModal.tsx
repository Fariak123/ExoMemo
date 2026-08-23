import React from 'react';

import {
    AlertTriangle,
    X,
} from 'lucide-react-native';

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors } from '../constants/theme';

interface ConfirmDeleteModalProps {
  visible: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  visible,
  taskTitle,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <AlertTriangle
              size={24}
              color={colors.red}
            />
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onCancel}
            hitSlop={8}
          >
            <X
              size={18}
              color={colors.secondary}
            />
          </Pressable>

          <Text style={styles.title}>
            Delete task?
          </Text>

          <Text
            style={styles.message}
            numberOfLines={3}
          >
            "{taskTitle}" will be permanently
            deleted.
          </Text>

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,

    backgroundColor:
      'rgba(0, 0, 0, 0.72)',
  },

  modal: {
    width: '100%',
    maxWidth: 380,

    padding: 22,

    borderRadius: 20,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    position: 'relative',
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(240, 107, 107, 0.1)',
  },

  closeButton: {
    position: 'absolute',

    top: 16,
    right: 16,

    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.elevated,
  },

  title: {
    marginTop: 18,

    color: colors.text,

    fontSize: 21,
    fontWeight: '800',
  },

  message: {
    marginTop: 8,

    color: colors.secondary,

    fontSize: 14,
    lineHeight: 20,
  },

  actions: {
    marginTop: 24,

    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,

    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: colors.elevated,
  },

  cancelText: {
    color: colors.secondary,

    fontSize: 14,
    fontWeight: '700',
  },

  deleteButton: {
    flex: 1,

    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor:
      'rgba(240, 107, 107, 0.14)',
  },

  deleteText: {
    color: colors.red,

    fontSize: 14,
    fontWeight: '800',
  },
});