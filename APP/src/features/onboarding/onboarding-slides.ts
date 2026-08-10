import type { ImageSourcePropType } from 'react-native';

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  imageLabel: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'schedule',
    title: '흩어진 결혼 준비,\n일정으로 한눈에',
    description: '둘의 중요한 날짜와 해야 할 일을 함께 확인해요.',
    imageLabel: '결혼 준비 일정을 함께 확인하는 커플 일러스트',
    image: require('../../../assets/images/onboarding/onboarding-1.png'),
  },
  {
    id: 'quick-add',
    title: '해야 할 일은,\n날짜만 골라 빠르게',
    description: '몇 번의 터치로 일정을 추가하고 정리할 수 있어요.',
    imageLabel: '결혼 준비 일정을 빠르게 추가하는 커플 일러스트',
    image: require('../../../assets/images/onboarding/onboarding-2.png'),
  },
  {
    id: 'reminder',
    title: '중요한 순간은,\n비비디가 미리 알려드려요',
    description: '다가오는 일정과 준비할 일을 놓치지 않도록 알려드려요.',
    imageLabel: '결혼 준비 일정 알림을 확인하는 커플 일러스트',
    image: require('../../../assets/images/onboarding/onboarding-3.png'),
  },
];
