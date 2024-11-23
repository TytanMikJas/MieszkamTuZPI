import { AirQualityMeasurement } from './AirQualityMeasurementDto';

export default interface AirQualityResult {
  location: string;
  latitude: number;
  longitude: number;
  measurements: AirQualityMeasurement[];
}
