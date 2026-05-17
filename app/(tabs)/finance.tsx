import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { DayPickerModal } from '../../src/components/finance/DayPickerModal';
import {
  COLORS,
  formatDate,
  formatMoney,
  isSameMonth,
  sumByType,
} from '../../src/constants';
import { useApp } from '../../src/context/AppContext';
import {
  FINANCE_BLUE,
  formatDayHeader,
  formatMonthLabel,
  getExpenseCategoryMeta,
  getIncomeCategoryMeta,
} from '../../src/finance/constants';
import { Transaction } from '../../src/types';

function TransactionItem({
  item,
  onLongPress,
}: {
  item: Transaction;
  onLongPress: () => void;
}) {
  const isIncome = item.type === 'income';
  const meta = isIncome
    ? getIncomeCategoryMeta(item.incomeCategory)
    : getExpenseCategoryMeta(item.category);
  const timeStr = item.time || new Date(item.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const detail = [timeStr, item.note || item.app || item.channel].filter(Boolean).join(' | ');

  return (
    <TouchableOpacity style={styles.txItem} onLongPress={onLongPress} activeOpacity={0.7}>
      <View style={[styles.txIcon, { backgroundColor: meta.color }]}>
        <Text style={styles.txIconText}>{meta.icon}</Text>
      </View>
      <View style={styles.txBody}>
        <View style={styles.txTitleRow}>
          <Text style={styles.txCategory}>{meta.label}</Text>
        </View>
        <Text style={styles.txDetail} numberOfLines={1}>
          {detail || item.channel}
        </Text>
      </View>
      <Text style={styles.txAmount}>
        {isIncome ? '' : '-'}
        {formatMoney(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

export default function FinanceScreen() {
  const router = useRouter();
  const { ready, transactions, deleteTransaction } = useApp();
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const viewYear = Number(selectedDate.split('-')[0]);
  const viewMonth = Number(selectedDate.split('-')[1]);

  const monthTx = useMemo(
    () => transactions.filter((t) => isSameMonth(t.date, viewYear, viewMonth)),
    [transactions, viewYear, viewMonth]
  );

  const monthExpense = sumByType(monthTx, 'expense');
  const monthIncome = sumByType(monthTx, 'income');

  const dayTx = useMemo(() => {
    return transactions
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => {
        const ta = a.time || '00:00';
        const tb = b.time || '00:00';
        if (ta !== tb) return tb.localeCompare(ta);
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [transactions, selectedDate]);

  const dayExpense = sumByType(dayTx, 'expense');
  const dayIncome = sumByType(dayTx, 'income');

  const txDates = useMemo(
    () => new Set(transactions.map((t) => t.date)),
    [transactions]
  );

  const confirmDelete = (item: Transaction) => {
    Alert.alert('删除记录', '确定删除这条记账吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteTransaction(item.id) },
    ]);
  };

  const mask = (v: string) => (hideAmounts ? '****' : v);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={FINANCE_BLUE} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setCalendarOpen(true)}>
            <Text style={styles.dateBtnText}>{formatMonthLabel(viewYear, viewMonth)}</Text>
            <Text style={styles.dateArrow}> ▾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHideAmounts((v) => !v)} hitSlop={12}>
            <Text style={styles.eye}>{hideAmounts ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>本月支出</Text>
            <Text style={styles.summaryAmount}>¥{mask(formatMoney(monthExpense))}</Text>
          </View>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>本月收入</Text>
            <Text style={styles.summaryAmount}>¥{mask(formatMoney(monthIncome))}</Text>
          </View>
        </View>
      </View>

      <View style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{formatDayHeader(selectedDate, today)}</Text>
          <Text style={styles.dayTotals}>
            支 {mask(formatMoney(dayExpense))}  收 {mask(formatMoney(dayIncome))}
          </Text>
        </View>
        <FlatList
          data={dayTx}
          keyExtractor={(item) => item.id}
          scrollEnabled={dayTx.length > 4}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyDay}>这一天还没有记账</Text>
          }
          renderItem={({ item }) => (
            <TransactionItem item={item} onLongPress={() => confirmDelete(item)} />
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() =>
          router.push({ pathname: '/record-transaction', params: { date: selectedDate } })
        }
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <DayPickerModal
        visible={calendarOpen}
        selectedDate={selectedDate}
        markedDates={txDates}
        onClose={() => setCalendarOpen(false)}
        onConfirm={(d) => {
          setSelectedDate(d);
          setCalendarOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBtn: { flexDirection: 'row', alignItems: 'center' },
  dateBtnText: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  dateArrow: { fontSize: 14, color: COLORS.textSecondary },
  eye: { fontSize: 20 },
  summaryRow: { flexDirection: 'row' },
  summaryCol: { flex: 1 },
  summaryLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  summaryAmount: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  dayCard: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  dayTotals: { fontSize: 13, color: COLORS.textSecondary },
  list: { flex: 1 },
  emptyDay: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: 40,
    fontSize: 14,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txIconText: { fontSize: 22 },
  txBody: { flex: 1, marginRight: 8 },
  txTitleRow: { flexDirection: 'row', alignItems: 'center' },
  txCategory: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  txDetail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  txAmount: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: FINANCE_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: FINANCE_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabIcon: { fontSize: 32, color: '#fff', lineHeight: 34, fontWeight: '300' },
});
