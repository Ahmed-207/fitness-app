import {
  displayHeight,
  displayWeight,
  heightFromDisplay,
  HEIGHT_CM_MAX,
  HEIGHT_CM_MIN,
  HEIGHT_IN_MAX,
  HEIGHT_IN_MIN,
  measurementValues,
  stepMeasurement,
  swipeDelta,
  weightFromDisplay,
  WEIGHT_KG_MAX,
  WEIGHT_KG_MIN,
  WEIGHT_LB_MAX,
  WEIGHT_LB_MIN,
  wheelDelta,
} from './measurement';

describe('measurement', () => {
  it('keeps profile measurements in metric units when imperial display is selected', () => {
    const weight = weightFromDisplay(154, 'imperial');
    const height = heightFromDisplay(67, 'imperial');

    expect(weight).toBeCloseTo(69.85, 2);
    expect(height).toBeCloseTo(170.18, 2);
    expect(displayWeight(weight, 'imperial')).toBe(154);
    expect(displayHeight(height, 'imperial')).toBe(67);
  });

  it('keeps the selected measurement centered at both wheel boundaries', () => {
    expect(measurementValues(16, 16, 100)).toEqual([null, null, null, null, 16, 17, 18, 19, 20]);
    expect(measurementValues(100, 16, 100)).toEqual([96, 97, 98, 99, 100, null, null, null, null]);
  });

  it('clamps a step at the age bounds', () => {
    expect(stepMeasurement(16, -1, 16, 100)).toBe(16);
    expect(stepMeasurement(16, 1, 16, 100)).toBe(17);
  });

  it('keeps imperial boundary selections valid in canonical metric values', () => {
    const weight = weightFromDisplay(WEIGHT_LB_MIN, 'imperial');
    const height = heightFromDisplay(HEIGHT_IN_MIN, 'imperial');

    expect(weight).toBe(WEIGHT_KG_MIN);
    expect(height).toBe(HEIGHT_CM_MIN);
    expect(displayWeight(weight, 'imperial')).toBe(WEIGHT_LB_MIN);
    expect(displayHeight(height, 'imperial')).toBe(HEIGHT_IN_MIN);
    expect(weight).toBeLessThanOrEqual(WEIGHT_KG_MAX);
    expect(height).toBeLessThanOrEqual(HEIGHT_CM_MAX);
  });

  it('keeps the selected height visible in the wheel when changing units', () => {
    const centimetres = heightFromDisplay(67, 'imperial');
    const shown = displayHeight(centimetres, 'metric');

    expect(shown).toBe(170);
    expect(measurementValues(shown, HEIGHT_CM_MIN, HEIGHT_CM_MAX)[4]).toBe(170);
  });

  it('ignores a tiny scroll and a mostly vertical swipe', () => {
    expect(wheelDelta(0, 2)).toBeNull();
    expect(wheelDelta(0, 8)).toBe(1);
    expect(swipeDelta(40, 10, 30, 80)).toBeNull();
    expect(swipeDelta(80, 20, 24, 20)).toBe(2);
  });

  it('clamps the tallest imperial height', () => {
    expect(displayHeight(heightFromDisplay(HEIGHT_IN_MAX, 'imperial'), 'imperial')).toBe(
      HEIGHT_IN_MAX,
    );
  });
});
