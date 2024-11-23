import AirQualityMeasurement from '@/core/api/cartography/AirQualityMeasurementDto';

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

export function getColorFromPercentage(percentage: number): string {
  const red = { r: 255, g: 0, b: 0 };
  const yellow = { r: 255, g: 255, b: 0 };
  const green = { r: 0, g: 255, b: 0 };
  const dgreen = { r: 64, g: 153, b: 0 };

  let color;
  if (percentage >= 75) {
    const ratio = (percentage - 75) / 25;
    color = {
      r: yellow.r + (red.r - yellow.r) * ratio,
      g: yellow.g + (red.g - yellow.g) * ratio,
      b: yellow.b + (red.b - yellow.b) * ratio,
    };
  } else if (percentage >= 50) {
    const ratio = (percentage - 50) / 25;
    color = {
      r: green.r + (yellow.r - green.r) * ratio,
      g: green.g + (yellow.g - green.g) * ratio,
      b: green.b + (yellow.b - green.b) * ratio,
    };
  } else {
    const ratio = percentage / 50;
    color = {
      r: green.r + (dgreen.r - green.r) * ratio,
      g: green.g + (dgreen.g - green.g) * ratio,
      b: green.b + (dgreen.b - green.b) * ratio,
    };
  }

  return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
}

export function calculateAverageSeverity(
  measurements: AirQualityMeasurement[],
): number {
  const severities = measurements.map(({ parameter, value }) =>
    calculateParameterSeverity(parameter, value),
  );

  if (severities.length === 0) {
    return 0;
  }

  const totalSeverity = severities.reduce((sum, severity) => sum + severity, 0);
  return totalSeverity / severities.length;
}
