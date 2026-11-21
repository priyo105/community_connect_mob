import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CustomSplashScreen from '../app/Splash/CustomSplash';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { authService } from '../app/api/authService';
import tokenStorage from '../app/api/tokenstorage';
import { LocalizationProvider } from '../localization/LocalizationContext';

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const handleSplashFinish = async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const profileResponse = await authService.getProfile();
      const user = profileResponse.user || profileResponse;

      if (user?.isOnboardingCompleted !== false) {
        setUserData(user);
      }
    } catch (error) {
      await tokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <LocalizationProvider>
      <NavigationContainer>
        {userData ? (
          <MainTabNavigator user={userData} />
        ) : (
          <AuthNavigator onAuthSuccess={(user) => setUserData(user)} />
        )}
      </NavigationContainer>
    </LocalizationProvider>
  );
}