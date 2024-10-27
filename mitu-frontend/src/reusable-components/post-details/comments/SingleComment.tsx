import { FILES_URL, POST_TYPE_COMMENT } from '../../../constants';
import CommentDto from '../../../core/api/common/comment/CommentDto';
import { RatingType } from '../../../core/api/common/rating/RatingDto';
import AuthGuard from '../../../core/auth/AuthGuard';
import { Role } from '../../../core/auth/roles';
import { COMMENT_NOT_APPROVED_MESSAGE } from '../../../strings';
import {
  DeleteComment,
  EditComment,
  GetDeleteCommentLoading,
  PerformVote,
  SetReplyTarget,
} from '../../../types';
import UserInfo from '../../misc/user-info/UserInfo';
import TimeFromNow from '../../time/TimeFromNow';
import ReplyButton from '../ReplyButton/ReplyButton';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import { useGalleryStore } from '@/core/stores/gallery-store';
import DeleteCommentIcon from '@/reusable-components/icons/delete-icon/DeleteCommentIcon';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import { useRef, useState } from 'react';
import EditCommentIcon from '@/reusable-components/icons/edit-comm-icon/EditCommentIcon';
import { MAX_LENGTH_COMMENT_CONTENT } from '@/max-lengths';
import { Textarea } from '@/shadcn/textarea';
import CancelEditIcon from '@/reusable-components/icons/edit-comm-icon/CancelEditIcon';
import AcceptEditIcon from '@/reusable-components/icons/edit-comm-icon/AcceptEditIcon';
import ExpectLoggedIn from '@/reusable-components/login-dialog/ExpectLoggedIn';

export default function SingleComment({
  comment,
  isSubComment,
  rateComment,
  setReplyTarget,
  getLoadingDeleteComment,
  deleteComment,
  editComment,
}: {
  comment: CommentDto;
  isSubComment?: boolean;
  rateComment: PerformVote;
  setReplyTarget?: SetReplyTarget;
  getLoadingDeleteComment: GetDeleteCommentLoading;
  deleteComment: DeleteComment;
  editComment: EditComment;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRating = (type: RatingType, postId: string) => {
    if (isSubComment) {
      rateComment(type, postId, `${comment?.parentNodeId}`);
    } else {
      rateComment(type, postId);
    }
  };

  const handleDelete = () => {
    if (isSubComment) {
      deleteComment(`${comment?.id}`, `${comment?.parentNodeId}`);
    } else {
      deleteComment(`${comment?.id}`);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = () => {
    if (isSubComment) {
      editComment(
        `${comment?.id}`,
        textareaRef.current?.value || '',
        handleCancelEdit,
        `${comment?.parentNodeId}`,
      );
    } else {
      editComment(
        `${comment?.id}`,
        textareaRef.current?.value || '',
        handleCancelEdit,
      );
    }
  };

  const deleteLoading = getLoadingDeleteComment(`${comment?.id}`);

  const { openGallery } = useGalleryStore();

  const readyToDisplay = comment?.status === 'APPROVED';

  const handleSetReplyTarget = () => {
    if (setReplyTarget) {
      setReplyTarget(`${comment?.id}`);
    }
  };

  const thumbnailSrc = `${FILES_URL}${comment?.filePaths.IMAGE}${comment?.thumbnail}`;

  const handleOpenGallery = () => {
    openGallery([{ src: thumbnailSrc }]);
  };

  return (
    <div className="flex relative items-start space-x-4 p-2 md:px-4 w-full pb-3">
      {deleteLoading && (
        <div className="absolute w-full h-full left-0 top-0 bg-black bg-opacity-5">
          <PanelLoader />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <UserInfo
            url={comment?.createdBy?.avatar}
            fullName={
              comment?.createdBy?.firstName + ' ' + comment?.createdBy?.lastName
            }
            verified={comment?.createdBy?.role === Role.OFFICIAL}
          />
          <div className="flex items-center space-x-2">
            <ExpectLoggedIn>
              <div>Rating</div>
            </ExpectLoggedIn>
            {isEditing ? (
              <AuthGuard
                allowedRoles={[]}
                bypass={{
                  field: 'id',
                  value: comment?.createdBy?.id,
                }}
                renderAllowed={<CancelEditIcon onClick={handleCancelEdit} />}
              />
            ) : (
              <AuthGuard
                allowedRoles={[]}
                bypass={{
                  field: 'id',
                  value: comment?.createdBy?.id,
                }}
                renderAllowed={<EditCommentIcon onClick={handleStartEdit} />}
              />
            )}
            {isEditing ? (
              <AuthGuard
                allowedRoles={[]}
                bypass={{
                  field: 'id',
                  value: comment?.createdBy?.id,
                }}
                renderAllowed={<AcceptEditIcon onClick={handleSubmitEdit} />}
              />
            ) : (
              <AuthGuard
                allowedRoles={[Role.OFFICIAL]}
                bypass={{
                  field: 'id',
                  value: comment?.createdBy?.id,
                }}
                renderAllowed={<DeleteCommentIcon onClick={handleDelete} />}
              />
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="p-2 flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              defaultValue={comment?.content}
              className="resize-none"
              maxLength={MAX_LENGTH_COMMENT_CONTENT}
            />
            <AuthGuard
              allowedRoles={[Role.USER]}
              renderAllowed={
                <p className="text-primary">
                  Edycja komentarza będzie musiała zostać zweryfikowana.
                </p>
              }
            />
          </div>
        ) : (
          <p className="mt-2">{comment?.content}</p>
        )}

        {comment?.thumbnail !== '' && (
          <LoadableImage
            onClick={handleOpenGallery}
            height="6rem"
            width="13rem"
            className="rounded-sm"
            src={thumbnailSrc}
          />
        )}

        {!readyToDisplay && (
          <div className="text-red-500 mt-1">
            {COMMENT_NOT_APPROVED_MESSAGE}
          </div>
        )}
        <div className="flex justify-between items-center text-gray-500 text-md">
          <TimeFromNow date={comment?.createdAt} />
          {!isSubComment && readyToDisplay && (
            <ReplyButton
              onClick={handleSetReplyTarget}
              postId={comment?.id}
              postType={POST_TYPE_COMMENT}
            />
          )}
        </div>
      </div>
    </div>
  );
}
