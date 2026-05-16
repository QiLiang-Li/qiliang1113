import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants';
import { useApp } from '../src/context/AppContext';

export default function EssayEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    id?: string;
    title?: string;
    content?: string;
  }>();
  const { saveEssay, essays } = useApp();
  const isEdit = params.mode === 'edit' && params.id;
  const existing = isEdit ? essays.find((e) => e.id === String(params.id)) : undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
    }
  }, [existing]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await saveEssay({
      id: isEdit ? String(params.id) : undefined,
      title: title.trim() || '无标题感言',
      content: content.trim(),
    });
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>{isEdit ? '编辑感言' : '新建感言'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving || !content.trim()}>
          <Text style={[styles.save, (!content.trim() || saving) && styles.saveDisabled]}>
            保存
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <TextInput
            style={styles.titleInput}
            placeholder="标题（可选）"
            placeholderTextColor={COLORS.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="在这里写下你的长文感言..."
            placeholderTextColor={COLORS.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  cancel: { fontSize: 16, color: COLORS.textSecondary },
  toolbarTitle: { fontSize: 17, fontWeight: '600', color: COLORS.text },
  save: { fontSize: 16, fontWeight: '600', color: COLORS.accent },
  saveDisabled: { opacity: 0.4 },
  body: { flex: 1, padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    paddingVertical: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
  },
});
