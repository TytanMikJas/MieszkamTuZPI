import CreatedByDto from '../../common/created-by/CreatedByDto';
import MarkerablePostDto from '../../post/dto/markerable-post';
import { FilePathsDto } from '../../shared';

export default interface ListingDto extends MarkerablePostDto {
  slug: string;
  street: string;
  buildingNr: string;
  apartmentNr: string;
  surface: number;
  content: string;
  thumbnail: string;
  price: number;
  sell: boolean;
  attachments: any[];
  filePaths: FilePathsDto;
  createdBy: CreatedByDto;
  responsible: string;
}
