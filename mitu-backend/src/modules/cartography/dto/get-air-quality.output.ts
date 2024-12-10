export class AirQualityResult {
  location: string;
  latitude: number;
  longitude: number;
  measurements: AirQualityMeasurement[];
}

export class AirQualityMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  severity: number;
}
