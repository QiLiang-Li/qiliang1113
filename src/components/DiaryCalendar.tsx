import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, formatDate } from '../constants';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

type ViewMode = 'day' | 'month' | 'year';

function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function toYmd(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface DiaryCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  markedDates: Set<string>;
}

export function DiaryCalendar({ selectedDate, onSelectDate, markedDates }: DiaryCalendarProps) {
  const initial = parseYmd(selectedDate);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);

  const today = formatDate(new Date());
  const selected = parseYmd(selectedDate);

  useEffect(() => {
    const p = parseYmd(selectedDate);
    setViewYear(p.year);
    setViewMonth(p.month);
  }, [selectedDate]);

  const yearRange = useMemo(() => {
    const center = viewYear;
    const start = center - 5;
    return Array.from({ length: 12 }, (_, i) => start + i);
  }, [viewYear]);

  const dayCells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
    const total = daysInMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const syncViewToSelected = () => {
    const p = parseYmd(selectedDate);
    setViewYear(p.year);
    setViewMonth(p.month);
  };

  const selectDay = (day: number) => {
    const ymd = toYmd(viewYear, viewMonth, day);
    onSelectDate(ymd);
  };

  const selectMonth = (month: number) => {
    setViewMonth(month);
    setViewMode('day');
    const maxDay = daysInMonth(viewYear, month);
    const day = Math.min(selected.day, maxDay);
    onSelectDate(toYmd(viewYear, month, day));
  };

  const selectYear = (year: number) => {
    setViewYear(year);
    setViewMode('month');
  };

  const shiftMonth = (delta: number) => {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
    const maxDay = daysInMonth(y, m);
    const day = Math.min(selected.day, maxDay);
    onSelectDate(toYmd(y, m, day));
  };

  const shiftYear = (delta: number) => {
    setViewYear((y) => y + delta);
  };

  const headerTitle =
    viewMode === 'day'
      ? `${viewYear}年${viewMonth}月`
      : viewMode === 'month'
        ? `${viewYear}年`
        : '选择年份';

  const onHeaderPress = () => {
    if (viewMode === 'day') {
      setViewMode('month');
    } else if (viewMode === 'month') {
      setViewMode('year');
    }
  };

  const showBack = viewMode !== 'day';

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => {
              if (viewMode === 'year') setViewMode('month');
              else {
                setViewMode('day');
                syncViewToSelected();
              }
            }}
          >
            <Text style={styles.navText}>‹ 返回</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={() => shiftMonth(-1)}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.titleBtn}
          onPress={onHeaderPress}
          disabled={viewMode === 'year'}
        >
          <Text style={styles.title}>{headerTitle}</Text>
          {viewMode !== 'year' ? <Text style={styles.titleHint}>点击展开</Text> : null}
        </TouchableOpacity>

        {viewMode === 'day' ? (
          <TouchableOpacity style={styles.navBtn} onPress={() => shiftMonth(1)}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        ) : viewMode === 'month' ? (
          <View style={styles.yearNav}>
            <TouchableOpacity onPress={() => shiftYear(-1)}>
              <Text style={styles.navText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shiftYear(1)}>
              <Text style={styles.navText}>›</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navBtn} />
        )}
      </View>

      {viewMode === 'day' ? (
        <>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={styles.weekCell}>
                {w}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {dayCells.map((day, i) => {
              if (day === null) {
                return <View key={`e-${i}`} style={styles.dayCell} />;
              }
              const ymd = toYmd(viewYear, viewMonth, day);
              const isSelected = ymd === selectedDate;
              const isToday = ymd === today;
              const hasEntry = markedDates.has(ymd);
              return (
                <TouchableOpacity
                  key={ymd}
                  style={[styles.dayCell, isSelected && styles.daySelected]}
                  onPress={() => selectDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasEntry ? <View style={[styles.dot, isSelected && styles.dotSelected]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : null}

      {viewMode === 'month' ? (
        <View style={styles.monthGrid}>
          {MONTH_LABELS.map((label, idx) => {
            const month = idx + 1;
            const isCurrent = month === viewMonth && viewYear === selected.year;
            const hasAny = Array.from(markedDates).some((d) => d.startsWith(`${viewYear}-${String(month).padStart(2, '0')}`));
            return (
              <TouchableOpacity
                key={label}
                style={[styles.monthCell, isCurrent && styles.monthCellActive]}
                onPress={() => selectMonth(month)}
              >
                <Text style={[styles.monthText, isCurrent && styles.monthTextActive]}>{label}</Text>
                {hasAny ? <View style={styles.monthDot} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {viewMode === 'year' ? (
        <View style={styles.yearGrid}>
          {yearRange.map((year) => {
            const isCurrent = year === selected.year;
            const hasAny = Array.from(markedDates).some((d) => d.startsWith(String(year)));
            return (
              <TouchableOpacity
                key={year}
                style={[styles.yearCell, isCurrent && styles.yearCellActive]}
                onPress={() => selectYear(year)}
              >
                <Text style={[styles.yearText, isCurrent && styles.yearTextActive]}>{year}</Text>
                {hasAny ? <View style={styles.monthDot} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 44,
  },
  navBtn: {
    width: 48,
    padding: 8,
  },
  navText: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: '600',
  },
  titleBtn: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  titleHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  yearNav: {
    flexDirection: 'row',
    width: 48,
    justifyContent: 'space-between',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  daySelected: {
    backgroundColor: COLORS.accent,
  },
  dayText: {
    fontSize: 15,
    color: COLORS.text,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  dayToday: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginTop: 2,
  },
  dotSelected: {
    backgroundColor: '#fff',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  monthCell: {
    width: '25%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
  },
  monthCellActive: {
    backgroundColor: COLORS.accentLight,
  },
  monthText: {
    fontSize: 16,
    color: COLORS.text,
  },
  monthTextActive: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  monthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginTop: 6,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  yearCell: {
    width: '33.33%',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
  },
  yearCellActive: {
    backgroundColor: COLORS.accentLight,
  },
  yearText: {
    fontSize: 17,
    color: COLORS.text,
  },
  yearTextActive: {
    color: COLORS.accent,
    fontWeight: '700',
  },
});
