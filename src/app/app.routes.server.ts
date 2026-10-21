import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'classes',
    renderMode: RenderMode.Server,
  },
  {
    path: 'classes/:exerciseId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'healthy',
    renderMode: RenderMode.Server,
  },
  {
    path: 'healthy/:mealId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
