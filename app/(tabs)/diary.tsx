import { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiaryCalendar } from '../../src/components/DiaryCalendar';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { COLORS, formatDate } from '../../src/constants';
import { useApp } from '../../src/context/AppContext';

export default function DiaryScreen() {
  const { ready, diaryDates, getDiary, saveDiary } = useApp();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    setText(getDiary(selectedDate)?.content ?? '');
    setSaveStatus('');
  }, [selectedDate, getDiary]);

  const onSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const onChangeText = (value: string) => {
    setText(value);
    setSaveStatus('自动保存中…');
    void saveDiary(selectedDate, value).then(() => {
      setSaveStatus('已自动保存');
    });
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await saveDiary(selectedDate, text);
      setSaveStatus('已保存');
    } finally {
      setSaving(false);
    }
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
            <View style={styles.editorHeader}>
              <Text style={styles.dateLabel}>{displayDate}</Text>
              <Text style={styles.saveStatus}>{saveStatus}</Text>
            </View>
            <TextInput
              style={styles.input}
              multiline
              placeholder="记录今天的心情与事情…"
              placeholderTextColor={COLORS.textSecondary}
              value={text}
              onChangeText={onChangeText}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleManualSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>{saving ? '保存中' : '保存'}</Text>
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
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
  },
  saveStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    minHeight: 160,
    paddingBottom: 44,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
