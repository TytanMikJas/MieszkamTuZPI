import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import { PostType } from '@/types';
import { useEffect } from 'react';

export default function PostTypeEffect({ postType }: { postType: PostType }) {
  const { setPostType } = useMapWithPostsStore();
  useEffect(() => {
    setPostType(postType);
  }, []);
  return null;
}
