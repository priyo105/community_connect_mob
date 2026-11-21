import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardWalkthrough from '../app/auth/OnBoardWalkthrough';
import LoginScreen from '../app/auth/AuthScreen';
import SignUpStep1 from '../app/auth/SignUp';
import VerifyOtpAndRegister from '../app/auth/VerifyOtpAndRegister';
import OnboardingScreen from '../app/auth/OnBoarding';

const Stack = createNativeStackNavigator();

interface AuthNavigatorProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthNavigator({ onAuthSuccess }: AuthNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Walkthrough">
        {(props) => (
          <OnBoardWalkthrough
            {...props}
            onFinishWalkthrough={() => props.navigation.replace('Login')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onNavigateToSignUp={() => props.navigation.navigate('SignUpStep1')}
            onLoginSuccess={(user) => {
              if (user?.isOnboardingCompleted === false) {
                props.navigation.replace('Onboarding', { user });
              } else {
                onAuthSuccess(user);
              }
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SignUpStep1">
        {(props) => (
          <SignUpStep1
            {...props}
            onOtpRequested={(email) => props.navigation.navigate('VerifyOtp', { email })}
            onNavigateToLogin={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="VerifyOtp">
        {(props: any) => (
          <VerifyOtpAndRegister
            {...props}
            email={props.route.params?.email}
            onVerificationSuccess={(user) => {
              if (user?.isOnboardingCompleted === false) {
                props.navigation.replace('Onboarding', { user });
              } else {
                onAuthSuccess(user);
              }
            }}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Onboarding">
        {(props) => (
          <OnboardingScreen
            {...props}
            onOnboardingComplete={(updatedUser) => onAuthSuccess(updatedUser)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}