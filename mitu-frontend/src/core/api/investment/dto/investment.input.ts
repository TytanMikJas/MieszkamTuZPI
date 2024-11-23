import { InvestmentStatus } from '@/types';

export default interface InvestmentInputDto {
  title: string;
  locationX: number;
  locationY: number;
  area: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  responsible: string;
  isCommentable: boolean;
  status: InvestmentStatus;
  badges?: string;
  categoryName: string;
  content: string;
  thumbnail: string;
}
