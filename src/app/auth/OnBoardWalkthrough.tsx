import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to Deshi Connect',
    subtitle: 'Your digital home for British-Bangladeshis. Discover local hubs, events, resources, and connect with your community.',
    image: require('../../assets/nm.png'), // Or your illustrative graphic asset
  },
  {
    id: '2',
    title: 'Your Connection to the UK',
    subtitle: 'Find local hubs, discover career opportunities, and join events right where you live across the UK.',
    image: require('../../assets/london_city.png'),
  },
  {
    id: '3',
    title: 'Unlock Opportunities & Build Community',
    subtitle: 'Connect with mentors, explore housing and jobs, and celebrate your culture together.',
    image: require('../../assets/waveflag.png'),
  },
];

interface OnboardingWalkthroughProps {
  onFinishWalkthrough: () => void;
}

export default function OnboardingWalkthrough({ onFinishWalkthrough }: OnboardingWalkthroughProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onFinishWalkthrough();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#FFF1F2', '#FFFFFF']}
        locations={[0, 0.4, 0.8]}
        style={styles.gradientBackground}
      />
      <StatusBar barStyle="dark-content" />

      {/* Skip Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onFinishWalkthrough}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.illustration} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Footer / Pagination & Action Button */}
      <View style={styles.footerContainer}>
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
          <Text style={styles.actionButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  gradientBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  headerRow: { alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 12 },
  skipText: { fontSize: 14, fontFamily: 'ProximaNova-Bold', color: '#6B7280' },
  slide: { width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, marginTop: 40 },
  illustration: { width: 300, height: 300, marginBottom: 40 },
  title: { fontSize: 24, fontFamily: 'ProximaNova-Bold', color: '#064E3B', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, fontFamily: 'ProximaNova-Medium', color: '#4B5563', textAlign: 'center', lineHeight: 22 },
  footerContainer: { paddingHorizontal: 24, paddingBottom: 36 },
  paginationRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 24, backgroundColor: '#064E3B' },
  inactiveDot: { width: 8, backgroundColor: '#D1D5DB' },
  actionButton: { width: '100%', height: 48, backgroundColor: '#064E3B', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionButtonText: { fontSize: 15, fontFamily: 'ProximaNova-Bold', color: '#FFFFFF', fontWeight: '700' },
});