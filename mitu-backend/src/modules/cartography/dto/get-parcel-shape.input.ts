import { EPSG2180 } from 'src/modules/uldk/uldk.types';

export class GetParcelShapeInputDto {
  parcelNumber?: string;

  parcelRegion?: string;

  latitude?: EPSG2180;

  longitude?: EPSG2180;
}
