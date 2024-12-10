export const parameterThresholds: Record<string, { min: number; max: number }> =
  {
    bc: { min: 0, max: 5 },
    o3: { min: 0, max: 100 },
    so2: { min: 0, max: 75 },
    pm10: { min: 0, max: 50 },
    pm25: { min: 0, max: 25 },
    co: { min: 0, max: 1000 },
    no2: { min: 0, max: 40 },
  };

const validParameters = Object.keys(parameterThresholds);

export const isValidParameter = (parameter: string): boolean =>
  validParameters.includes(parameter);

export const roundToDecimal = (value: number, decimals = 2): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const trimLocationName = (location: string) => {
  const parts = location.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  return parts[0];
};

export function calculateParameterSeverity(
  parameter: string,
  value: number,
): number {
  const thresholds = parameterThresholds[parameter];
  if (!thresholds) {
    return 0;
  }
  const { min, max } = thresholds;
  const percentage = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, percentage));
}
