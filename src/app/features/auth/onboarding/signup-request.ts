import { SignUpRequest } from '../models/auth.models';
import { AccountCredentials } from '../register/account-credentials';
import {
  AGE_MAX,
  AGE_MIN,
  HEIGHT_CM_MAX,
  HEIGHT_CM_MIN,
  WEIGHT_KG_MAX,
  WEIGHT_KG_MIN,
} from './measurement';
import { CompleteOnboardingDraft, OnboardingDraft } from './onboarding.models';

export function isCompleteOnboardingDraft(
  draft: OnboardingDraft,
): draft is CompleteOnboardingDraft {
  return (
    draft.gender !== null &&
    draft.age >= AGE_MIN &&
    draft.age <= AGE_MAX &&
    draft.weight >= WEIGHT_KG_MIN &&
    draft.weight <= WEIGHT_KG_MAX &&
    draft.height >= HEIGHT_CM_MIN &&
    draft.height <= HEIGHT_CM_MAX &&
    draft.goal !== null &&
    draft.activity !== null
  );
}

export function toSignUpRequest(
  account: AccountCredentials,
  draft: CompleteOnboardingDraft,
): SignUpRequest {
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    password: account.password,
    rePassword: account.password,
    gender: draft.gender,
    age: draft.age,
    weight: draft.weight,
    height: draft.height,
    goal: draft.goal,
    activityLevel: draft.activity,
  };
}
