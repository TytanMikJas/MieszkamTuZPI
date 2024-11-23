import React from 'react';
import SingleComment from './SingleComment';
import { Button } from '../../../shadcn/button';
import PulseLoader from '../../loaders/PulseLoader';
import {
  DeleteComment,
  EditComment,
  GetDeleteCommentLoading,
  PerformVote,
  SetReplyTarget,
} from '@/types';
import CommentDto from '@/core/api/common/comment/CommentDto';

export default function CommentCard({
  comment,
  loadMore,
  rateComment,
  rateSubcomment,
  setReplyTarget,
  getLoadingDeleteComment,
  deleteComment,
  editComment,
}: {
  comment: CommentDto;
  loadMore: (parentNodeId: string) => void;
  rateComment: PerformVote;
  rateSubcomment: PerformVote;
  setReplyTarget: SetReplyTarget;
  getLoadingDeleteComment: GetDeleteCommentLoading;
  deleteComment: DeleteComment;
  editComment: EditComment;
}) {
  const handleLoadMore = () => {
    loadMore(`${comment.id}`);
  };

  const commsLeft =
    comment?.commentCount - (comment?.comments ? comment?.comments.length : 0);
  const loading = comment?.loadingSubcomments;

  return (
    <div key={comment?.id} className="bg-white">
      <div className="items-center justify-between">
        <SingleComment
          editComment={editComment}
          key={comment?.id}
          setReplyTarget={setReplyTarget}
          rateComment={rateComment}
          comment={comment}
          getLoadingDeleteComment={getLoadingDeleteComment}
          deleteComment={deleteComment}
        />
      </div>

      {comment?.commentCount > 0 && (
        <div>
          <div className="flex flex-col mr-4 ml-5">
            {comment?.comments
              ?.toReversed()
              .map((data: CommentDto, i: number) => (
                <SingleComment
                  editComment={editComment}
                  key={data?.id}
                  rateComment={rateSubcomment}
                  isSubComment
                  comment={data}
                  getLoadingDeleteComment={getLoadingDeleteComment}
                  deleteComment={deleteComment}
                />
              ))}
          </div>

          {commsLeft > 0 && (
            <div className="flex justify-center pb-1">
              {!loading ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 ps-2 pe-2 h-min"
                  onClick={handleLoadMore}
                >
                  {`Załaduj więcej (${commsLeft})`}
                </Button>
              ) : (
                <PulseLoader size={20} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
