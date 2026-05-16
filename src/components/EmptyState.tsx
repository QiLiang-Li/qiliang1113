import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
