import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { authService } from '../api/authService';

interface LoginScreenProps {
  onNavigateToSignUp?: () => void;
  onLoginSuccess?: (user: any) => void;
}

export default function LoginScreen({ onNavigateToSignUp, onLoginSuccess }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both your email/phone and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login({ identifier, password });
      console.log(data);
      
      Alert.alert('Success', data.message);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Premium subtle gradient background matching brand styling */}
      <LinearGradient
        colors={['#F0FDF4', '#FFF1F2', '#FFFFFF']}
        locations={[0, 0.4, 0.8]}
        style={styles.gradientBackground}
      />

      <StatusBar barStyle="dark-content"  />
      
      <Image 
        source={require('../../assets/westminister.png')} 
        style={styles.bottomGraphic} 
        resizeMode="contain"
        pointerEvents="none"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.titleRow}>
            <Text style={styles.brandPrimary}>Deshi </Text>
            <Text style={styles.brandAccent}>Connect</Text>
          </View>
          <Text style={styles.subtitle}>Welcome back! Please enter your details.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>

        {/* Attached Sign Up navigation link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomGraphic: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.25,
    width: '100%',
    height: 250,
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 40,
    zIndex: 2,
  },
  headerContainer: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  logo: { 
    width: 90, 
    height: 90, 
    marginBottom: 16 
  },
  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  brandPrimary: { 
    fontSize: 28, 
    fontFamily: 'ProximaNova-Bold', 
    fontWeight: '700', 
    color: '#064E3B' 
  },
  brandAccent: { 
    fontSize: 28, 
    fontFamily: 'ProximaNova-Bold', 
    fontWeight: '700', 
    color: '#DC2626' 
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: 'ProximaNova-Medium', 
    color: '#4B5563', 
    fontWeight: '500' 
  },
  formContainer: { 
    width: '100%', 
    marginBottom: 24 
  },
  inputGroup: { 
    marginBottom: 16 
  },
  label: { 
    fontSize: 13, 
    fontFamily: 'ProximaNova-Medium', 
    color: '#374151', 
    fontWeight: '600', 
    marginBottom: 6 
  },
  input: { 
    width: '100%', 
    height: 48, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    fontSize: 14, 
    fontFamily: 'ProximaNova-Medium', 
    color: '#1F2937' 
  },
  loginButton: { 
    width: '100%', 
    height: 48, 
    backgroundColor: '#064E3B', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: { 
    fontSize: 15, 
    fontFamily: 'ProximaNova-Bold', 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
  footerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footerText: { 
    fontSize: 14, 
    fontFamily: 'ProximaNova-Medium', 
    color: '#6B7280' 
  },
  signUpText: { 
    fontSize: 14, 
    fontFamily: 'ProximaNova-Bold', 
    color: '#DC2626', 
    fontWeight: '700' 
  },
});