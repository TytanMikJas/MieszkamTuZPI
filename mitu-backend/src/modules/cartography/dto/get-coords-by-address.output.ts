import { EPSG4326 } from 'src/modules/uldk/uldk.types';

/**
 * Get coords by address output dto
 * @export
 * @class GetCoordsByAddressOutputDto
 */
export class GetCoordsByAddressOutputDto {
  x: EPSG4326;
  y: EPSG4326;
}
