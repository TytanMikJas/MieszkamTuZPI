export default interface AnnouncementInputPatchDto {
  title?: string;
  locationX?: number;
  locationY?: number;
  area?: string;
  address?: string;
  isCommentable?: boolean;
  categoryName?: string;
  content?: string;
  thumbnail?: string;
  exclude?: string;
  responsible?: string;
}
