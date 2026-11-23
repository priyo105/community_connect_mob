import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocalization } from '../../localization/LocalizationContext';
import { JobItem, JobQueryParams, jobsService } from '../api/jobService';

export type DateFilterKey = 'all' | 'today' | '3d' | '7d' | '30d';
export type SortOptionKey = 'newest' | 'oldest' | 'title';

type JobsStackParamList = {
  JobsListing: { mode?: 'standard' | 'quick-gigs' };
  JobDetail: { job: JobItem };
  PostJob: { mode?: 'standard' | 'quick-gigs' };
};

interface JobsListingScreenProps {
  mode?: 'standard' | 'quick-gigs';
  onBack?: () => void;
  onPostPress?: (mode: 'standard' | 'quick-gigs') => void;
  onSelectJob?: (job: JobItem) => void;
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

const ROLE_FILTERS = [
  { key: 'All', labelKey: 'roleAll' },
  { key: 'Waiter', labelKey: 'roleWaiter' },
  { key: 'Barista', labelKey: 'roleBarista' },
  { key: 'Driver', labelKey: 'roleDriver' },
  { key: 'IT', labelKey: 'roleIT' },
  { key: 'Chef', labelKey: 'roleChef' },
  { key: 'Cleaner', labelKey: 'roleCleaner' },
  { key: 'Warehouse', labelKey: 'roleWarehouse' },
] as const;

const DATE_SORT_OPTIONS = [
  { key: 'today', labelKey: 'dateToday' },
  { key: '3d', labelKey: 'dateLast3Days' },
  { key: '7d', labelKey: 'dateLast7Days' },
  { key: '30d', labelKey: 'dateLastMonth' },
] as const;

function getCutoffTimestamp(dateFilter: DateFilterKey): number | null {
  if (dateFilter === 'all') return null;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  if (dateFilter === 'today') return now - dayMs;
  if (dateFilter === '3d') return now - 3 * dayMs;
  if (dateFilter === '7d') return now - 7 * dayMs;
  if (dateFilter === '30d') return now - 30 * dayMs;
  return null;
}

function stripHtmlToPreview(html?: string, maxLength = 130): string {
  if (!html) return '';

  const plainText = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const sliced = plainText.slice(0, maxLength).trim();
  const lastSpace = sliced.lastIndexOf(' ');
  return `${lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced}…`;
}

export default function JobsListingScreen({
  mode: propMode,
  onBack,
  onPostPress,
  onSelectJob,
}: JobsListingScreenProps) {
  const { t } = useLocalization();
  const navigation = useNavigation<NativeStackNavigationProp<JobsStackParamList>>();
  const route = useRoute<RouteProp<JobsStackParamList, 'JobsListing'>>();

  const mode = propMode ?? route.params?.mode ?? 'standard';
  const isGigsMode = mode === 'quick-gigs';

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search, Role Pills, Date & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<DateFilterKey>('all');
  const [sortBy, setSortBy] = useState<SortOptionKey>('newest');

  // Active Filter State (sent as query params to API)
  const [studentFriendlyOnly, setStudentFriendlyOnly] = useState(false);
  const [noExperienceOnly, setNoExperienceOnly] = useState(false);
  const [cityFilter, setCityFilter] = useState('');

  // Modal Draft State
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [draftStudentOnly, setDraftStudentOnly] = useState(false);
  const [draftNoExpOnly, setDraftNoExpOnly] = useState(false);
  const [draftCity, setDraftCity] = useState('');
  const [draftSortBy, setDraftSortBy] = useState<SortOptionKey>('newest');

  const fetchJobs = useCallback(
    async ({
      targetPage = 1,
      isRefresh = false,
      isLoadMore = false,
    }: {
      targetPage?: number;
      isRefresh?: boolean;
      isLoadMore?: boolean;
    } = {}) => {
      try {
        if (isRefresh) setRefreshing(true);
        else if (isLoadMore) setLoadingMore(true);
        else setLoading(true);
        setError(null);

        const params: JobQueryParams = {
          page: targetPage,
          limit: 10,
        };

        if (cityFilter.trim()) {
          params.ukCity = cityFilter.trim();
        }
        if (studentFriendlyOnly) {
          params.isStudentFriendly = true;
        }
        if (noExperienceOnly) {
          params.noExperienceRequired = true;
        }

        const rawResponse: any = isGigsMode
          ? await jobsService.getQuickGigs(params)
          : await jobsService.getStandardJobs(params);

        const payload = rawResponse?.data?.jobs ? rawResponse.data : rawResponse;
        const fetchedList: JobItem[] = Array.isArray(payload)
          ? payload
          : payload?.jobs || [];
        const pagination = payload?.pagination;

        setPage(pagination?.page || targetPage);
        setTotalPages(pagination?.pages || 1);

        if (isLoadMore && targetPage > 1) {
          setJobs((prev) => {
            const seenIds = new Set(prev.map((item) => item._id));
            const uniqueNext = fetchedList.filter((item) => !seenIds.has(item._id));
            return [...prev, ...uniqueNext];
          });
        } else {
          setJobs(fetchedList);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            t('noJobsFound')
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [cityFilter, isGigsMode, noExperienceOnly, studentFriendlyOnly, t]
  );

  useEffect(() => {
    fetchJobs({ targetPage: 1 });
  }, [fetchJobs]);

  const handleEndReached = () => {
    if (!loading && !loadingMore && page < totalPages && !error) {
      fetchJobs({ targetPage: page + 1, isLoadMore: true });
    }
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCardPress = (job: JobItem) => {
    if (onSelectJob) {
      onSelectJob(job);
    } else {
      navigation.navigate('JobDetail', { job });
    }
  };

  const handleFabPress = () => {
    if (onPostPress) {
      onPostPress(mode);
    } else {
      navigation.navigate('PostJob', { mode });
    }
  };

  const openFilterModal = () => {
    setDraftStudentOnly(studentFriendlyOnly);
    setDraftNoExpOnly(noExperienceOnly);
    setDraftCity(cityFilter);
    setDraftSortBy(sortBy);
    setFilterModalVisible(true);
  };

  const handleApplyFilters = () => {
    setStudentFriendlyOnly(draftStudentOnly);
    setNoExperienceOnly(draftNoExpOnly);
    setCityFilter(draftCity.trim());
    setSortBy(draftSortBy);
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setDraftStudentOnly(false);
    setDraftNoExpOnly(false);
    setDraftCity('');
    setDraftSortBy('newest');

    setStudentFriendlyOnly(false);
    setNoExperienceOnly(false);
    setCityFilter('');
    setSortBy('newest');
    setSelectedRole('All');
    setDateFilter('all');
    setSearchQuery('');
    setFilterModalVisible(false);
  };

  const activeFilterCount =
    (studentFriendlyOnly ? 1 : 0) +
    (noExperienceOnly ? 1 : 0) +
    (cityFilter.trim().length > 0 ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  const displayedJobs = useMemo(() => {
    const cutoff = getCutoffTimestamp(dateFilter);
    const queryLower = searchQuery.trim().toLowerCase();

    return jobs
      .filter((job) => {
        if (queryLower) {
          const titleMatch = (job.title || '').toLowerCase().includes(queryLower);
          const companyMatch = (job.companyName || '').toLowerCase().includes(queryLower);
          const descMatch = stripHtmlToPreview(job.description, 500)
            .toLowerCase()
            .includes(queryLower);
          const cityMatch = (job.ukCity || '').toLowerCase().includes(queryLower);
          if (!titleMatch && !companyMatch && !descMatch && !cityMatch) return false;
        }

        if (selectedRole !== 'All') {
          const roleLower = selectedRole.toLowerCase();
          const titleMatch = (job.title || '').toLowerCase().includes(roleLower);
          const descMatch = stripHtmlToPreview(job.description, 500)
            .toLowerCase()
            .includes(roleLower);
          const catMatch =
            typeof job.category === 'string' &&
            job.category.toLowerCase().includes(roleLower);
          if (!titleMatch && !descMatch && !catMatch) return false;
        }

        if (cutoff !== null && job.createdAt) {
          const createdMs = new Date(job.createdAt).getTime();
          if (!Number.isNaN(createdMs) && createdMs < cutoff) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
      });
  }, [dateFilter, jobs, searchQuery, selectedRole, sortBy]);

  const renderJobCard = ({ item }: { item: JobItem }) => {
    const payLabel = item.salaryRange || t('competitivePay');
    const cityLabel = item.ukCity || t('ukLocationFallback');
    const descriptionPreview = stripHtmlToPreview(item.description, 130);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleWrap}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.companyName ? (
              <Text style={styles.companyName} numberOfLines={1}>
                {item.companyName}
              </Text>
            ) : null}
          </View>
          <Text style={styles.cityText}>{cityLabel}</Text>
        </View>

        {descriptionPreview ? (
          <Text style={styles.description} numberOfLines={2}>
            {descriptionPreview}
          </Text>
        ) : null}

        {/* Light-Background Colorful Tags */}
        <View style={styles.tagsRow}>
          <View style={[styles.lightTag, styles.salaryTag]}>
            <Text style={[styles.lightTagText, styles.salaryTagText]}>
              {payLabel}
            </Text>
          </View>

          {item.isStudentFriendly ? (
            <View style={[styles.lightTag, styles.studentTag]}>
              <Text style={[styles.lightTagText, styles.studentTagText]}>
                {t('studentFriendly')}
              </Text>
            </View>
          ) : null}

          {item.noExperienceRequired ? (
            <View style={[styles.lightTag, styles.noExpTag]}>
              <Text style={[styles.lightTagText, styles.noExpTagText]}>
                {t('noExperienceRequired')}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Emerald Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isGigsMode ? t('shortTermJobsTitle') : t('jobsOptionTitle')}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchBox}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              isGigsMode
                ? t('searchShortTermJobsPlaceholder')
                : t('searchRegularJobsPlaceholder')
            }
            placeholderTextColor="#64748B"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* White Surface: Horizontal Role Tabs + Date Sorting + Filter Trigger */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roleScroll}
        >
          {ROLE_FILTERS.map((role) => {
            const isSelected = selectedRole === role.key;
            return (
              <TouchableOpacity
                key={role.key}
                style={[styles.rolePill, isSelected && styles.rolePillSelected]}
                onPress={() => setSelectedRole(role.key)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    isSelected && styles.rolePillTextSelected,
                  ]}
                >
                  {t(role.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sortFilterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
            contentContainerStyle={styles.dateScrollContent}
          >
            {DATE_SORT_OPTIONS.map((opt) => {
              const isSelected = dateFilter === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                  onPress={() =>
                    setDateFilter((prev) => (prev === opt.key ? 'all' : opt.key))
                  }
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      isSelected && styles.dateChipTextSelected,
                    ]}
                  >
                    {t(opt.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              activeFilterCount > 0 && styles.filterBtnActive,
            ]}
            onPress={openFilterModal}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterBtnText,
                activeFilterCount > 0 && styles.filterBtnTextActive,
              ]}
            >
              {t('filterButton')}
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Job / Gig Feed */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color="#064E3B" />
          <Text style={styles.centerText}>{t('loadingJobs')}</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchJobs({ targetPage: 1 })}
          >
            <Text style={styles.retryBtnText}>{t('retryButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayedJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.35}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchJobs({ targetPage: 1, isRefresh: true })}
              tintColor="#064E3B"
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#064E3B" />
              </View>
            ) : undefined
          }
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Text style={styles.centerText}>{t('noJobsFound')}</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (FAB) for Posting */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.88}
        onPress={handleFabPress}
      >
        <Text style={styles.fabPlus}>+</Text>
        <Text style={styles.fabLabel}>
          {isGigsMode ? t('postGig') : t('postJob')}
        </Text>
      </TouchableOpacity>

      {/* Filter & Sort Modal View */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('filterAndSortTitle')}</Text>
              <TouchableOpacity onPress={handleResetFilters}>
                <Text style={styles.resetBtnText}>{t('resetButton')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{t('ukLocationFallback')}</Text>
            <TextInput
              value={draftCity}
              onChangeText={setDraftCity}
              placeholder="e.g. London, Birmingham, Manchester"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
            />

            <Text style={styles.inputLabel}>{t('sortByLabel')}</Text>
            <View style={styles.sortChipsRow}>
              {(
                [
                  { key: 'newest', label: 'Newest' },
                  { key: 'oldest', label: 'Oldest' },
                  { key: 'title', label: 'A – Z' },
                ] as const
              ).map((option) => {
                const selected = draftSortBy === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOptionChip,
                      selected && styles.sortOptionChipSelected,
                    ]}
                    onPress={() => setDraftSortBy(option.key)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        selected && styles.sortOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.checkRow,
                draftStudentOnly && styles.checkRowSelected,
              ]}
              onPress={() => setDraftStudentOnly((prev) => !prev)}
            >
              <Text style={styles.checkLabel}>{t('studentFriendly')}</Text>
              <Text style={styles.checkIcon}>{draftStudentOnly ? '✓' : ''}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkRow,
                draftNoExpOnly && styles.checkRowSelected,
              ]}
              onPress={() => setDraftNoExpOnly((prev) => !prev)}
            >
              <Text style={styles.checkLabel}>{t('noExperienceRequired')}</Text>
              <Text style={styles.checkIcon}>{draftNoExpOnly ? '✓' : ''}</Text>
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyBtnText}>{t('applyFiltersButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 34,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    paddingLeft: 8,
  },
  clearBtnText: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
    color: '#64748B',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 10,
    paddingBottom: 10,
  },
  roleScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolePillSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  rolePillText: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#334155',
  },
  rolePillTextSelected: {
    color: '#FFFFFF',
  },
  sortFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  dateScroll: {
    flex: 1,
  },
  dateScrollContent: {
    gap: 6,
    paddingRight: 4,
  },
  dateChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#064E3B',
  },
  dateChipText: {
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#475569',
  },
  dateChipTextSelected: {
    color: '#064E3B',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  filterBtnText: {
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterBtnTextActive: {
    color: '#DC2626',
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  cardTitleWrap: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
    color: '#0F172A',
  },
  companyName: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  cityText: {
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#64748B',
  },
  description: {
    fontSize: 11,
    lineHeight: 19,
    fontFamily: STANDARD_FONT,
    color: 'black',
    marginTop: 4,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lightTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  lightTagText: {
    fontSize: 12,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
  },
  salaryTag: {
    backgroundColor: '#ECFDF5',
  },
  salaryTagText: {
    color: '#047857',
  },
  studentTag: {
    backgroundColor: '#E0F2FE',
  },
  studentTagText: {
    color: '#0369A1',
  },
  noExpTag: {
    backgroundColor: '#FEF3C7',
  },
  noExpTagText: {
    color: '#B45309',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 999,
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPlus: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    color: '#64748B',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: DISPLAY_FONT,
    fontWeight: '700',
    color: '#0F172A',
  },
  resetBtnText: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
    color: '#DC2626',
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    color: '#0F172A',
    marginBottom: 14,
  },
  sortChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  sortOptionChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  sortOptionChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#064E3B',
  },
  sortOptionText: {
    fontSize: 13,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#475569',
  },
  sortOptionTextSelected: {
    color: '#064E3B',
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  checkRowSelected: {
    borderColor: '#064E3B',
    backgroundColor: '#ECFDF5',
  },
  checkLabel: {
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#0F172A',
  },
  checkIcon: {
    fontSize: 15,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
    color: '#064E3B',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    fontWeight: '600',
    color: '#475569',
  },
  applyBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: STANDARD_FONT,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});