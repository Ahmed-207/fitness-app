import { Exercise } from '../models/classes.models';

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
