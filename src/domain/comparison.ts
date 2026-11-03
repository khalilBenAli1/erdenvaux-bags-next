export const comparisonScale = 5;
export const comparisonBaseline = 230;
export const bodyMeasurement = (widthCm: number, heightCm: number) => ({
  widthUnits: widthCm * comparisonScale,
  heightUnits: heightCm * comparisonScale,
});
