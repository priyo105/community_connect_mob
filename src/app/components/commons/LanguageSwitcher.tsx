import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalization } from '../../../localization/LocalizationContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocalization();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'bn' : 'en');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleLanguage} activeOpacity={0.8}>
      <Text style={[styles.text, locale === 'en' && styles.activeText]}>EN</Text>
      <View style={styles.divider} />
      <Text style={[styles.text, locale === 'bn' && styles.activeText]}>বাং</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    fontSize: 11,
    fontFamily: 'ProximaNova-Bold',
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  activeText: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
  },
});