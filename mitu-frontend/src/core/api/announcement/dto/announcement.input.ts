export default interface AnnouncementInputDto {
  title: string;
  locationX: number;
  locationY: number;
  area?: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  isCommentable: boolean;
  categoryName: string;
  content: string;
  thumbnail: string;
  responsible: string;
}
