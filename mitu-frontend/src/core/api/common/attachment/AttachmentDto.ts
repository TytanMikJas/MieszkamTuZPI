import { FileType } from '@/types';

export default interface AttachmentDto {
  id?: number;
  postId?: number;
  fileName: string;
  fileType: FileType;
  postType?: string;
}
