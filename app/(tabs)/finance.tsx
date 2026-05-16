import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/EmptyState';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import {
  COLORS,
  EXPENSE_CATEGORIES,
  formatDate,
  formatMoney,
  getCategoryMeta,
} from '../../src/constants';
import { useApp } from '../../src/context/AppContext';
import { ExpenseCategory, Transaction, TransactionType } from '../../src/types';

function SummaryCard({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>收入</Text>
        <Text style={[styles.summaryValue, { color: COLORS.income }]}>+¥{formatMoney(income)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>支出</Text>
        <Text style={[styles.summaryValue, { color: COLORS.expense }]}>-¥{formatMoney(expense)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>结余</Text>
        <Text style={[styles.summaryValue, { color: balance >= 0 ? COLORS.income : COLORS.expense }]}>
          ¥{formatMoney(balance)}
        </Text>
      </View>
    </View>
  );
}

function TransactionRow({
  item,
  onDelete,
}: {
  item: Transaction;
  onDelete: () => void;
}) {
  const isIncome = item.type === 'income';
  const category = isIncome ? null : getCategoryMeta(item.category);

  return (
    <TouchableOpacity style={styles.txRow} onLongPress={onDelete}>
      <View style={styles.txLeft}>
        <View
          style={[
            styles.txDot,
            { backgroundColor: isIncome ? COLORS.income : category?.color ?? COLORS.expense },
          ]}
        />
        <View style={styles.txInfo}>
          <Text style={styles.txNote}>{item.note || (isIncome ? '收入' : category?.label)}</Text>
          <Text style={styles.txMeta}>
            {item.date}
            {!isIncome && category ? ` · ${category.label}` : ''}
          </Text>
        </View>
      </View>
      <Text style={[styles.txAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
        {isIncome ? '+' : '-'}¥{formatMoney(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

export default function FinanceScreen() {
  const { ready, transactions, addTransaction, deleteTransaction } = useApp();
  const today = formatDate(new Date());

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('living');
  const [date, setDate] = useState(today);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filterDate
      ? transactions.filter((t) => t.date === filterDate)
      : transactions;
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [transactions, filterDate]);

  const { income, expense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filtered.forEach((t) => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { income: inc, expense: exp, balance: inc - exp };
  }, [filtered]);

  const handleAdd = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }
    await addTransaction({
      type,
      amount: value,
      category: type === 'expense' ? category : 'other',
      note,
      date,
    });
    setAmount('');
    setNote('');
  };

  const confirmDelete = (item: Transaction) => {
    Alert.alert('删除记录', '确定删除这条记账吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteTransaction(item.id) },
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
      <ScreenHeader title="每日记账" subtitle="收入与支出分色显示，长按可删除" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <SummaryCard income={income} expense={expense} balance={balance} />

            <View style={styles.formCard}>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeBtn, type === 'income' && styles.typeBtnIncome]}
                  onPress={() => setType('income')}
                >
                  <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
                    收入
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpense]}
                  onPress={() => setType('expense')}
                >
                  <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
                    支出
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.amountInput}
                placeholder="金额"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />

              <TextInput
                style={styles.noteInput}
                placeholder="备注（可选）"
                placeholderTextColor={COLORS.textSecondary}
                value={note}
                onChangeText={setNote}
              />

              <TextInput
                style={styles.noteInput}
                placeholder={`日期（如 ${today}）`}
                placeholderTextColor={COLORS.textSecondary}
                value={date}
                onChangeText={setDate}
              />

              {type === 'expense' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.catChip,
                        { borderColor: cat.color },
                        category === cat.key && { backgroundColor: cat.color },
                      ]}
                      onPress={() => setCategory(cat.key)}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          { color: category === cat.key ? '#fff' : cat.color },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity
                style={[
                  styles.addRecordBtn,
                  { backgroundColor: type === 'income' ? COLORS.income : COLORS.expense },
                ]}
                onPress={handleAdd}
              >
                <Text style={styles.addRecordBtnText}>添加记录</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.sectionTitle}>记录列表</Text>
              <TouchableOpacity onPress={() => setFilterDate(filterDate ? null : today)}>
                <Text style={styles.filterBtn}>
                  {filterDate ? '显示全部' : '只看今天'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={<EmptyState text="还没有记账，先添加一条吧" />}
        renderItem={({ item }) => (
          <TransactionRow item={item} onDelete={() => confirmDelete(item)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  summaryLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeBtnIncome: { backgroundColor: COLORS.incomeBg, borderColor: COLORS.income },
  typeBtnExpense: { backgroundColor: COLORS.expenseBg, borderColor: COLORS.expense },
  typeBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  typeBtnTextActive: { color: COLORS.text },
  amountInput: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    paddingVertical: 4,
  },
  noteInput: {
    fontSize: 15,
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
    marginBottom: 8,
  },
  catScroll: { marginVertical: 10 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  catChipText: { fontSize: 13, fontWeight: '600' },
  addRecordBtn: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addRecordBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  filterBtn: { fontSize: 14, color: COLORS.accent, fontWeight: '600' },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  txDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  txInfo: { flex: 1 },
  txNote: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  txMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
});
