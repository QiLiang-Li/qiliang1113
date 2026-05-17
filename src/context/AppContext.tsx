import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createId, formatDate } from '../constants';
import { loadAppData, saveAppData } from '../storage';
import { formatTime } from '../finance/constants';
import {
  AppData,
  DailyDiary,
  Essay,
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType,
} from '../types';

interface AppContextValue extends AppData {
  ready: boolean;
  saveDiary: (date: string, content: string) => Promise<void>;
  getDiary: (date: string) => DailyDiary | undefined;
  saveEssay: (essay: Omit<Essay, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  deleteEssay: (id: string) => Promise<void>;
  addTransaction: (input: {
    type: TransactionType;
    amount: number;
    category: ExpenseCategory;
    incomeCategory?: IncomeCategory;
    note: string;
    date: string;
    time?: string;
    channel?: string;
    app?: string;
  }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  diaryDates: Set<string>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>({ diaries: [], essays: [], transactions: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadAppData().then((loaded) => {
      setData(loaded);
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (next: AppData) => {
    setData(next);
    await saveAppData(next);
  }, []);

  const saveDiary = useCallback(
    async (date: string, content: string) => {
      const trimmed = content.trim();
      const existing = data.diaries.find((d) => d.date === date);
      let diaries: DailyDiary[];

      if (!trimmed) {
        diaries = data.diaries.filter((d) => d.date !== date);
      } else if (existing) {
        diaries = data.diaries.map((d) =>
          d.date === date ? { ...d, content: trimmed, updatedAt: new Date().toISOString() } : d
        );
      } else {
        diaries = [
          ...data.diaries,
          {
            id: createId(),
            date,
            content: trimmed,
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      await persist({ ...data, diaries });
    },
    [data, persist]
  );

  const getDiary = useCallback(
    (date: string) => data.diaries.find((d) => d.date === date),
    [data.diaries]
  );

  const saveEssay = useCallback(
    async (input: Omit<Essay, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      const now = new Date().toISOString();
      let essays: Essay[];

      if (input.id) {
        essays = data.essays.map((e) =>
          e.id === input.id
            ? { ...e, title: input.title, content: input.content, updatedAt: now }
            : e
        );
      } else {
        essays = [
          {
            id: createId(),
            title: input.title.trim() || '无标题感言',
            content: input.content,
            createdAt: now,
            updatedAt: now,
          },
          ...data.essays,
        ];
      }

      await persist({ ...data, essays });
    },
    [data, persist]
  );

  const deleteEssay = useCallback(
    async (id: string) => {
      await persist({ ...data, essays: data.essays.filter((e) => e.id !== id) });
    },
    [data, persist]
  );

  const addTransaction = useCallback(
    async (input: {
      type: TransactionType;
      amount: number;
      category: ExpenseCategory;
      incomeCategory?: IncomeCategory;
      note: string;
      date: string;
      time?: string;
      channel?: string;
      app?: string;
    }) => {
      const now = new Date();
      const transaction: Transaction = {
        id: createId(),
        type: input.type,
        amount: input.amount,
        category: input.category,
        incomeCategory: input.incomeCategory,
        note: input.note.trim(),
        date: input.date,
        time: input.time ?? formatTime(now),
        channel: input.channel?.trim() || '其他',
        app: input.app?.trim() || '其他',
        createdAt: now.toISOString(),
      };
      await persist({
        ...data,
        transactions: [transaction, ...data.transactions],
      });
    },
    [data, persist]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await persist({
        ...data,
        transactions: data.transactions.filter((t) => t.id !== id),
      });
    },
    [data, persist]
  );

  const diaryDates = useMemo(
    () => new Set(data.diaries.filter((d) => d.content.trim()).map((d) => d.date)),
    [data.diaries]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...data,
      ready,
      saveDiary,
      getDiary,
      saveEssay,
      deleteEssay,
      addTransaction,
      deleteTransaction,
      diaryDates,
    }),
    [
      data,
      ready,
      saveDiary,
      getDiary,
      saveEssay,
      deleteEssay,
      addTransaction,
      deleteTransaction,
      diaryDates,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useToday() {
  return formatDate(new Date());
}
