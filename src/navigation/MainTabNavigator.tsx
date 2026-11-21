import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStackNavigator';
import FeedScreen from '../app/home/tabs/FeedScreen';
import MarketScreen from '../app/home/tabs/MarketScreen';
import StudentScreen from '../app/home/tabs/StudentScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ user }: { user: any }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#064E3B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'ProximaNova-Bold',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Feed') iconName = focused ? 'newspaper' : 'newspaper-outline';
          else if (route.name === 'Market') iconName = focused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'Student') iconName = focused ? 'school' : 'school-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => <HomeStackNavigator user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Market" component={MarketScreen} />
      <Tab.Screen name="Student" component={StudentScreen} />
    </Tab.Navigator>
  );
}