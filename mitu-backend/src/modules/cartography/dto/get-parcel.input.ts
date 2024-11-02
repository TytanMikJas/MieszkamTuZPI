import { EPSG4326 } from 'src/modules/uldk/uldk.types';

/**
 * Get parcel input dto
 * @export
 * @class GetParcelInputDto
 * @param {EPSG4326} latitude
 * @param {EPSG4326} longitude
 */
export class GetParcelInputDto {
  latitude: EPSG4326;
  longitude: EPSG4326;
}
