import { IsOptional } from 'class-validator';

/**
 * Create POI dto
 * @export
 * @class CreatePOIDTO
 * @param {number} id
 * @param {string} title
 * @param {string} slug
 * @param {number} locationX
 * @param {number} locationY
 * @param {string} responsible
 * @param {string} street
 * @param {string} buildingNr
 * @param {string} apartmentNr
 */
export class CreatePOIDTO {
  id: number;
  title: string;
  slug: string;
  locationX: number;
  locationY: number;
  responsible: string;
  @IsOptional()
  street?: string;
  @IsOptional()
  buildingNr?: string;
  @IsOptional()
  apartmentNr?: string;
}
