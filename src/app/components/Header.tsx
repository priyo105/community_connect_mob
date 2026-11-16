import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  userAvatar?: any;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ userAvatar, onSearchPress, onProfilePress }: HeaderProps) {
  return (
    // SafeAreaView automatically pushes content below the notch / dynamic island
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onProfilePress} style={styles.profileContainer}>
          <Image 
            source={userAvatar || require('../../assets/logo.png')} 
            style={styles.avatar} 
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Text style={styles.brandTitle}>Deshi Connect</Text>

        <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
          <Ionicons name="search-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#064E3B', // Ensures the notch background matches your emerald theme
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  avatar: { width: '100%', height: '100%' },
  brandTitle: { fontSize: 18, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700' },
  searchButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});