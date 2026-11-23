import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalization } from '../../localization/LocalizationContext';
import { useNavigation } from '@react-navigation/native';

export type JobBrowseMode = 'standard' | 'quick-gigs';

interface JobsAndGigsHubScreenProps {
  onSelectMode: (mode: JobBrowseMode) => void;
  onPostPress?: () => void;
  onBack?: () => void;
}

const STANDARD_FONT = Platform.select({
  ios: 'ProximaNova-Medium',
  android: 'ProximaNova-Medium',
  default: 'ProximaNova-Medium',
});

const DISPLAY_FONT = Platform.select({
  ios: 'ProximaNova-Bold',
  android: 'ProximaNova-Bold',
  default: STANDARD_FONT,
});

export default function JobsAndGigsHubScreen({
  onSelectMode,
  onPostPress,
  onBack,
}: JobsAndGigsHubScreenProps) {
  const { t } = useLocalization();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Emerald Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}

          <Text style={styles.headerBrand}>Deshi Connect</Text>

          {onPostPress ? (
            <TouchableOpacity
              onPress={onPostPress}
              style={styles.postPill}
              activeOpacity={0.85}
            >
              <Text style={styles.postPillText}>{t('postButton')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>

        <Text style={styles.headerTitle}>{t('jobsAndGigs')}</Text>
        <Text style={styles.headerSubtitle}>{t('jobsHubSubtitle')}</Text>
      </View>

      {/* Selection Cards */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Option 1: Regular / Standard Jobs */}
        <TouchableOpacity
          style={[styles.optionCard, styles.standardCard]}
          activeOpacity={0.92}
          onPress={() => {navigation.navigate('JobsListing')}}
        >
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBadge, styles.standardIconBadge]}>
              <Text style={styles.iconEmoji}>💼</Text>
            </View>
            <View style={[styles.typeTag, styles.standardTag]}>
              <Text style={[styles.typeTagText, styles.standardTagText]}>
                {t('standardJobsBadge')}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>{t('jobsOptionTitle')}</Text>
          <Text style={styles.cardDescription}>{t('jobsOptionDescription')}</Text>

          <View style={styles.highlightsRow}>
            <View style={[styles.lightChip, styles.emeraldChip]}>
              <Text style={[styles.lightChipText, styles.emeraldChipText]}>
                {t('fullAndPartTime')}
              </Text>
            </View>
            <View style={[styles.lightChip, styles.skyChip]}>
              <Text style={[styles.lightChipText, styles.skyChipText]}>
                {t('studentFriendly')}
              </Text>
            </View>
            <View style={[styles.lightChip, styles.amberChip]}>
              <Text style={[styles.lightChipText, styles.amberChipText]}>
                {t('noExperienceOk')}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={[styles.ctaLabel, { color: '#064E3B' }]}>
              {t('browseJobsCta')}
            </Text>
            <Text style={[styles.ctaArrow, { color: '#064E3B' }]}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Option 2: Short-Term Jobs / Quick Gigs */}
        <TouchableOpacity
          style={[styles.optionCard, styles.gigCard]}
          activeOpacity={0.92}
          onPress={() => onSelectMode('quick-gigs')}
        >
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBadge, styles.gigIconBadge]}>
              <Text style={styles.iconEmoji}>⚡</Text>
            </View>
            <View style={[styles.typeTag, styles.gigTag]}>
              <Text style={[styles.typeTagText, styles.gigTagText]}>
                {t('quickGigsBadge')}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>{t('shortTermJobsTitle')}</Text>
          <Text style={styles.cardDescription}>
            {t('shortTermJobsDescription')}
          </Text>

          <View style={styles.highlightsRow}>
            <View style={[styles.lightChip, styles.crimsonChip]}>
              <Text style={[styles.lightChipText, styles.crimsonChipText]}>
                {t('fewHoursToOneDay')}
              </Text>
            </View>
            <View style={[styles.lightChip, styles.purpleChip]}>
              <Text style={[styles.lightChipText, styles.purpleChipText]}>
                {t('flexibleShifts')}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={[styles.ctaLabel, { color: '#DC2626' }]}>
              {t('browseShortTermJobsCta')}
            </Text>
            <Text style={[styles.ctaArrow, { color: '#DC2626' }]}>→</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 36,
    height: 36,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
  },
  headerBrand: {
    color: '#D1FAE5',
    fontSize: 14,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  postPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  postPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: STANDARD_FONT,
    fontWeight: '400',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  standardCard: {
    borderColor: '#A7F3D0',
  },
  gigCard: {
    borderColor: '#FECACA',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardIconBadge: {
    backgroundColor: '#ECFDF5',
  },
  gigIconBadge: {
    backgroundColor: '#FEF2F2',
  },
  iconEmoji: {
    fontSize: 22,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  standardTag: {
    backgroundColor: '#D1FAE5',
  },
  gigTag: {
    backgroundColor: '#FEE2E2',
  },
  typeTagText: {
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
  },
  standardTagText: {
    color: '#064E3B',
  },
  gigTagText: {
    color: '#DC2626',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: STANDARD_FONT,
    fontWeight: '400',
    color: '#475569',
    marginBottom: 14,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  lightChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  lightChipText: {
    fontSize: 12,
    fontFamily: DISPLAY_FONT,
    fontWeight: '900',
  },
  emeraldChip: {
    backgroundColor: '#ECFDF5',
  },
  emeraldChipText: {
    color: '#047857',
  },
  skyChip: {
    backgroundColor: '#E0F2FE',
  },
  skyChipText: {
    color: '#0369A1',
  },
  amberChip: {
    backgroundColor: '#FEF3C7',
  },
  amberChipText: {
    color: '#B45309',
  },
  crimsonChip: {
    backgroundColor: '#FEF2F2',
  },
  crimsonChipText: {
    color: '#B91C1C',
  },
  purpleChip: {
    backgroundColor: '#F3E8FF',
  },
  purpleChipText: {
    color: '#7E22CE',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ctaLabel: {
    fontSize: 15,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
  },
  ctaArrow: {
    fontSize: 18,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
  },
});