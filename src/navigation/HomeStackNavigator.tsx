import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../app/home/HomeScreen';
 import JobsAndGigsScreen from '../app/jobs/JobCategorySelection';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator({ user }: { user: any }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard">
        {(props) => <HomeScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="JobsAndGigsHub">
        {(props) => (
          <JobsAndGigsScreen
            {...props}
            onSelectMode={() => {}}
            onPostPress={() => {}}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}