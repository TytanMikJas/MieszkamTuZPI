export default interface AnnouncementInputDto {
  title: string;
  locationX: number;
  locationY: number;
  area?: string;
  address: string;
  isCommentable: boolean;
  categoryName: string;
  content: string;
  thumbnail: string;
  responsible: string;
}
