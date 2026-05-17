import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DiaryCalendar } from '../DiaryCalendar';
import { COLORS } from '../../constants';
import { FINANCE_BLUE, FINANCE_BLUE_LIGHT } from '../../finance/constants';

interface DayPickerModalProps {
  visible: boolean;
  selectedDate: string;
  markedDates: Set<string>;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export function DayPickerModal({
  visible,
  selectedDate,
  markedDates,
  onClose,
  onConfirm,
}: DayPickerModalProps) {
  const [draft, setDraft] = useState(selectedDate);

  useEffect(() => {
    if (visible) setDraft(selectedDate);
  }, [visible, selectedDate]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>选择日期</Text>
          <DiaryCalendar selectedDate={draft} onSelectDate={setDraft} markedDates={markedDates} />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnCancel}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => onConfirm(draft)}
            >
              <Text style={styles.btnOk}>确定</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#F0F0F2',
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: FINANCE_BLUE_LIGHT },
  btnCancel: { fontSize: 16, color: FINANCE_BLUE, fontWeight: '600' },
  btnOk: { fontSize: 16, color: FINANCE_BLUE, fontWeight: '700' },
});
