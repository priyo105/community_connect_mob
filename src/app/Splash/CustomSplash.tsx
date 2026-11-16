import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

export default function CustomSplashScreen({ onFinish }: { onFinish?: () => void }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  const [fontsLoaded] = useFonts({
    'ProximaNova-Bold': require('../../../assets/fonts/ProximaNova-Bold.ttf'),
    'ProximaNova-Medium': require('../../../assets/fonts/ProximaNova-Medium.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 12, stiffness: 90 });

    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer); 
  }, [onFinish]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Premium subtle gradient background matching your brand colors */}
      <LinearGradient
        colors={['#F0FDF4', '#FFF1F2', '#FFFFFF']}
        locations={[0, 0.4, 0.8]}
        style={styles.gradientBackground}
      />

      <StatusBar barStyle="dark-content"   />

      <Animated.View style={[styles.contentContainer, animatedStyle]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          alt=''
        />

        <View style={styles.titleRow}>
          <Text style={styles.brandPrimary}>Deshi </Text>
          <Text style={styles.brandAccent}>Connect</Text>
        </View>

        <Text style={styles.tagline}>Stay connected with Bengali community in UK</Text>

        <View style={styles.iconRow}>
          <Image source={require('../../assets/bus.png')} style={styles.smallIcon} resizeMode="contain" alt='' />
          <Image source={require('../../assets/london-bridge.png')} style={styles.smallIcon} resizeMode="contain" alt='' />
          <Image source={require('../../assets/london-eye.png')} style={styles.smallIcon} resizeMode="contain" alt='' />
          <Image source={require('../../assets/telephone-booth.png')} style={styles.smallIcon} resizeMode="contain" alt='' />
        </View>
      </Animated.View>

      <Image
        source={require('../../assets/westminister.png')}
        style={styles.bottomGraphic}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 2,
  },
  bottomGraphic: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.25,
    width: '100%',
    height: 250,
    zIndex: 1,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandPrimary: {
    fontSize: 32,
    fontFamily: 'ProximaNova-Bold',
    fontWeight: '700',
    color: '#064E3B',
    letterSpacing: -0.5,
  },
  brandAccent: {
    fontSize: 32,
    fontFamily: 'ProximaNova-Bold',
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Medium',
    color: '#4B5563',
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 24,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '70%',
    marginTop: '10%',
  },
  smallIcon: {
    width: 36,
    height: 36,
    opacity: 0.8,
  },
});