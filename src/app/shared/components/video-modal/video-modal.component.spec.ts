import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { VideoModalComponent, toYouTubeEmbedUrl } from './video-modal.component';

describe('VideoModalComponent', () => {
  let fixture: ComponentFixture<VideoModalComponent>;
  let component: VideoModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoModalComponent],
      providers: [...provideEnglishTranslations()],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(VideoModalComponent);
    fixture.componentRef.setInput('videoUrl', 'https://www.youtube.com/watch?v=abc123');
    fixture.componentRef.setInput('title', 'Demo');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits closed when close is called', () => {
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));
    component.close();
    expect(emitted).toBe(true);
  });

  it('converts watch URLs to embed URLs', () => {
    expect(toYouTubeEmbedUrl('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123?autoplay=1&rel=0',
    );
    expect(toYouTubeEmbedUrl('https://youtu.be/abc123')).toBe(
      'https://www.youtube.com/embed/abc123?autoplay=1&rel=0',
    );
  });
});
