import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import CategoryCard from '../components/commons/CategoryCard';
import RecommendationCard from '../components/commons/RecomendationCard';

interface HomeScreenProps {
  user: any;
}

export default function HomeScreen({ user }: HomeScreenProps) {
  const userName = user?.fullName || 'Community Member';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"  />
      
      <Header 
        userAvatar={""}
        onSearchPress={() => console.log('Search clicked')}
        onProfilePress={() => console.log('Profile clicked')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Banner Card */}
        <LinearGradient
          colors={['#064E3B', '#047857']}
          style={styles.bannerCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerWelcome}>Welcome back, {userName}!</Text>
            <Text style={styles.bannerTitle}>Join the home for British-Bangladeshis.</Text>
            <Text style={styles.bannerSubtitle}>Explore community hubs, access resources & connect with neighbours.</Text>
          </View>
          <TouchableOpacity style={styles.claimButton} onPress={() => console.log('Claim tokens')}>
            <Text style={styles.claimButtonText}>Claim Free Tokens</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Connect & Explore</Text>
          <TouchableOpacity><Text style={styles.seeMore}>See More</Text></TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <CategoryCard title="Jobs & Gigs" icon={require('../../assets/bus.png')} backgroundColor="#E0F2FE" onPress={() => {}} />
          <CategoryCard title="Housing" icon={require('../../assets/london-bridge.png')} backgroundColor="#FEF3C7" onPress={() => {}} />
          <CategoryCard title="Community Events" icon={require('../../assets/london-eye.png')} backgroundColor="#DCFCE7" onPress={() => {}} />
          <CategoryCard title="Marriage Events" icon={require('../../assets/telephone-booth.png')} backgroundColor="#F3E8FF" onPress={() => {}} />
          <CategoryCard title="Marketplace" icon={require('../../assets/bus.png')} backgroundColor="#FEE2E2" onPress={() => {}} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity><Text style={styles.seeMore}>See More</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScroll}>
          <RecommendationCard 
            title="Bengali New Year Mela in London" 
            image={require('../../assets/westminister.png')} 
            durationBadge="3h 25min" 
            onPress={() => {}} 
          />
          <RecommendationCard 
            title="Professional Networking Mixer" 
            image={require('../../assets/westminister.png')} 
            durationBadge="4h 0min" 
            onPress={() => {}} 
          />
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 16, paddingBottom: 30 },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTextContainer: {
    marginBottom: 16, 
  },
  bannerWelcome: { fontSize: 12, fontFamily: 'ProximaNova-Bold', color: '#A7F3D0', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  bannerTitle: { fontSize: 18, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700', marginBottom: 6 },
  bannerSubtitle: { fontSize: 12, fontFamily: 'ProximaNova-Medium', color: '#E5E7EB', lineHeight: 17, marginBottom: 16 },
  claimButton: { backgroundColor: '#DC2626', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, alignSelf: 'flex-start' },
  claimButtonText: { color: '#FFFFFF', fontFamily: 'ProximaNova-Bold', fontSize: 12, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'ProximaNova-Bold', color: '#1F2937', fontWeight: '700' },
  seeMore: { fontSize: 13, fontFamily: 'ProximaNova-Bold', color: '#DC2626' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  recommendationScroll: { marginBottom: 20 },
});