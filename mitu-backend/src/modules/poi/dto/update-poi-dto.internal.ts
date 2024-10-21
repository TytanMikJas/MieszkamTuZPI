import { IsOptional } from 'class-validator';

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
