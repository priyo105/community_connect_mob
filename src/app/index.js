import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { authService } from '../app/api/authService';
import LoginScreen from '../app/auth/AuthScreen';
import OnboardingScreen from '../app/auth/OnBoarding';
import OnBoardWalkthrough from '../app/auth/OnBoardWalkthrough';
import SignUpStep1 from '../app/auth/SignUp';
import VerifyOtpAndRegister from '../app/auth/VerifyOtpAndRegister';
import HomeTabNavigator from '../app/home/HomeTabNavigator';
import CustomSplashScreen from '../app/Splash/CustomSplash';
import { LocalizationProvider } from '../localization/LocalizationContext'; // 👈 Import provider
import tokenStorage from './api/tokenstorage';

export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [registeredEmail, setRegisteredEmail] = useState(''); 
  const [userData, setUserData] = useState(null);

  const handleSplashFinish = async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        setCurrentScreen('walkthrough');
        return;
      }
      const profileResponse = await authService.getProfile();
      const user = profileResponse.user || profileResponse;
      setUserData(user);

      if (user?.isOnboardingCompleted === false) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.log('Session check failed:', error);
      await tokenStorage.clearTokens();
      setCurrentScreen('walkthrough');
    }
  };

  // Render correct screen based on state machine
  const renderScreen = () => {
    if (currentScreen === 'splash') return <CustomSplashScreen onFinish={handleSplashFinish} />;
    if (currentScreen === 'walkthrough') return <OnBoardWalkthrough onFinishWalkthrough={() => setCurrentScreen('login')} />;
    if (currentScreen === 'login') return (
      <LoginScreen 
        onNavigateToSignUp={() => setCurrentScreen('signup_step1')} 
        onLoginSuccess={(user) => {
          setUserData(user);
          setCurrentScreen(user?.isOnboardingCompleted === false ? 'onboarding' : 'home');
        }}
      />
    );
    if (currentScreen === 'signup_step1') return (
      <SignUpStep1 
        onOtpRequested={(email) => { setRegisteredEmail(email); setCurrentScreen('signup_step2'); }}
        onNavigateToLogin={() => setCurrentScreen('login')}
      />
    );
    if (currentScreen === 'signup_step2') return (
      <VerifyOtpAndRegister 
        email={registeredEmail}             
        onVerificationSuccess={(user) => {
          setUserData(user);
          setCurrentScreen(user?.isOnboardingCompleted === false ? 'onboarding' : 'home');
        }}
        onBack={() => setCurrentScreen('signup_step1')}
      />
    );
    if (currentScreen === 'onboarding') return (
      <OnboardingScreen 
        onOnboardingComplete={(updatedUser) => { setUserData(updatedUser); setCurrentScreen('home'); }} 
      />
    );
    if (currentScreen === 'home') return <HomeTabNavigator user={userData} />;
    return null;
  };

  return (
    <LocalizationProvider>
      {renderScreen()}
    </LocalizationProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});