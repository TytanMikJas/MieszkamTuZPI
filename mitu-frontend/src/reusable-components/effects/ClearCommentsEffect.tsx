import { useEffect } from 'react';

export default function ClearCommentsEffect() {
  const { clearComments } = { clearComments: () => null }; //useCommentStore();
  useEffect(() => {
    return () => {
      clearComments();
    };
  }, []);
  return null;
}
