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

interface SignUpStep2Props {
  email: string;
  onVerificationSuccess: (user: any) => void;
  onBack: () => void;
}

export default function VerifyOtpAndRegister({ email, onVerificationSuccess, onBack }: SignUpStep2Props) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter the valid OTP sent to your email.');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.verifyRegisterOtp({ email, otp });

      Alert.alert('Success', data.message || 'Account successfully verified!');
      if (onVerificationSuccess) {
        onVerificationSuccess(data.user);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      Alert.alert('Verification Failed', errorMessage);
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
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.titleRow}>
            <Text style={styles.brandPrimary}>Verify </Text>
            <Text style={styles.brandAccent}>Email</Text>
          </View>
          <Text style={styles.subtitle}>
            Enter the verification code sent to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter OTP Code</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="694271"
              placeholderTextColor="#9CA3AF"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleVerifyOtp} disabled={loading}>
            <Text style={styles.actionButtonText}>{loading ? 'Verifying...' : 'Verify & Complete'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backLinkText}>← Back to Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  gradientBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bottomGraphic: { position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.25, width: '100%', height: 250, zIndex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40, zIndex: 2 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  brandPrimary: { fontSize: 28, fontFamily: 'ProximaNova-Bold', fontWeight: '700', color: '#064E3B' },
  brandAccent: { fontSize: 28, fontFamily: 'ProximaNova-Bold', fontWeight: '700', color: '#DC2626' },
  subtitle: { fontSize: 14, fontFamily: 'ProximaNova-Medium', color: '#4B5563', fontWeight: '500', textAlign: 'center', lineHeight: 20 },
  emailHighlight: { fontFamily: 'ProximaNova-Bold', color: '#064E3B', fontWeight: '700' },
  formContainer: { width: '100%', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'ProximaNova-Medium', color: '#374151', fontWeight: '600', marginBottom: 6 },
  otpInput: { width: '100%', height: 56, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 1.5, borderColor: '#064E3B', borderRadius: 12, paddingHorizontal: 16, fontSize: 22, fontFamily: 'ProximaNova-Bold', color: '#1F2937', textAlign: 'center', letterSpacing: 6 },
  actionButton: { width: '100%', height: 48, backgroundColor: '#064E3B', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionButtonText: { fontSize: 15, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  backLinkText: { fontSize: 14, fontFamily: 'ProximaNova-Bold', color: '#064E3B', fontWeight: '700' },
});