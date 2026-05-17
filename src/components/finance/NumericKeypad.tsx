import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';
import { FINANCE_BLUE } from '../../finance/constants';

interface NumericKeypadProps {
  onKey: (key: string) => void;
  onDelete: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'del'],
];

export function NumericKeypad({ onKey, onDelete, onSave, saveDisabled }: NumericKeypadProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((key) => {
              if (key === 'del') {
                return (
                  <TouchableOpacity key={key} style={styles.key} onPress={onDelete}>
                    <Text style={styles.keyText}>⌫</Text>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity key={key} style={styles.key} onPress={() => onKey(key)}>
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.save, saveDisabled && styles.saveDisabled]}
        onPress={onSave}
        disabled={saveDisabled}
      >
        <Text style={styles.saveText}>保存</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 8, gap: 6 },
  grid: { flex: 1 },
  row: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  key: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyText: { fontSize: 22, fontWeight: '500', color: COLORS.text },
  save: {
    width: 72,
    backgroundColor: FINANCE_BLUE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  saveDisabled: { opacity: 0.45 },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
