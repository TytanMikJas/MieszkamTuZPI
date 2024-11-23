import { useCommentStore } from '@/core/stores/comment-store';
import CommentSection from '@/reusable-components/post-details/comments/CommentSection';
import { useInvestmentStore } from '@/core/stores/investment-store';

export default function InvestmentComments() {
  const {
    fetchComments,
    isMoreComments,
    loadMoreSubcomments,
    performVoteComment,
    perfomVoteSubcomment,
    postComment,
    setCommentReplyTarget,
    clearCommentReplyTarget,
    getReplyTarget,
    postCommentLoading,
    getLoadingDeleteComment,
    deleteComment,
    editComment,
    singleComments,
    singleCommentCount,
  } = useCommentStore();

  const { singleInvestment } = useInvestmentStore();

  const loadMoreComments = () => {
    if (singleInvestment) fetchComments(`${singleInvestment.id}`);
  };

  return (
    <CommentSection
      rootId={`${singleInvestment?.id}`}
      editComment={editComment}
      getReplyTarget={getReplyTarget}
      setReplyTarget={setCommentReplyTarget}
      clearReplyTarget={clearCommentReplyTarget}
      rateComment={performVoteComment}
      rateSubcomment={perfomVoteSubcomment}
      loadMore={loadMoreComments}
      isMore={isMoreComments}
      comments={singleComments}
      count={singleCommentCount}
      loadSubcomments={loadMoreSubcomments}
      postComment={postComment}
      postCommentLoading={postCommentLoading}
      getLoadingDeleteComment={getLoadingDeleteComment}
      deleteComment={deleteComment}
    />
  );
}
