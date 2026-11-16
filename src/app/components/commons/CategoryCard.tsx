import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  title: string;
  icon: any;
  onPress: () => void;
  backgroundColor?: string;
}

export default function CategoryCard({ title, icon, onPress, backgroundColor = '#E0F2FE' }: CategoryCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress} activeOpacity={0.8}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 12,
  },
  icon: { width: 32, height: 32, marginBottom: 8 },
  title: { fontSize: 12, fontFamily: 'ProximaNova-Bold', color: '#1F2937', textAlign: 'center', fontWeight: '600' },
});