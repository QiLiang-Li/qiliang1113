import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants';
import { FINANCE_BLUE, FINANCE_BLUE_LIGHT } from '../../finance/constants';

interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  options: readonly string[];
  value: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export function OptionPickerModal({
  visible,
  title,
  options,
  value,
  onClose,
  onConfirm,
}: OptionPickerModalProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="可手动输入"
            placeholderTextColor={COLORS.textSecondary}
          />
          <Text style={styles.sub}>常用推荐</Text>
          <View style={styles.grid}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, draft === opt && styles.chipActive]}
                onPress={() => setDraft(opt)}
              >
                <Text style={[styles.chipText, draft === opt && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnCancel}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => onConfirm(draft.trim() || options[options.length - 1])}
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
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontSize: 16,
    paddingVertical: 8,
    color: COLORS.text,
    marginBottom: 16,
  },
  sub: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F2',
    marginBottom: 4,
  },
  chipActive: { backgroundColor: FINANCE_BLUE_LIGHT },
  chipText: { fontSize: 14, color: COLORS.text },
  chipTextActive: { color: FINANCE_BLUE, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
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
