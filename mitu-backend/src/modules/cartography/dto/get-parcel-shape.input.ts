import { EPSG2180 } from 'src/modules/uldk/uldk.types';

/**
 * Get parcel shape input dto
 * @export
 * @class GetParcelShapeInputDto
 * @param {string} parcelNumber
 * @param {string} parcelRegion
 * @param {EPSG2180} latitude
 * @param {EPSG2180} longitude
 */
export class GetParcelShapeInputDto {
  parcelNumber?: string;

  parcelRegion?: string;

  latitude?: EPSG2180;

  longitude?: EPSG2180;
}
