import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Alert, Linking, Platform } from 'react-native';

/** 与 GitHub Pages 上的 website/config.json 保持一致 */
export const REMOTE_CONFIG_URL = 'https://qiliang-li.github.io/qiliang1113/config.json';

export interface RemoteConfig {
  appName: string;
  version: string;
  androidApkUrl: string;
  iosAppStoreUrl?: string;
  updatedAt?: string;
}

export function getCurrentVersion(): string {
  return Constants.expoConfig?.version ?? '0.0.0';
}

/** 1 if a > b, -1 if a < b, 0 if equal */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const res = await fetch(`${REMOTE_CONFIG_URL}?_=${Date.now()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`无法获取更新信息（${res.status}）`);
  }
  return res.json() as Promise<RemoteConfig>;
}

export async function checkForUpdate(): Promise<{
  hasUpdate: boolean;
  current: string;
  remote: RemoteConfig;
}> {
  const remote = await fetchRemoteConfig();
  const current = getCurrentVersion();
  const hasUpdate =
    Platform.OS === 'android' &&
    Boolean(remote.androidApkUrl) &&
    compareVersions(remote.version, current) > 0;
  return { hasUpdate, current, remote };
}

export async function downloadAndInstallApk(
  url: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (Platform.OS !== 'android') {
    throw new Error('仅支持 Android 安装 APK');
  }

  const target = `${FileSystem.cacheDirectory}diary-finance-update.apk`;
  try {
    await FileSystem.deleteAsync(target, { idempotent: true });
  } catch {
    /* cache may not exist */
  }

  const task = FileSystem.createDownloadResumable(url, target, {}, (snapshot) => {
    if (snapshot.totalBytesExpectedToWrite > 0) {
      onProgress?.(snapshot.totalBytesWritten / snapshot.totalBytesExpectedToWrite);
    }
  });

  const result = await task.downloadAsync();
  if (!result?.uri) {
    throw new Error('下载失败，请稍后重试');
  }

  const contentUri = await FileSystem.getContentUriAsync(result.uri);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1,
    type: 'application/vnd.android.package-archive',
  });
}

export function openApkInBrowser(url: string) {
  Linking.openURL(url);
}

export function promptInstallUnknownApps() {
  Alert.alert(
    '需要安装权限',
    '若无法安装，请在系统设置中允许「招财猫」安装未知应用，然后重试。',
    [
      { text: '取消', style: 'cancel' },
      {
        text: '打开设置',
        onPress: () => {
          Linking.openSettings();
        },
      },
    ]
  );
}
