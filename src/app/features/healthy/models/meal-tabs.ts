import { MealCategory } from './meals.models';

/**
 * Featured tabs mapped to TheMealDB `filter.php?c=` names (Elevate Postman → Meals folder).
 * Breakfast / Chicken / Beef match collection examples and categories.php.
 */
export const MEAL_TABS = [
  { id: 'breakfast', category: 'Breakfast', labelKey: 'MEALS.TABS.BREAKFAST' },
  { id: 'lunch', category: 'Chicken', labelKey: 'MEALS.TABS.LUNCH' },
  { id: 'dinner', category: 'Beef', labelKey: 'MEALS.TABS.DINNER' },
] as const;

export type MealTab = (typeof MEAL_TABS)[number];

export const DEFAULT_MEAL_TAB_ID = 'dinner';

export function resolveFeaturedMealTabs(categories: MealCategory[]): MealTab[] {
  if (categories.length === 0) {
    return [...MEAL_TABS];
  }
  const available = new Set(categories.map((item) => item.strCategory));
  const resolved = MEAL_TABS.filter((tab) => available.has(tab.category));
  return resolved.length > 0 ? [...resolved] : [...MEAL_TABS];
}

export function mealTabForCategory(
  category: string | null | undefined,
  tabs: readonly MealTab[] = MEAL_TABS,
): string {
  const match = tabs.find((tab) => tab.category === category);
  return match?.id ?? tabs[0]?.id ?? DEFAULT_MEAL_TAB_ID;
}

export function categoryForTabId(tabId: string, tabs: readonly MealTab[] = MEAL_TABS): string {
  return tabs.find((tab) => tab.id === tabId)?.category ?? 'Beef';
}
