import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomTabBar from '../components/commons/BottomTabBar';
import HomeScreen from './HomeScreen';
import FeedScreen from './tabs/FeedScreen';
import MarketScreen from './tabs/MarketScreen';
import StudentScreen from './tabs/StudentScreen';

interface HomeTabNavigatorProps {
  user: any;
}

export default function HomeTabNavigator({ user }: HomeTabNavigatorProps) {
  const [currentTab, setCurrentTab] = useState('home');

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen user={user} />;
      case 'feed':
        return <FeedScreen />;
      case 'market':
        return <MarketScreen />;
      case 'student':
        return <StudentScreen />;
      default:
        return <HomeScreen user={user} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderActiveTab()}
      </View>
      <BottomTabBar currentTab={currentTab} onTabPress={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
});