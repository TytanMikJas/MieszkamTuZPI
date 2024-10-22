/**
 * Listing internal DTO.
 * @class
 * @exports
 * @constructor
 * @param {number} id - The id of listing.
 * @param {Date} updatedAt - The last updated at date.
 * @param {boolean} sell - The sell status.
 * @param {number} price - The price.
 * @param {number} surface - The surface.
 */
export class ListingInternalDto {
  id: number;
  updatedAt: Date;
  sell: boolean;
  price: number;
  surface: number;
}
