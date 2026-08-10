import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F7F4F1',
  surface: '#FFFFFF',
  text: '#262322',
  mutedText: '#9A8F89',
  outsideText: '#C9C1BD',
  primary: '#D87578',
  primarySoft: '#F5DDDD',
  primaryBorder: '#ECC4C5',
  border: '#E7E0DC',
  darkTag: '#4B403D',
  darkTagText: '#F7F2F0',
};

type CalendarDay = {
  day: number;
  outside?: boolean;
  selected?: boolean;
  hasSchedule?: boolean;
};

type ScheduleItem = {
  day: string;
  weekday: string;
  title: string;
  category: '일반' | '지출';
  time: string;
  place: string;
  price?: string;
  highlighted?: boolean;
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const INITIAL_YEAR = 2026;
const INITIAL_MONTH_INDEX = 7;
const SCHEDULE_DAYS = new Set([8, 12, 19, 27]);

const SCHEDULES: ScheduleItem[] = [
  {
    day: '04',
    weekday: '오늘',
    title: '웨딩홀 최종 상담',
    category: '일반',
    time: '14:00–15:30',
    place: '라온제나 웨딩홀',
    highlighted: true,
  },
  {
    day: '08',
    weekday: '토',
    title: '스튜디오 잔금 결제',
    category: '지출',
    time: '8월 8일 · 11:00',
    place: '무드앤빛 스튜디오',
    price: '· 120만원',
  },
  {
    day: '12',
    weekday: '수',
    title: '메이크업 리허설',
    category: '일반',
    time: '8월 12일 · 13:30–15:00',
    place: '아뜰리에 이브',
  },
];

export function ScheduleScreen() {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(INITIAL_YEAR, INITIAL_MONTH_INDEX, 1),
  );
  const isInitialMonth =
    visibleMonth.getFullYear() === INITIAL_YEAR &&
    visibleMonth.getMonth() === INITIAL_MONTH_INDEX;

  const moveMonth = (offset: number) => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>우리의 일정</Text>
            <Text style={styles.pageDescription}>결혼식까지 중요한 날을 차근차근 기록해요</Text>
          </View>
          <View style={styles.ddayBadge}>
            <Text style={styles.ddayText}>D-257</Text>
          </View>
        </View>

        <CalendarCard
          monthIndex={visibleMonth.getMonth()}
          onNextMonth={() => moveMonth(1)}
          onPreviousMonth={() => moveMonth(-1)}
          year={visibleMonth.getFullYear()}
        />

        {isInitialMonth ? (
          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>8월 4일 화요일</Text>
                <Text style={styles.sectionDescription}>가까운 일정 3개</Text>
              </View>
            </View>

            <View style={styles.scheduleList}>
              {SCHEDULES.map((schedule) => (
                <ScheduleCard key={`${schedule.day}-${schedule.title}`} schedule={schedule} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Pressable
        accessibilityLabel="일정 추가"
        accessibilityRole="button"
        style={({ pressed }) => [styles.floatingButton, pressed && styles.pressed]}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function CalendarCard({
  year,
  monthIndex,
  onPreviousMonth,
  onNextMonth,
}: {
  year: number;
  monthIndex: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}) {
  const calendarWeeks = useMemo(
    () => buildCalendarWeeks(year, monthIndex),
    [monthIndex, year],
  );

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>{`${year}년 ${monthIndex + 1}월`}</Text>
        <View style={styles.monthControls}>
          <Pressable
            accessibilityLabel="이전 달"
            accessibilityRole="button"
            onPress={onPreviousMonth}
            style={({ pressed }) => [styles.monthButton, pressed && styles.monthButtonPressed]}
          >
            <Text style={styles.monthButtonText}>‹</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="다음 달"
            accessibilityRole="button"
            onPress={onNextMonth}
            style={({ pressed }) => [styles.monthButton, pressed && styles.monthButtonPressed]}
          >
            <Text style={styles.monthButtonText}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((weekday, index) => (
          <Text key={weekday} style={[styles.weekday, index === 0 && styles.sundayText]}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarWeeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.calendarRow}>
            {week.map((date, dayIndex) => (
              <View
                key={`${weekIndex}-${dayIndex}`}
                style={[styles.dayCell, date.selected && styles.selectedDay]}
              >
                <Text
                  style={[
                    styles.dayText,
                    dayIndex === 0 && !date.outside && styles.sundayText,
                    date.outside && styles.outsideDayText,
                    date.selected && styles.selectedDayText,
                  ]}
                >
                  {date.day}
                </Text>
                {date.hasSchedule ? <View style={styles.scheduleDot} /> : null}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function buildCalendarWeeks(year: number, monthIndex: number): CalendarDay[][] {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const firstGridDate = new Date(year, monthIndex, 1 - firstWeekday);
  const isInitialMonth = year === INITIAL_YEAR && monthIndex === INITIAL_MONTH_INDEX;
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      firstGridDate.getFullYear(),
      firstGridDate.getMonth(),
      firstGridDate.getDate() + index,
    );
    const isCurrentMonth = date.getFullYear() === year && date.getMonth() === monthIndex;

    return {
      day: date.getDate(),
      outside: !isCurrentMonth,
      selected: isInitialMonth && isCurrentMonth && date.getDate() === 4,
      hasSchedule:
        isInitialMonth && isCurrentMonth && SCHEDULE_DAYS.has(date.getDate()),
    };
  });

  return Array.from({ length: 6 }, (_, weekIndex) =>
    days.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
}

function ScheduleCard({ schedule }: { schedule: ScheduleItem }) {
  return (
    <View style={[styles.scheduleCard, schedule.highlighted && styles.highlightedScheduleCard]}>
      <View style={[styles.dateBadge, schedule.highlighted && styles.highlightedDateBadge]}>
        <Text style={[styles.dateNumber, schedule.highlighted && styles.highlightedDateText]}>
          {schedule.day}
        </Text>
        <Text style={[styles.dateWeekday, schedule.highlighted && styles.highlightedDateText]}>
          {schedule.weekday}
        </Text>
      </View>

      <View style={styles.scheduleContent}>
        <View style={styles.scheduleTitleRow}>
          <Text numberOfLines={1} style={styles.scheduleTitle}>
            {schedule.title}
          </Text>
          <View style={[styles.categoryBadge, schedule.category === '지출' && styles.expenseBadge]}>
            <Text style={[styles.categoryText, schedule.category === '지출' && styles.expenseText]}>
              {schedule.category}
            </Text>
          </View>
        </View>

        <Text style={styles.scheduleMeta}>◷  {schedule.time}</Text>
        <View style={styles.placeRow}>
          <Text numberOfLines={1} style={styles.scheduleMeta}>⌖  {schedule.place}</Text>
          {schedule.price ? <Text style={styles.priceText}>{schedule.price}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 504,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 110,
  },
  pageHeader: {
    height: 70,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
  },
  pageDescription: {
    marginTop: 2,
    color: COLORS.mutedText,
    fontSize: 12,
  },
  ddayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
  },
  ddayText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  calendarCard: {
    marginTop: 20,
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    shadowColor: '#3D302B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  calendarHeader: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  monthControls: {
    flexDirection: 'row',
    gap: 4,
  },
  monthButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  monthButtonPressed: {
    backgroundColor: COLORS.background,
  },
  monthButtonText: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 28,
  },
  weekdayRow: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekday: {
    flex: 1,
    color: COLORS.mutedText,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sundayText: {
    color: COLORS.primary,
  },
  calendarGrid: {
    gap: 1,
  },
  calendarRow: {
    height: 48,
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 24,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  outsideDayText: {
    color: COLORS.outsideText,
  },
  selectedDayText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  scheduleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  scheduleSection: {
    marginTop: 24,
  },
  sectionHeader: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionDescription: {
    marginTop: 2,
    color: COLORS.mutedText,
    fontSize: 11,
  },
  scheduleList: {
    gap: 9,
  },
  scheduleCard: {
    height: 104,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    shadowColor: '#3D302B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  highlightedScheduleCard: {
    borderColor: COLORS.primaryBorder,
    backgroundColor: COLORS.primarySoft,
  },
  dateBadge: {
    width: 48,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 10,
    backgroundColor: COLORS.background,
  },
  highlightedDateBadge: {
    backgroundColor: COLORS.surface,
  },
  dateNumber: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  dateWeekday: {
    color: COLORS.mutedText,
    fontSize: 10,
    fontWeight: '600',
  },
  highlightedDateText: {
    color: COLORS.primary,
  },
  scheduleContent: {
    flex: 1,
    gap: 5,
  },
  scheduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  scheduleTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
  },
  categoryText: {
    color: COLORS.mutedText,
    fontSize: 10,
    fontWeight: '600',
  },
  expenseBadge: {
    borderColor: COLORS.darkTag,
    backgroundColor: COLORS.darkTag,
  },
  expenseText: {
    color: COLORS.darkTagText,
  },
  scheduleMeta: {
    color: COLORS.mutedText,
    fontSize: 11,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    shadowColor: '#8B4545',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  floatingButtonText: {
    marginTop: -2,
    color: COLORS.surface,
    fontSize: 34,
    fontWeight: '300',
  },
  pressed: {
    opacity: 0.82,
  },
});
