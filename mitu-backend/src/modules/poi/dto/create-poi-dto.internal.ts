import { IsOptional } from 'class-validator';

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
