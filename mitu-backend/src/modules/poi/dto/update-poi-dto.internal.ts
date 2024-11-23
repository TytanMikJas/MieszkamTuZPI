import { IsOptional } from 'class-validator';

/**
 * Update POI dto
 * @export
 * @class UpdatePOIDTO
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
export class UpdatePOIDTO {
  id: number;
  @IsOptional()
  title: string;
  @IsOptional()
  slug: string;
  @IsOptional()
  locationX: number;
  @IsOptional()
  locationY: number;
  @IsOptional()
  responsible: string;
  @IsOptional()
  street?: string;
  @IsOptional()
  buildingNr?: string;
  @IsOptional()
  apartmentNr?: string;
}
