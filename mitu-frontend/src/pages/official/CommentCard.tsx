import { FILES_URL } from '@/constants';
import CommentDto from '@/core/api/common/comment/CommentDto';
import { Role } from '@/core/auth/roles';
import { useGalleryStore } from '@/core/stores/gallery-store';
import { useOfficialStore } from '@/core/stores/official-store';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import UserInfo from '@/reusable-components/misc/user-info/UserInfo';
import TimeFromNow from '@/reusable-components/time/TimeFromNow';

export default function OfficialCommentCard({
  comment,
}: {
  comment: CommentDto;
}) {
  const { getCommentLoading, postApproveComment, postRejectComment } =
    useOfficialStore();

  const loading = getCommentLoading(`${comment?.id}`);
  const { openGallery } = useGalleryStore();

  const handleReject = () => {
    postRejectComment(`${comment?.id}`);
  };
  const handleApprove = () => {
    postApproveComment(`${comment?.id}`);
  };

  const thumbnailSrc = `${FILES_URL}${comment?.filePaths.IMAGE}${comment?.thumbnail}`;

  const handleOpenGallery = () => {
    openGallery([{ src: thumbnailSrc }]);
  };

  return (
    <div className="flex flex-col relative w-lg rounded-lg overflow-hidden shadow justify-between">
      {loading && (
        <div className="absolute flex just-center items-center h-full w-full z-10 bg-black bg-opacity-15">
          <PanelLoader />
        </div>
      )}
      <div className="flex items-start space-x-4 p-2 w-full pb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <UserInfo
              url={comment?.createdBy?.avatar}
              fullName={
                comment?.createdBy?.firstName +
                ' ' +
                comment?.createdBy?.lastName
              }
              verified={comment?.createdBy?.role === Role.OFFICIAL}
            />
          </div>
          <p className="mt-2">{comment?.content}</p>
          {comment?.thumbnail !== '' && (
            <LoadableImage
              onClick={handleOpenGallery}
              height="6rem"
              width="13rem"
              className="rounded-sm"
              src={thumbnailSrc}
            />
          )}
          <div className="">
            <TimeFromNow date={comment?.createdAt} />
          </div>
        </div>
      </div>

      <div className="flex">
        <div
          onClick={handleApprove}
          className="flex w-full p-3 items-center justify-center text-white bg-green-700 hover:bg-green-500 ease-in duration-100 cursor-pointer"
        >
          ZAAKCEPTUJ
        </div>
        <div
          onClick={handleReject}
          className="flex w-full p-3 items-center justify-center text-white bg-primary hover:bg-blue-500 ease-in duration-100 cursor-pointer"
        >
          ODRZUC
        </div>
      </div>
    </div>
  );
}
