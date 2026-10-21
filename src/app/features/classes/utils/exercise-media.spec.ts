import { Exercise } from '../models/classes.models';
import { EXERCISE_CARD_FALLBACK_IMAGES, exerciseImageUrl, exerciseVideoUrl } from './exercise-media';

describe('exerciseVideoUrl', () => {
  const base = { _id: '1', exercise: 'Test' } as Exercise;

  it('returns a YouTube link when present', () => {
    expect(
      exerciseVideoUrl({
        ...base,
        short_youtube_demonstration_link: 'https://www.youtube.com/watch?v=abc',
        in_depth_youtube_explanation_link: null,
      }),
    ).toBe('https://www.youtube.com/watch?v=abc');
  });

  it('resolves prime mover anatomy images from the muscles API map', () => {
    const map = new Map([['rectus abdominis', 'https://iili.io/example.png']]);
    expect(
      exerciseImageUrl(
        { ...base, prime_mover_muscle: 'Rectus Abdominis' } as Exercise,
        map,
        0,
      ),
    ).toBe('https://iili.io/example.png');
  });

  it('falls back when prime mover has no API image', () => {
    expect(exerciseImageUrl({ ...base, prime_mover_muscle: 'Unknown' } as Exercise, new Map(), 1)).toBe(
      EXERCISE_CARD_FALLBACK_IMAGES[1],
    );
  });

  it('ignores label placeholders from the API', () => {
    expect(
      exerciseVideoUrl({
        ...base,
        short_youtube_demonstration_link: 'Video Demonstration',
        in_depth_youtube_explanation_link: null,
      }),
    ).toBeNull();
  });
});
