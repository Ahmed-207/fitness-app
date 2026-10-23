import { Exercise } from '../models/classes.models';

/** Lowercase prime mover `name` → anatomy diagram URL from Elevate muscles API. */
export type PrimeMoverImageMap = ReadonlyMap<string, string>;

const YOUTUBE_URL = /youtube\.com|youtu\.be/i;

/** Returns a playable YouTube URL, ignoring API label placeholders. */
export function exerciseVideoUrl(exercise: Exercise): string | null {
  for (const url of [
    exercise.short_youtube_demonstration_link,
    exercise.in_depth_youtube_explanation_link,
  ]) {
    if (url && YOUTUBE_URL.test(url)) {
      return url;
    }
  }
  return null;
}

/** Prime mover anatomy URL from Elevate muscles API only — no stock placeholders. */
export function exerciseImageUrl(
  exercise: Exercise,
  primeMoverImages: PrimeMoverImageMap,
): string | null {
  const key = (exercise.prime_mover_muscle ?? '').trim().toLowerCase();
  if (!key) {
    return null;
  }
  const fromApi = primeMoverImages.get(key)?.trim();
  return fromApi || null;
}
