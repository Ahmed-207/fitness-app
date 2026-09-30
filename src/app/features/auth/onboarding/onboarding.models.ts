import { Gender } from '../models/auth.models';

export type Goal =
  'Gain weight' | 'Lose weight' | 'Get fitter' | 'Improve flexibility' | 'Learn the basics';

export type ActivityLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

export type UnitSystem = 'metric' | 'imperial';

export interface OnboardingOption<T extends string = string> {
  value: T;
  label: string;
  detail: string;
}

export const GOAL_OPTIONS: readonly OnboardingOption<Goal>[] = [
  { value: 'Gain weight', label: 'ONBOARDING.GOAL_GAIN_WEIGHT', detail: '' },
  { value: 'Lose weight', label: 'ONBOARDING.GOAL_LOSE_WEIGHT', detail: '' },
  { value: 'Get fitter', label: 'ONBOARDING.GOAL_GET_FITTER', detail: '' },
  { value: 'Improve flexibility', label: 'ONBOARDING.GOAL_FLEXIBILITY', detail: '' },
  { value: 'Learn the basics', label: 'ONBOARDING.GOAL_BASICS', detail: '' },
];

export const ACTIVITY_OPTIONS: readonly OnboardingOption<ActivityLevel>[] = [
  { value: 'level1', label: 'ONBOARDING.LEVEL_ROOKIE', detail: '' },
  { value: 'level2', label: 'ONBOARDING.LEVEL_BEGINNER', detail: '' },
  { value: 'level3', label: 'ONBOARDING.LEVEL_INTERMEDIATE', detail: '' },
  { value: 'level4', label: 'ONBOARDING.LEVEL_ADVANCE', detail: '' },
  { value: 'level5', label: 'ONBOARDING.LEVEL_BEAST', detail: '' },
];

export interface OnboardingDraft {
  gender: Gender | null;
  age: number;
  weight: number;
  height: number;
  goal: Goal | null;
  activity: ActivityLevel | null;
}

export interface CompleteOnboardingDraft {
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  activity: ActivityLevel;
}
