import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { authService } from '../app/api/authService';
import LoginScreen from '../app/auth/AuthScreen';
import OnboardingScreen from '../app/auth/OnBoarding';
import SignUpStep1 from '../app/auth/SignUp';
import VerifyOtpAndRegister from '../app/auth/VerifyOtpAndRegister';
import HomeScreen from '../app/home/HomeScreen';
import CustomSplashScreen from '../app/Splash/CustomSplash';
import tokenStorage from './api/tokenstorage';


export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [registeredEmail, setRegisteredEmail] = useState(''); 
  const [userData, setUserData] = useState(null);

  // Check token and fetch user profile automatically right after splash finishes
  const handleSplashFinish = async () => {
    try {
      const token = await tokenStorage.getAccessToken();

      if (!token) {
        setCurrentScreen('login');
        return;
      }

      // Fetch user profile using the stored token
      const profileResponse = await authService.getProfile();
      const user = profileResponse.user || profileResponse;
      setUserData(user);

      if (user?.isOnboardingCompleted === false) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('home'); // Directly bypass login for authenticated users!
      }
    } catch (error) {
      console.log('Session check failed or token expired:', error);
      await tokenStorage.clearTokens();
      setCurrentScreen('login');
    }
  };

  if (currentScreen === 'splash') {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen 
        onNavigateToSignUp={() => setCurrentScreen('signup_step1')} 
        onLoginSuccess={(user) => {
          setUserData(user);
          if (user?.isOnboardingCompleted === false) {
            setCurrentScreen('onboarding');
          } else {
            setCurrentScreen('home');
          }
        }}
      />
    );
  }

  if (currentScreen === 'signup_step1') {
    return (
      <SignUpStep1 
        onOtpRequested={(email) => {
          setRegisteredEmail(email);          // 1. Save the email address
          setCurrentScreen('signup_step2');   // 2. Switch view to the OTP verification screen
        }}
        onNavigateToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'signup_step2') {
    return (
      <VerifyOtpAndRegister 
        email={registeredEmail}             
        onVerificationSuccess={(user) => {
          setUserData(user);
          // Check if verification response says onboarding is complete or not
          if (user?.isOnboardingCompleted === false) {
            setCurrentScreen('onboarding');    
          } else {
            setCurrentScreen('home');
          }
        }}
        onBack={() => setCurrentScreen('signup_step1')}
      />
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen 
        onOnboardingComplete={(updatedUser) => {
          console.log('Onboarding complete, user:', updatedUser);
          setUserData(updatedUser);
          setCurrentScreen('home');
        }} 
      />
    );
  }

  if (currentScreen === 'home') {
    return <HomeScreen user={userData} />;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});