import { Exercise } from '../models/classes.models';
import { exerciseVideoUrl } from './exercise-media';

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
