import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { COLORS } from '../../src/constants';
import {
  checkForUpdate,
  downloadAndInstallApk,
  getCurrentVersion,
  openApkInBrowser,
  promptInstallUnknownApps,
} from '../../src/utils/appUpdate';

const QR = {
  contact: require('../../assets/images/wechat-contact-qr.jpg') as ImageSourcePropType,
  alipay: require('../../assets/images/alipay-qr.jpg') as ImageSourcePropType,
  wechatPay: require('../../assets/images/wechat-pay-qr.jpg') as ImageSourcePropType,
};

type Preview =
  | { kind: 'contact' }
  | { kind: 'tip'; channel: 'alipay' | 'wechatPay' }
  | null;

const ROWS = [
  { id: 'contact' as const, title: '联系制作者', subtitle: '扫码添加微信' },
  { id: 'tip' as const, title: '打赏制作者', subtitle: '支付宝 / 微信' },
];

export default function SettingsScreen() {
  const [preview, setPreview] = useState<Preview>(null);
  const [tipPickerOpen, setTipPickerOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadPct, setDownloadPct] = useState(0);

  const runDownload = useCallback(async (apkUrl: string) => {
    setDownloading(true);
    setDownloadPct(0);
    try {
      await downloadAndInstallApk(apkUrl, setDownloadPct);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '安装失败';
      Alert.alert('更新未完成', msg, [
        { text: '取消', style: 'cancel' },
        { text: '浏览器下载', onPress: () => openApkInBrowser(apkUrl) },
        { text: '权限说明', onPress: promptInstallUnknownApps },
      ]);
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleCheckUpdate = useCallback(async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('提示', '在线安装 APK 仅支持 Android 版。');
      return;
    }
    setChecking(true);
    try {
      const { hasUpdate, current, remote } = await checkForUpdate();
      if (!hasUpdate) {
        Alert.alert('已是最新版本', `当前版本 v${current}`);
        return;
      }
      Alert.alert(
        '发现新版本',
        `当前 v${current} → 最新 v${remote.version}\n是否下载并安装？`,
        [
          { text: '稍后', style: 'cancel' },
          {
            text: '立即更新',
            onPress: () => void runDownload(remote.androidApkUrl),
          },
        ]
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : '检查失败';
      Alert.alert('检查更新失败', msg);
    } finally {
      setChecking(false);
    }
  }, [runDownload]);

  const openRow = (id: 'contact' | 'tip') => {
    if (id === 'contact') {
      setPreview({ kind: 'contact' });
    } else {
      setTipPickerOpen(true);
    }
  };

  const previewTitle =
    preview?.kind === 'contact'
      ? '联系制作者'
      : preview?.kind === 'tip'
        ? preview.channel === 'alipay'
          ? '支付宝打赏'
          : '微信打赏'
        : '';

  const previewImage =
    preview?.kind === 'contact'
      ? QR.contact
      : preview?.kind === 'tip'
        ? preview.channel === 'alipay'
          ? QR.alipay
          : QR.wechatPay
        : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="设置" subtitle="联系与感谢支持" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.group, styles.groupSpaced]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={handleCheckUpdate}
            disabled={checking || downloading}
          >
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>检查更新</Text>
              <Text style={styles.rowSubtitle}>
                {downloading
                  ? `正在下载 ${Math.round(downloadPct * 100)}%…`
                  : `当前版本 v${getCurrentVersion()}`}
              </Text>
            </View>
            {checking || downloading ? (
              <ActivityIndicator color={COLORS.accent} />
            ) : (
              <Text style={styles.chevron}>›</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.group}>
          {ROWS.map((row, index) => (
            <TouchableOpacity
              key={row.id}
              style={[styles.row, index < ROWS.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={() => openRow(row.id)}
            >
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footer}>数据仅存于本机，不会上传云端</Text>
      </ScrollView>

      <Modal visible={tipPickerOpen} transparent animationType="fade" onRequestClose={() => setTipPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setTipPickerOpen(false)}>
          <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.pickerTitle}>选择打赏方式</Text>
            <TouchableOpacity
              style={styles.pickerRow}
              onPress={() => {
                setTipPickerOpen(false);
                setPreview({ kind: 'tip', channel: 'alipay' });
              }}
            >
              <Text style={styles.pickerRowText}>支付宝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerRow}
              onPress={() => {
                setTipPickerOpen(false);
                setPreview({ kind: 'tip', channel: 'wechatPay' });
              }}
            >
              <Text style={styles.pickerRowText}>微信支付</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerCancel} onPress={() => setTipPickerOpen(false)}>
              <Text style={styles.pickerCancelText}>取消</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={preview !== null} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPreview(null)}>
          <View style={styles.modalCard}>
            {previewImage ? (
              <>
                <Text style={styles.modalTitle}>{previewTitle}</Text>
                <Image source={previewImage} style={styles.qrFull} resizeMode="contain" />
                <Text style={styles.modalHint}>点击空白处关闭</Text>
              </>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  group: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  groupSpaced: { marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  rowSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  chevron: { fontSize: 22, color: COLORS.textSecondary, marginLeft: 8 },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 320,
  },
  pickerTitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  pickerRow: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  pickerRowText: { fontSize: 17, color: COLORS.accent, fontWeight: '600' },
  pickerCancel: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  pickerCancelText: { fontSize: 16, color: COLORS.textSecondary },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  qrFull: { width: 260, height: 260 },
  modalHint: { marginTop: 12, fontSize: 13, color: COLORS.textSecondary },
});
