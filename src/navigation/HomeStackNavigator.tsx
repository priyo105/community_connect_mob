import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../app/home/HomeScreen';
import JobsAndGigsScreen from '../app/jobs/JobCategorySelection';
import JobsListingScreen from '@/app/jobs/JobListing';

export type HomeStackParamList = {
  HomeDashboard: undefined;
  JobsAndGigsHub: undefined;
  JobsListing: { mode: 'standard' | 'quick-gigs' };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

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
            onSelectMode={(mode) =>
              props.navigation.navigate('JobsListing', { mode })
            }
            onPostPress={() => {}}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="JobsListing" component={JobsListingScreen} />
    </Stack.Navigator>
  );
}