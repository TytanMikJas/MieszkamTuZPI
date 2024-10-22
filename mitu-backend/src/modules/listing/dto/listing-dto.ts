import { Transform } from 'class-transformer';

/**
 * DTO for listing
 * @property {number} id - The id of the listing
 * @property {Date} updatedAt - The date of the last update
 * @property {string} title - The title of the listing
 * @property {number} locationX - The x coordinate of the location
 * @property {number} locationY - The y coordinate of the location
 * @property {string} slug - The slug of the listing
 * @property {string} street - The street of the listing
 * @property {string} buildingNr - The building number of the listing
 * @property {string} apartmentNr - The apartment number of the listing
 * @property {string} thumbnail - The thumbnail of the listing
 * @property {number} price - The price of the listing
 * @property {number} surface - The surface of the listing
 * @property {string} responsible - The responsible person for the listing
 * @property {boolean} sell - The flag if the listing is for sale
 * @example
 * {
 * id: 1,
 * updatedAt: '2021-09-01T00:00:00.000Z',
 * title: 'Listing 1',
 * locationX: 1,
 * locationY: 1,
 * slug: 'listing-1',
 * street: 'Rynek',
 * buildingNr: '1',
 * apartmentNr: '1',
 * thumbnail: 'thumbnail.jpg',
 * price: 100000,
 * surface: 100,
 * responsible: 'UM Wroclaw',
 * sell: true,
 * }
 */
export class ListingDto {
  id: number;
  updatedAt: Date;
  title: string;
  locationX: number;
  locationY: number;
  slug: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  thumbnail?: string;
  @Transform(({ value }) => Number(value))
  price: number;
  @Transform(({ value }) => Number(value))
  surface: number;
  responsible: string;
  sell: boolean;
}
