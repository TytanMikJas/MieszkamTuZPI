import { EPSG2180 } from 'src/modules/uldk/uldk.types';

export class GetParcelOutputDto {
  parcelNumber: string;

  parcelRegion: string;

  x: EPSG2180;

  y: EPSG2180;
}
