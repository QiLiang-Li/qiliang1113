import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerModal } from '../src/components/finance/DateTimePickerModal';
import { NumericKeypad } from '../src/components/finance/NumericKeypad';
import { OptionPickerModal } from '../src/components/finance/OptionPickerModal';
import { COLORS, formatDate } from '../src/constants';
import { useApp } from '../src/context/AppContext';
import {
  CATEGORY_PAGES,
  EXPENSE_CATEGORY_LIST,
  FINANCE_BLUE,
  FINANCE_BLUE_LIGHT,
  formatTime,
  INCOME_CATEGORY_LIST,
  PAYMENT_CHANNELS,
  parseAmountInput,
} from '../src/finance/constants';
import { ExpenseCategory, IncomeCategory, TransactionType } from '../src/types';

const PAGE_W = Dimensions.get('window').width - 32;

export default function RecordTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const { addTransaction } = useApp();
  const now = new Date();
  const defaultDate = typeof params.date === 'string' && params.date ? params.date : formatDate(now);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>('salary');
  const [channel, setChannel] = useState('支付宝');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(formatTime(now));
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState(false);

  const [channelOpen, setChannelOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  const pagerRef = useRef<ScrollView>(null);

  const pages = useMemo(() => {
    if (type === 'income') return [INCOME_CATEGORY_LIST];
    return CATEGORY_PAGES;
  }, [type]);

  useEffect(() => {
    setPage(0);
    pagerRef.current?.scrollTo({ x: 0, animated: false });
  }, [type]);

  const onKey = (key: string) => {
    if (key === '.' && amount.includes('.')) return;
    if (amount.includes('.') && amount.split('.')[1]?.length >= 2) return;
    if (amount === '0' && key !== '.') {
      setAmount(key);
      return;
    }
    setAmount((a) => a + key);
  };

  const onDelete = () => setAmount((a) => a.slice(0, -1));

  const handleSave = async () => {
    const value = parseAmountInput(amount);
    if (!value) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }
    setSaving(true);
    try {
      await addTransaction({
        type,
        amount: value,
        category: type === 'expense' ? category : 'other',
        incomeCategory: type === 'income' ? incomeCategory : undefined,
        note,
        date,
        time,
        channel,
        app: '',
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const onPagerEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / PAGE_W);
    setPage(i);
  };

  const selectCategory = (key: string) => {
    if (type === 'expense') setCategory(key as ExpenseCategory);
    else setIncomeCategory(key as IncomeCategory);
  };

  const activeKey = type === 'expense' ? category : incomeCategory;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>记一笔</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>支出</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>收入</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.currency}>¥</Text>
        <Text style={styles.amountDisplay}>{amount || ''}</Text>
        {amount ? (
          <TouchableOpacity onPress={() => setAmount('')}>
            <Text style={styles.clear}>×</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.clear} />
        )}
      </View>
      <View style={styles.amountLine} />

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onPagerEnd}
        style={styles.pager}
      >
        {pages.map((pageCats, pi) => (
          <View key={pi} style={[styles.page, { width: PAGE_W }]}>
            <View style={styles.catGrid}>
              {pageCats.map((cat) => {
                const selected = activeKey === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={styles.catItem}
                    onPress={() => selectCategory(cat.key)}
                  >
                    <View
                      style={[
                        styles.catCircle,
                        { backgroundColor: selected ? cat.color : '#ECECEF' },
                      ]}
                    >
                      <Text style={styles.catIcon}>{cat.icon}</Text>
                    </View>
                    <Text style={[styles.catLabel, selected && styles.catLabelActive]}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {pages.length > 1 ? (
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
          ))}
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <TouchableOpacity style={styles.metaChip} onPress={() => setChannelOpen(true)}>
          <Text style={styles.metaText} numberOfLines={1}>
            {channel} ▾
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.metaChip}
          onPress={() => {
            setDatePickerMode('date');
            setDateOpen(true);
          }}
        >
          <Text style={styles.metaText} numberOfLines={1}>
            {date.replace(/-/g, '/')} ▾
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.metaChip}
          onPress={() => {
            setDatePickerMode('time');
            setDateOpen(true);
          }}
        >
          <Text style={styles.metaText} numberOfLines={1}>
            {time} ▾
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.note}
        placeholder="点击填写备注"
        placeholderTextColor={COLORS.textSecondary}
        value={note}
        onChangeText={setNote}
      />

      <NumericKeypad
        onKey={onKey}
        onDelete={onDelete}
        onSave={handleSave}
        saveDisabled={saving || !amount}
      />

      <OptionPickerModal
        visible={channelOpen}
        title="交易渠道"
        options={PAYMENT_CHANNELS}
        value={channel}
        onClose={() => setChannelOpen(false)}
        onConfirm={(v) => {
          setChannel(v);
          setChannelOpen(false);
        }}
      />
      <DateTimePickerModal
        visible={dateOpen}
        date={date}
        time={time}
        initialMode={datePickerMode}
        onClose={() => setDateOpen(false)}
        onConfirm={(d, t) => {
          setDate(d);
          setTime(t);
          setDateOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  back: { fontSize: 32, color: COLORS.text, lineHeight: 34, width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.text },
  headerSpacer: { width: 40 },
  typeRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  typeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  typeBtnActive: { backgroundColor: FINANCE_BLUE_LIGHT },
  typeText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  typeTextActive: { color: FINANCE_BLUE, fontWeight: '700' },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  currency: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginRight: 8 },
  amountDisplay: { flex: 1, fontSize: 32, fontWeight: '700', color: COLORS.text, minHeight: 40 },
  clear: { fontSize: 22, color: COLORS.textSecondary, width: 28, textAlign: 'center' },
  amountLine: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  pager: { maxHeight: 200, marginHorizontal: 16 },
  page: {},
  catGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  catItem: { width: '20%', alignItems: 'center', marginBottom: 14 },
  catCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIcon: { fontSize: 24 },
  catLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6 },
  catLabelActive: { color: COLORS.text, fontWeight: '600' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D0D0D4' },
  dotActive: { backgroundColor: FINANCE_BLUE, width: 14 },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  metaChip: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaText: { fontSize: 12, color: COLORS.text, textAlign: 'center' },
  note: {
    marginHorizontal: 16,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
});
