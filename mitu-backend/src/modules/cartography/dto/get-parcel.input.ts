import { EPSG4326 } from 'src/modules/uldk/uldk.types';

export class GetParcelInputDto {
  latitude: EPSG4326;
  longitude: EPSG4326;
}
