import { UnitSystem } from './onboarding.models';

export const AGE_MIN = 16;
export const AGE_MAX = 100;
export const WEIGHT_KG_MIN = 30;
export const WEIGHT_KG_MAX = 250;
export const WEIGHT_LB_MIN = 66;
export const WEIGHT_LB_MAX = 550;
export const HEIGHT_CM_MIN = 120;
export const HEIGHT_CM_MAX = 230;
export const HEIGHT_IN_MIN = 47;
export const HEIGHT_IN_MAX = 90;

const POUNDS_PER_KILOGRAM = 2.20462;
const CENTIMETRES_PER_INCH = 2.54;

export function displayWeight(weightKg: number, units: UnitSystem): number {
  if (units === 'metric') {
    return Math.round(weightKg);
  }

  return Math.max(
    WEIGHT_LB_MIN,
    Math.min(WEIGHT_LB_MAX, Math.round(weightKg * POUNDS_PER_KILOGRAM)),
  );
}

export function displayHeight(heightCm: number, units: UnitSystem): number {
  if (units === 'metric') {
    return Math.round(heightCm);
  }

  return Math.max(
    HEIGHT_IN_MIN,
    Math.min(HEIGHT_IN_MAX, Math.round(heightCm / CENTIMETRES_PER_INCH)),
  );
}

export function weightFromDisplay(value: number, units: UnitSystem): number {
  const kilograms = units === 'metric' ? value : value / POUNDS_PER_KILOGRAM;
  return Math.max(WEIGHT_KG_MIN, Math.min(WEIGHT_KG_MAX, kilograms));
}

export function heightFromDisplay(value: number, units: UnitSystem): number {
  const centimetres = units === 'metric' ? value : value * CENTIMETRES_PER_INCH;
  return Math.max(HEIGHT_CM_MIN, Math.min(HEIGHT_CM_MAX, centimetres));
}

export function heightFeet(totalInches: number): number {
  return Math.floor(totalInches / 12);
}

export function heightInches(totalInches: number): number {
  return totalInches % 12;
}

export function measurementValues(
  value: number,
  minimum: number,
  maximum: number,
): (number | null)[] {
  const firstValue = value - 4;

  return Array.from({ length: 9 }, (_, index) => {
    const nextValue = firstValue + index;
    return nextValue < minimum || nextValue > maximum ? null : nextValue;
  });
}

export function isNearWheelIndex(index: number): boolean {
  return Math.abs(index - 4) === 1;
}

export function stepMeasurement(
  current: number,
  delta: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, current + delta));
}

export function wheelDelta(deltaX: number, deltaY: number): number | null {
  const movement = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

  if (Math.abs(movement) < 4) {
    return null;
  }

  return movement > 0 ? 1 : -1;
}

export function swipeDelta(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): number | null {
  const horizontal = startX - endX;
  const vertical = startY - endY;

  if (Math.abs(horizontal) < 20 || Math.abs(horizontal) < Math.abs(vertical)) {
    return null;
  }

  const steps = Math.max(1, Math.min(4, Math.round(Math.abs(horizontal) / 28)));
  return Math.sign(horizontal) * steps;
}
