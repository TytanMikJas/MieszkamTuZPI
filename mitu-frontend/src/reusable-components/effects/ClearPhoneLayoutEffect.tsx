import { useCommentStore } from '@/core/stores/comment-store';
import { useInvestmentStore } from '@/core/stores/investment-store';
import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import { useUiStore } from '@/core/stores/ui-store';
import { PostType } from '@/types';
import { useEffect } from 'react';
import { PhoneLayoutPage } from '../app-layout/PhoneLayout';

export default function ClearPhoneLayoutEffect() {
  const { setPhoneLayoutPage } = useUiStore();
  useEffect(() => {
    return () => {
      setPhoneLayoutPage(PhoneLayoutPage.LEFT);
    };
  }, []);
  return null;
}
