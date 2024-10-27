import CommentSection from '../../../../reusable-components/post-details/comments/CommentSection';
import { useCommentStore } from '@/core/stores/comment-store';
import { useAnnouncementStore } from '@/core/stores/announcement-store';

export default function AnnouncementComments() {
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

  const { singleAnnouncement } = useAnnouncementStore();

  const loadMoreComments = () => {
    if (singleAnnouncement) fetchComments(`${singleAnnouncement.id}`);
  };

  return (
    <CommentSection
      rootId={`${singleAnnouncement?.id}`}
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
