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

interface SignUpStep1Props {
  onOtpRequested: (email: string) => void;
  onNavigateToLogin: () => void;
}

export default function SignUpStep1({ onOtpRequested, onNavigateToLogin }: SignUpStep1Props) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.requestRegisterOtp({
        fullName,
        username,
        email,
        password,
      });

      Alert.alert('Success', data.message || 'OTP sent to your email.');
      onOtpRequested(email); // Pass email forward to Step 2
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
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
            <Text style={styles.brandPrimary}>Create </Text>
            <Text style={styles.brandAccent}>Account</Text>
          </View>
          <Text style={styles.subtitle}>Join the Deshi Connect community in the UK.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex. Karim Benzema"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="ex benzema101"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="benzema@gmail.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="minimum 8 words"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleRequestOtp} disabled={loading}>
            <Text style={styles.actionButtonText}>{loading ? 'Sending OTP...' : 'Continue & Verify'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  gradientBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bottomGraphic: { position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.25, width: '100%', height: 250 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40, zIndex: 2 },
  headerContainer: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 80, height: 80, marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  brandPrimary: { fontSize: 26, fontFamily: 'ProximaNova-Bold', fontWeight: '700', color: '#064E3B' },
  brandAccent: { fontSize: 26, fontFamily: 'ProximaNova-Bold', fontWeight: '700', color: '#DC2626' },
  subtitle: { fontSize: 13, fontFamily: 'ProximaNova-Medium', color: '#4B5563', fontWeight: '500', textAlign: 'center' },
  formContainer: { width: '100%', marginBottom: 20 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontFamily: 'ProximaNova-Medium', color: '#374151', fontWeight: '600', marginBottom: 6 },
  input: { width: '100%', height: 46, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, fontSize: 14, fontFamily: 'ProximaNova-Medium', color: '#1F2937' },
  actionButton: { width: '100%', height: 48, backgroundColor: '#064E3B', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionButtonText: { fontSize: 15, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, fontFamily: 'ProximaNova-Medium', color: '#6B7280' },
  loginLinkText: { fontSize: 14, fontFamily: 'ProximaNova-Bold', color: '#DC2626', fontWeight: '700' },
});