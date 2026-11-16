import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
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

// Comprehensive dataset for UK Cities, Boroughs, and BD Districts
const UK_CITIES = [
  'London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 
  'Liverpool', 'Sheffield', 'Edinburgh', 'Bristol', 'Leicester',
  'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Nottingham',
  'Newcastle upon Tyne', 'Sheffield', 'Southampton', 'Portsmouth'
];

const UK_BOROUGHS = [
  'Tower Hamlets', 'Newham', 'Redbridge', 'Barking and Dagenham',
  'Hackney', 'Islington', 'Camden', 'Southwark', 'Lambeth',
  'Wandsworth', 'Greenwich', 'Lewisham', 'Brent', 'Ealing',
  'Hounslow', 'Haringey', 'Waltham Forest', 'Enfield', 'Barnet',
  'Manchester City Centre', 'Birmingham Central', 'Other / Outside London'
];

const BD_DISTRICTS = [
  'Dhaka', 'Sylhet', 'Chittagong', 'Sunamganj', 'Moulvibazar',
  'Habiganj', 'Comilla', 'Noakhali', 'Barisal', 'Khulna',
  'Rajshahi', 'Rangpur', 'Mymensingh', 'Faridpur', 'Tangail',
  'Brahmanbaria', 'Chandpur', 'Jessore', 'Bogra', 'Pabna'
];

interface OnboardingScreenProps {
  onOnboardingComplete: (updatedUser: any) => void;
}

export default function OnboardingScreen({ onOnboardingComplete }: OnboardingScreenProps) {
  const [ukCity, setUkCity] = useState('');
  const [ukBorough, setUkBorough] = useState('');
  const [bdDistrict, setBdDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  // Dropdown Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<'city' | 'borough' | 'district' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openDropdown = (field: 'city' | 'borough' | 'district') => {
    setActiveField(field);
    setSearchQuery('');
    setModalVisible(true);
  };

  const getFilteredData = () => {
    let data: string[] = [];
    if (activeField === 'city') data = UK_CITIES;
    else if (activeField === 'borough') data = UK_BOROUGHS;
    else if (activeField === 'district') data = BD_DISTRICTS;

    return data.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const handleSelectOption = (item: string) => {
    if (activeField === 'city') setUkCity(item);
    else if (activeField === 'borough') setUkBorough(item);
    else if (activeField === 'district') setBdDistrict(item);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!ukCity || !ukBorough || !bdDistrict) {
      Alert.alert('Incomplete Details', 'Please select your UK City, UK Borough, and BD District.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.updateProfile({
        ukCity,
        ukBorough,
        bdDistrict,
      });

      Alert.alert('Welcome!', response.message || 'Profile setup complete.');
      if (onOnboardingComplete) {
        onOnboardingComplete(response.user);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Setup Failed', errorMsg);
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
            <Text style={styles.brandPrimary}>Complete </Text>
            <Text style={styles.brandAccent}>Profile</Text>
          </View>
          <Text style={styles.subtitle}>Tell us a bit about your roots and current location to connect with your community.</Text>
        </View>

        <View style={styles.formContainer}>
          {/* UK City Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current UK City</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector} 
              onPress={() => openDropdown('city')}
            >
              <Text style={ukCity ? styles.dropdownTextSelected : styles.dropdownPlaceholder}>
                {ukCity || 'Select your UK city'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* UK Borough Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>UK Borough / Area</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector} 
              onPress={() => openDropdown('borough')}
            >
              <Text style={ukBorough ? styles.dropdownTextSelected : styles.dropdownPlaceholder}>
                {ukBorough || 'Select your UK borough'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* BD District Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home District in Bangladesh</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector} 
              onPress={() => openDropdown('district')}
            >
              <Text style={bdDistrict ? styles.dropdownTextSelected : styles.dropdownPlaceholder}>
                {bdDistrict || 'Select your BD district'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.actionButtonText}>
              {loading ? 'Saving Profile...' : 'Save & Enter Community'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Searchable Dropdown Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {activeField === 'city' ? 'UK City' : activeField === 'borough' ? 'UK Borough' : 'BD District'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />

            <FlatList
              data={getFilteredData()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  subtitle: { fontSize: 13, fontFamily: 'ProximaNova-Medium', color: '#4B5563', fontWeight: '500', textAlign: 'center', paddingHorizontal: 10, lineHeight: 18 },
  formContainer: { width: '100%', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'ProximaNova-Medium', color: '#374151', fontWeight: '600', marginBottom: 6 },
  dropdownSelector: { width: '100%', height: 48, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'between' as any },
  dropdownPlaceholder: { fontSize: 14, fontFamily: 'ProximaNova-Medium', color: '#9CA3AF' },
  dropdownTextSelected: { fontSize: 14, fontFamily: 'ProximaNova-Bold', color: '#1F2937', fontWeight: '600' },
  chevron: { fontSize: 12, color: '#6B7280' },
  actionButton: { width: '100%', height: 48, backgroundColor: '#064E3B', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionButtonText: { fontSize: 15, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700' },
  
  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontFamily: 'ProximaNova-Bold', color: '#064E3B', fontWeight: '700' },
  closeButton: { fontSize: 18, color: '#6B7280', padding: 4 },
  searchInput: { width: '100%', height: 44, backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, fontFamily: 'ProximaNova-Medium', marginBottom: 12, color: '#1F2937' },
  modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalItemText: { fontSize: 15, fontFamily: 'ProximaNova-Medium', color: '#374151' },
});