import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { COLORS, formatDate } from '../../src/constants';
import { useApp } from '../../src/context/AppContext';

export default function DiaryScreen() {
  const { ready, diaryDates, getDiary, saveDiary } = useApp();
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    const diary = getDiary(selectedDate);
    setContent(diary?.content ?? '');
    setSavedHint(false);
  }, [selectedDate, getDiary]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = {};
    diaryDates.forEach((date) => {
      marks[date] = { marked: true, dotColor: COLORS.accent };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: COLORS.accent,
    };
    return marks;
  }, [diaryDates, selectedDate]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveDiary(selectedDate, content);
    setSaving(false);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 1500);
  };

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="每日日记" subtitle="点选日历上的日期，记录那一天的心情" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: COLORS.card,
                calendarBackground: COLORS.card,
                textSectionTitleColor: COLORS.textSecondary,
                selectedDayBackgroundColor: COLORS.accent,
                todayTextColor: COLORS.accent,
                dayTextColor: COLORS.text,
                arrowColor: COLORS.accent,
                monthTextColor: COLORS.text,
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
              }}
              enableSwipeMonths
            />
          </View>

          <View style={styles.editorCard}>
            <Text style={styles.dateLabel}>{selectedDate}</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="写下这一天的日记..."
              placeholderTextColor={COLORS.textSecondary}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? '保存中...' : savedHint ? '已保存 ✓' : '保存日记'}
              </Text>
            </TouchableOpacity>
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
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 280,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    minHeight: 180,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
