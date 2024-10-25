import { PostType } from '@/types';
import { useEffect } from 'react';

export default function PostTypeEffect({ postType }: { postType: PostType }) {
  const { setPostType } = { setPostType: (_postType: PostType) => null }; //useMapWithPostsStore();
  useEffect(() => {
    setPostType(postType);
  }, []);
  return null;
}
