import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecommendationCardProps {
  title: string;
  image: any;
  durationBadge: string;
  onPress: () => void;
}

export default function RecommendationCard({ title, image, durationBadge, onPress }: RecommendationCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardImageContainer}>
        <Image source={image} style={styles.recImage} resizeMode="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{durationBadge}</Text>
        </View>
      </View>
      <Text style={styles.recTitle} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 210, marginRight: 16, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cardImageContainer: { width: '100%', height: 110, borderRadius: 10, overflow: 'hidden', position: 'relative', marginBottom: 8 },
  recImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'ProximaNova-Bold' },
  recTitle: { fontSize: 13, fontFamily: 'ProximaNova-Bold', color: '#1F2937', fontWeight: '600', lineHeight: 18 },
});