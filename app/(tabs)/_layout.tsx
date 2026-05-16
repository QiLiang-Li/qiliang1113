import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    日记: '📅',
    感言: '📝',
    记账: '💰',
  };
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {icons[label] ?? '•'}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="diary"
        options={{
          title: '日记',
          tabBarIcon: ({ focused }) => <TabIcon label="日记" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="essays"
        options={{
          title: '感言',
          tabBarIcon: ({ focused }) => <TabIcon label="感言" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: '记账',
          tabBarIcon: ({ focused }) => <TabIcon label="记账" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});
