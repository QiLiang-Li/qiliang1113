import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants';
import { FINANCE_BLUE, FINANCE_BLUE_LIGHT } from '../../finance/constants';

const ITEM_H = 44;

interface DateTimePickerModalProps {
  visible: boolean;
  date: string;
  time: string;
  initialMode?: 'date' | 'time';
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

function parseDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function WheelColumn({
  items,
  selected,
  onSelect,
  suffix,
}: {
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
  suffix: string;
}) {
  const ref = useRef<ScrollView>(null);
  const index = Math.max(0, items.indexOf(selected));

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ y: index * ITEM_H, animated: false });
    }
  }, [index, items.length]);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    const clamped = Math.min(Math.max(i, 0), items.length - 1);
    onSelect(items[clamped]);
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.wheel}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_H}
      decelerationRate="fast"
      onMomentumScrollEnd={onEnd}
      contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
    >
      {items.map((n) => (
        <View key={n} style={styles.wheelItem}>
          <Text style={[styles.wheelText, n === selected && styles.wheelTextActive]}>
            {n}
            {suffix}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function DateTimePickerModal({
  visible,
  date,
  time,
  initialMode = 'date',
  onClose,
  onConfirm,
}: DateTimePickerModalProps) {
  const initial = parseDate(date);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [timeVal, setTimeVal] = useState(time);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    if (visible) {
      const p = parseDate(date);
      setYear(p.year);
      setMonth(p.month);
      setDay(p.day);
      setTimeVal(time);
      setShowTime(initialMode === 'time');
    }
  }, [visible, date, time, initialMode]);

  const years = useMemo(() => Array.from({ length: 11 }, (_, i) => year - 5 + i), [year]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const maxDay = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay]);

  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay, day]);

  const [h, m] = timeVal.split(':').map(Number);

  const confirm = () => {
    const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onConfirm(ymd, timeVal);
  };

  if (showTime) {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const mins = Array.from({ length: 60 }, (_, i) => i);
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>选择时间</Text>
            <View style={styles.wheels}>
              <WheelColumn items={hours} selected={h} onSelect={(v) => setTimeVal(`${String(v).padStart(2, '0')}:${String(m).padStart(2, '0')}`)} suffix="时" />
              <WheelColumn items={mins} selected={m} onSelect={(v) => setTimeVal(`${String(h).padStart(2, '0')}:${String(v).padStart(2, '0')}`)} suffix="分" />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => setShowTime(false)}>
                <Text style={styles.btnCancel}>返回</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={confirm}>
                <Text style={styles.btnOk}>确定</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>选择日期和时间</Text>
          <View style={styles.wheelsWrap}>
            <View style={styles.highlight} />
            <View style={styles.wheels}>
              <WheelColumn items={years} selected={year} onSelect={setYear} suffix="年" />
              <WheelColumn items={months} selected={month} onSelect={setMonth} suffix="月" />
              <WheelColumn items={days} selected={day} onSelect={setDay} suffix="日" />
            </View>
          </View>
          <TouchableOpacity style={styles.timeRow} onPress={() => setShowTime(true)}>
            <Text style={styles.timeLabel}>时间</Text>
            <Text style={styles.timeValue}>{timeVal} ›</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnCancel}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={confirm}>
              <Text style={styles.btnOk}>确定</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function formatDateTimeLabel(date: string, time: string) {
  const [, mo, d] = date.split('-');
  return `${date.replace(/-/g, '/')}${time ? ` ${time}` : ''}`;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  wheelsWrap: { position: 'relative', height: ITEM_H * 5 },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_H * 2,
    height: ITEM_H,
    backgroundColor: FINANCE_BLUE_LIGHT,
    borderRadius: 8,
    zIndex: 0,
  },
  wheels: { flexDirection: 'row', zIndex: 1 },
  wheel: { flex: 1, height: ITEM_H * 5 },
  wheelItem: { height: ITEM_H, justifyContent: 'center', alignItems: 'center' },
  wheelText: { fontSize: 16, color: COLORS.textSecondary },
  wheelTextActive: { fontSize: 18, color: FINANCE_BLUE, fontWeight: '700' },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  timeLabel: { fontSize: 16, color: COLORS.text },
  timeValue: { fontSize: 16, color: FINANCE_BLUE, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#F0F0F2',
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: FINANCE_BLUE_LIGHT },
  btnCancel: { fontSize: 16, color: FINANCE_BLUE, fontWeight: '600' },
  btnOk: { fontSize: 16, color: FINANCE_BLUE, fontWeight: '700' },
});
