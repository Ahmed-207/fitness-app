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
  { value: 'Gain weight', label: 'Gain Weight', detail: '' },
  { value: 'Lose weight', label: 'Lose Weight', detail: '' },
  { value: 'Get fitter', label: 'Get Fitter', detail: '' },
  { value: 'Improve flexibility', label: 'Gain More Flexible', detail: '' },
  { value: 'Learn the basics', label: 'Learn The Basic', detail: '' },
];

export const ACTIVITY_OPTIONS: readonly OnboardingOption<ActivityLevel>[] = [
  { value: 'level1', label: 'Rookie', detail: '' },
  { value: 'level2', label: 'Beginner', detail: 'I train occasionally' },
  { value: 'level3', label: 'Intermediate', detail: 'I train a few times a week' },
  { value: 'level4', label: 'Advance', detail: '' },
  { value: 'level5', label: 'True Beast', detail: '' },
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
