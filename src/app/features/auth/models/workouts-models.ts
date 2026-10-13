export interface MuscleGroup {
  _id: string;
  name: string;
}

export interface MuscleGroupsResponse {
  message: string;
  musclesGroup: MuscleGroup[];
}

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup?: string;
  image?: string;
  target?: string;
  equipment?: string;
}

export interface ExercisesResponse {
  message: string;
  exercises: Exercise[];
}