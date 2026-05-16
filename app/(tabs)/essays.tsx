import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/EmptyState';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { COLORS } from '../../src/constants';
import { useApp } from '../../src/context/AppContext';
import { Essay } from '../../src/types';

function EssayItem({
  essay,
  onPress,
  onLongPress,
}: {
  essay: Essay;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const preview = essay.content.trim().replace(/\n/g, ' ').slice(0, 80);
  const date = new Date(essay.updatedAt).toLocaleDateString('zh-CN');

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.itemTitle}>{essay.title}</Text>
      <Text style={styles.itemPreview} numberOfLines={2}>
        {preview || '（空内容）'}
      </Text>
      <Text style={styles.itemDate}>{date}</Text>
    </TouchableOpacity>
  );
}

export default function EssaysScreen() {
  const router = useRouter();
  const { ready, essays, deleteEssay } = useApp();

  const openNew = () => {
    router.push({ pathname: '/essay-editor', params: { mode: 'new' } });
  };

  const openEdit = (essay: Essay) => {
    router.push({
      pathname: '/essay-editor',
      params: { mode: 'edit', id: essay.id },
    });
  };

  const confirmDelete = (essay: Essay) => {
    Alert.alert('删除感言', `确定删除「${essay.title}」吗？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteEssay(essay.id) },
    ]);
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
      <View style={styles.headerRow}>
        <ScreenHeader title="长文感言" subtitle="记录更长的心情与思考" />
        <TouchableOpacity style={styles.addBtn} onPress={openNew}>
          <Text style={styles.addBtnText}>+ 新建</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={essays}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState text="还没有感言，点击右上角新建一篇" />}
        renderItem={({ item }) => (
          <EssayItem
            essay={item}
            onPress={() => openEdit(item)}
            onLongPress={() => confirmDelete(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  addBtn: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  itemPreview: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  itemDate: { marginTop: 10, fontSize: 12, color: COLORS.textSecondary },
});
