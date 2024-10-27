import { Badge } from '../../../shadcn/badge';
import CommentCard from './CommentCard';
import InfiniteList from '../../containers/InfiniteList/InfiniteList';
import CommentDto from '../../../core/api/common/comment/CommentDto';
import {
  DeleteComment,
  EditComment,
  GetDeleteCommentLoading,
  PerformVote,
  PostComment,
  SetReplyTarget,
} from '../../../types';
import CommentInput from './CommentInput';

export default function CommentSection({
  rootId,
  loadMore,
  isMore,
  comments,
  count,
  loadSubcomments,
  rateComment,
  rateSubcomment,
  postComment,
  postCommentLoading,
  setReplyTarget,
  clearReplyTarget,
  getReplyTarget,
  getLoadingDeleteComment,
  deleteComment,
  editComment,
}: {
  rootId: string;
  loadMore: () => void;
  isMore: boolean;
  comments: CommentDto[];
  count: number;
  loadSubcomments: (parentNodeId: string) => void;
  rateComment: PerformVote;
  rateSubcomment: PerformVote;
  postComment: PostComment;
  postCommentLoading: boolean;
  setReplyTarget: SetReplyTarget;
  clearReplyTarget: () => void;
  getReplyTarget: () => CommentDto | undefined;
  getLoadingDeleteComment: GetDeleteCommentLoading;
  deleteComment: DeleteComment;
  editComment: EditComment;
}) {
  return (
    <div key={rootId} className="flex h-full flex-col relative">
      <div className="flex justify-center items-center space-x-2 p-2 md:border-b">
        <h1 className="text-xl font-bold">Komentarze</h1>
        <Badge className="h-3/4">{comments?.length}</Badge>
      </div>

      <div className="w-full z-[50] p-2 md:p-4">
        <CommentInput
          rootId={rootId}
          postComment={postComment}
          postCommentLoading={postCommentLoading}
          clearReply={clearReplyTarget}
          replyToContent={getReplyTarget()?.content}
        />
      </div>

      <div className="bg-gray-100 h-full scrollable-vertical">
        <InfiniteList loadMore={loadMore} isMore={isMore}>
          <div className="space-y-2">
            {comments?.map((data, i) => (
              <CommentCard
                key={data?.id}
                editComment={editComment}
                setReplyTarget={setReplyTarget}
                rateComment={rateComment}
                rateSubcomment={rateSubcomment}
                loadMore={loadSubcomments}
                comment={data}
                deleteComment={deleteComment}
                getLoadingDeleteComment={getLoadingDeleteComment}
              />
            ))}
          </div>
        </InfiniteList>
      </div>
    </div>
  );
}
