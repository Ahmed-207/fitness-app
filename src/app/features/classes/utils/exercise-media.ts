import { Exercise } from '../models/classes.models';

/** Lowercase prime mover `name` → anatomy diagram URL from Elevate muscles API. */
export type PrimeMoverImageMap = ReadonlyMap<string, string>;

const YOUTUBE_URL = /youtube\.com|youtu\.be/i;

/** Used only when a prime mover has no `image` in the muscles API. */
export const EXERCISE_CARD_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
] as const;

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

/** Resolve card/hero image from prime mover anatomy URLs on the Elevate muscles API. */
export function exerciseImageUrl(
  exercise: Exercise,
  primeMoverImages: PrimeMoverImageMap,
  fallbackIndex = 0,
): string {
  const key = (exercise.prime_mover_muscle ?? '').trim().toLowerCase();
  const fromApi = key ? primeMoverImages.get(key) : undefined;
  if (fromApi) {
    return fromApi;
  }
  const fallbacks = EXERCISE_CARD_FALLBACK_IMAGES;
  return fallbacks[Math.abs(fallbackIndex) % fallbacks.length];
}
