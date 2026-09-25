import { environment } from '../../../environments/environment';

const apiUrl = environment.apiBaseUrl;
const mealsApiUrl = environment.mealsApiBaseUrl;

export const API_ENDPOINTS = {
  auth: {
    signup: `${apiUrl}/auth/signup`,
    signin: `${apiUrl}/auth/signin`,
    changePassword: `${apiUrl}/auth/change-password`,
    uploadPhoto: `${apiUrl}/auth/upload-photo`,
    profileData: `${apiUrl}/auth/profile-data`,
    logout: `${apiUrl}/auth/logout`,
    forgotPassword: `${apiUrl}/auth/forgotPassword`,
    verifyResetCode: `${apiUrl}/auth/verifyResetCode`,
    resetPassword: `${apiUrl}/auth/resetPassword`,
    deleteAccount: `${apiUrl}/auth/deleteMe`,
    editProfile: `${apiUrl}/auth/editProfile`,
  },
  levels: {
    all: `${apiUrl}/levels`,
    byPrimeMoverMuscle: `${apiUrl}/levels/difficulty-levels/by-prime-mover`,
  },
  muscles: {
    groups: `${apiUrl}/muscles`,
    byGroupId: (groupId: string) => `${apiUrl}/musclesGroup/${encodeURIComponent(groupId)}`,
    random: `${apiUrl}/muscles/random`,
    byMuscleGroup: `${apiUrl}/musclesGroup/by-muscle-group`,
  },
  meals: {
    categories: `${mealsApiUrl}/categories.php`,
    byCategory: `${mealsApiUrl}/filter.php`,
    details: `${mealsApiUrl}/lookup.php`,
  },
  exercises: {
    all: `${apiUrl}/exercises`,
    byMuscleAndDifficulty: `${apiUrl}/exercises/by-muscle-difficulty`,
    random: `${apiUrl}/exercises/random`,
  },
} as const;
