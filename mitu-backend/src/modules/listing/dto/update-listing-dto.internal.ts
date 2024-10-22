/**
 * DTO for updating internal DTO of a listing
 * @param {boolean} sell - The sell.
 * @param {number} price - The price.
 * @param {number} surface - The surface.
 */

export default class UpdateListingExcludePoiDto {
  sell: boolean;
  price: number;
  surface: number;
}
