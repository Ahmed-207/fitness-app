import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-video-modal',
  imports: [TranslatePipe],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'video-modal-host',
    role: 'dialog',
    'aria-modal': 'true',
  },
})
export class VideoModalComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Raw YouTube URL (watch or embed) from the API. */
  readonly videoUrl = input.required<string>();
  readonly title = input<string>('');

  readonly closed = output<void>();

  readonly embedUrl = computed<SafeResourceUrl>(() => {
    const embed = toYouTubeEmbedUrl(this.videoUrl());
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}

/** Convert a YouTube watch/share URL into an autoplay embed URL. */
export function toYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  const base = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}autoplay=1&rel=0`;
}

function extractYouTubeId(url: string): string | null {
  const match = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(
    url,
  );
  return match?.[1] ?? null;
}
