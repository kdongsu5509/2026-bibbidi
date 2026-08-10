import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ONBOARDING_SLIDES, type OnboardingSlide } from './onboarding-slides';

const COLORS = {
  background: '#F7F4F1',
  text: '#262322',
  mutedText: '#9A8F89',
  primary: '#D87578',
  inactiveDot: '#E7E0DC',
  placeholder: '#F0E9E5',
  placeholderBorder: '#DED3CD',
  white: '#FFFFFF',
};

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(Math.max(0, Math.min(nextIndex, ONBOARDING_SLIDES.length - 1)));
    },
    [width],
  );

  const handleStart = useCallback(() => {
    router.push('/schedule');
  }, [router]);

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlide }) => (
      <View style={[styles.slide, { width }]}>
        <View style={styles.messageArea}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.illustrationArea}>
          {item.image ? (
            <Image
              accessibilityLabel={item.imageLabel}
              resizeMode="cover"
              source={item.image}
              style={styles.illustration}
            />
          ) : (
            <View accessibilityLabel={item.imageLabel} style={styles.imagePlaceholder}>
              <View style={styles.placeholderMark}>
                <Text style={styles.placeholderMarkText}>B</Text>
              </View>
              <Text style={styles.placeholderText}>일러스트 이미지가 들어갈 영역</Text>
            </View>
          )}
        </View>
      </View>
    ),
    [width],
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <View accessibilityLabel={`${activeIndex + 1} / ${ONBOARDING_SLIDES.length} 페이지`} style={styles.pagination}>
          {ONBOARDING_SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === activeIndex ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>

        <FlatList
          ref={listRef}
          bounces={false}
          data={ONBOARDING_SLIDES}
          horizontal
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleScrollEnd}
          pagingEnabled
          renderItem={renderSlide}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={handleStart}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
          >
            <Text style={styles.startButtonText}>비비디 시작하기</Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>이미 계정이 있나요?</Text>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  pagination: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 7,
    height: 7,
    backgroundColor: COLORS.inactiveDot,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageArea: {
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 35,
    textAlign: 'center',
  },
  description: {
    color: COLORS.mutedText,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    textAlign: 'center',
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  illustration: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: 520,
  },
  imagePlaceholder: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: 520,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.placeholderBorder,
    borderRadius: 28,
    backgroundColor: COLORS.placeholder,
  },
  placeholderMark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  placeholderMarkText: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
  },
  placeholderText: {
    marginTop: 14,
    color: COLORS.mutedText,
    fontSize: 13,
  },
  footer: {
    height: 118,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  startButton: {
    width: '100%',
    maxWidth: 360,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  loginRow: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  loginPrompt: {
    color: COLORS.mutedText,
    fontSize: 11,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});
