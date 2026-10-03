import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('applies light theme to the document element', () => {
    service.setTheme('light');

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('fitness-app.theme')).toBe('light');
  });

  it('toggles between dark and light', () => {
    service.setTheme('dark');
    service.toggleTheme();

    expect(service.theme()).toBe('light');
  });
});
