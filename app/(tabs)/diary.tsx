import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiaryCalendar } from '../../src/components/DiaryCalendar';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { COLORS, formatDate } from '../../src/constants';
import { useApp } from '../../src/context/AppContext';

export default function DiaryScreen() {
  const { ready, diaryDates, getDiary, saveDiary } = useApp();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [text, setText] = useState('');

  useEffect(() => {
    setText(getDiary(selectedDate)?.content ?? '');
  }, [selectedDate, getDiary]);

  const onSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const onChangeText = (value: string) => {
    setText(value);
    void saveDiary(selectedDate, value);
  };

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const displayDate = selectedDate.replace(/-/g, '/');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="日记" subtitle="点击年月可展开月份与年份选择" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <DiaryCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            markedDates={diaryDates}
          />
          <View style={styles.editor}>
            <Text style={styles.dateLabel}>{displayDate}</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="记录今天的心情与事情…"
              placeholderTextColor={COLORS.textSecondary}
              value={text}
              onChangeText={onChangeText}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  editor: {
    margin: 16,
    marginTop: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 200,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    minHeight: 160,
  },
});
