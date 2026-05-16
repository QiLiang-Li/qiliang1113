import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './types';

const STORAGE_KEY = '@diary_finance_data';

const defaultData: AppData = {
  diaries: [],
  essays: [],
  transactions: [],
};

export async function loadAppData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw) as AppData;
    return {
      diaries: parsed.diaries ?? [],
      essays: parsed.essays ?? [],
      transactions: parsed.transactions ?? [],
    };
  } catch {
    return { ...defaultData };
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
