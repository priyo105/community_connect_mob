import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomTabBarProps {
  currentTab: string;
  onTabPress: (tab: string) => void;
}

const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'feed', label: 'Feed', icon: 'newspaper' },
  { key: 'market', label: 'Market', icon: 'storefront' },
  { key: 'student', label: 'Student', icon: 'school' },
];

export default function BottomTabBar({ currentTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? (tab.icon as any) : (`${tab.icon}-outline` as any)}
              size={22}
              color={isActive ? '#064E3B' : '#9CA3AF'}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'ProximaNova-Medium',
    color: '#9CA3AF',
    marginTop: 4,
  },
  activeTabLabel: {
    fontFamily: 'ProximaNova-Bold',
    color: '#064E3B',
  },
});