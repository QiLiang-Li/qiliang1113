import { useState } from 'react';
import {
  Image,
  Modal,
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

const IMAGES = {
  wechatContact: require('../../assets/images/wechat-contact-qr.jpg'),
  alipay: require('../../assets/images/alipay-qr.jpg'),
  wechatPay: require('../../assets/images/wechat-pay-qr.jpg'),
};

type QrKey = keyof typeof IMAGES;

const ITEMS: { key: QrKey; title: string; desc: string }[] = [
  { key: 'wechatContact', title: '微信联系', desc: '使用中有问题可扫码添加制作者微信' },
  { key: 'alipay', title: '支付宝打赏', desc: '感谢支持，您的鼓励是我更新的动力' },
  { key: 'wechatPay', title: '微信打赏', desc: '长按识别二维码，随意打赏' },
];

export default function SupportScreen() {
  const [preview, setPreview] = useState<QrKey | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="联系与打赏" subtitle="感谢使用招财猫" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => setPreview(item.key)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
            <Image source={IMAGES[item.key]} style={styles.qrThumb} resizeMode="contain" />
            <Text style={styles.tapHint}>点击查看大图</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.footer}>数据仅存于本机，不会上传云端</Text>
      </ScrollView>

      <Modal visible={preview !== null} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPreview(null)}>
          <View style={styles.modalCard}>
            {preview ? (
              <>
                <Text style={styles.modalTitle}>{ITEMS.find((i) => i.key === preview)?.title}</Text>
                <Image source={IMAGES[preview]} style={styles.qrFull} resizeMode="contain" />
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  qrThumb: { width: 180, height: 180, marginTop: 14, borderRadius: 8 },
  tapHint: { marginTop: 8, fontSize: 12, color: COLORS.accent },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
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
