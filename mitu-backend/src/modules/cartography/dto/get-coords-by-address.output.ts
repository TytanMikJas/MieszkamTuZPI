import { EPSG4326 } from 'src/modules/uldk/uldk.types';

export class GetCoordsByAddressOutputDto {
  x: EPSG4326;
  y: EPSG4326;
}
