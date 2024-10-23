/**
 * Create listing internal dto.
 * @param {boolean} sell - The sell status.
 * @param {number} price - The price.
 * @param {number} surface - The surface.
 */
export default class ListingExcludePoiDto {
  sell: boolean;
  price: number;
  surface: number;
}
