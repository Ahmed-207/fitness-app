export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  age: number;
  goal: string;
  activityLevel: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}
