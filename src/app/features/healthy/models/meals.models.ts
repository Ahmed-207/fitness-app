export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealCategoriesResponse {
  categories: MealCategory[];
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea?: string | null;
  strCountry?: string | null;
}

/** TheMealDB returns `{ "meals": null }` on a miss — not an error status. */
export interface MealListResponse {
  meals: MealSummary[] | null;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string | null;
  strCountry: string | null;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface MealDetailResponse {
  meals: MealDetail[] | null;
}

export interface MealIngredient {
  ingredient: string;
  measure: string;
}

/** Zip strIngredientN with strMeasureN and drop empty pairs. */
export function extractIngredients(meal: MealDetail): MealIngredient[] {
  const ingredients: MealIngredient[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    if (!ingredient) {
      continue;
    }
    ingredients.push({
      ingredient,
      measure: meal[`strMeasure${i}`]?.trim() ?? '',
    });
  }
  return ingredients;
}
