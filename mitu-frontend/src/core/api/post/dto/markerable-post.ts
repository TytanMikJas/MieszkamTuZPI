import { PostType } from '@/types';
import CategoryDto from '../../common/category/category';
import PostDto from './post';

export default interface MarkerablePostDto extends PostDto {
  title: string;
  locationX: number;
  locationY: number;
  area?: string;
  category: CategoryDto;
  postType: PostType;
}
