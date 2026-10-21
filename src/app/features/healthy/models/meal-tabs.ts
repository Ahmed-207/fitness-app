/** Design tabs mapped to TheMealDB `filter.php?c=` category names. */
export const MEAL_TABS = [
  { id: 'breakfast', category: 'Breakfast', labelKey: 'MEALS.TABS.BREAKFAST' },
  { id: 'lunch', category: 'Chicken', labelKey: 'MEALS.TABS.LUNCH' },
  { id: 'dinner', category: 'Beef', labelKey: 'MEALS.TABS.DINNER' },
] as const;

export const DEFAULT_MEAL_TAB_ID = 'dinner';

export function mealTabForCategory(category: string | null | undefined): string {
  const match = MEAL_TABS.find((tab) => tab.category === category);
  return match?.id ?? DEFAULT_MEAL_TAB_ID;
}

export function categoryForTabId(tabId: string): string {
  return MEAL_TABS.find((tab) => tab.id === tabId)?.category ?? 'Beef';
}
