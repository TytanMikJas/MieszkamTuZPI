import InfiniteList from '@/reusable-components/containers/InfiniteList/InfiniteList';
import OfficialCommentCard from './CommentCard';
import CommentDto from '@/core/api/common/comment/CommentDto';
import { useOfficialStore } from '@/core/stores/official-store';

export default function CommentsList() {
  const { fetchCommentsList, isMoreList, commentsList } = useOfficialStore();
  return (
    <div className="w-full h-full scrollable-vertical">
      <InfiniteList loadMore={fetchCommentsList} isMore={isMoreList}>
        <div className="grid grid-cols-2 flex-wrap gap-4">
          {commentsList.map((comment: CommentDto, index: number) => (
            <OfficialCommentCard key={index} comment={comment} />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
}
