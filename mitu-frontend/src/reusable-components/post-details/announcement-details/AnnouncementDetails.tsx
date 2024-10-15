import { useAnnouncementStore } from '@/core/stores/announcement-store';
import { Announcement } from '../../../mock-data';

import UserInfo from '../../misc/user-info/UserInfo';
import AttachmentsArea from '../attachments-area/AttachmentsArea';
import Rating from '../rating/Rating';
import { FILES_URL } from '@/constants';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import { useGalleryStore } from '@/core/stores/gallery-store';
import { useUiStore } from '@/core/stores/ui-store';
import {
  RIGHTBAR_STAGE_MODEL,
  RIGHTBAR_STAGE_MAP,
  FILE_IMAGE_NAME,
} from '@/strings';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotFound from '@/reusable-components/not-found/NotFound';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import AuthGuard from '@/core/auth/AuthGuard';
import { Role } from '@/core/auth/roles';
import ToggleButton from '@/reusable-components/buttons/ToggleButton';
import IconButton from '@/reusable-components/IconButton';
import GalleryIcon from '@/reusable-components/icons/gallery-icon/GalleryIcon';
import { EditIcon } from 'lucide-react';
import { ANNOUNCEMENT, ROUTES } from '@/core/routing/Router';
import TimeFromNow from '@/reusable-components/time/TimeFromNow';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import AnnouncementDto from '@/core/api/announcement/dto/announcement';
import { LatLng } from 'leaflet';
import DeletePostIcon from '@/reusable-components/icons/delete-icon/DeletePostIcon';
import ShareButtons from "@/reusable-components/ShareButtons/ShareButtons";

export default function AnnouncementDetails() {
  const {
    singleAnnouncement: announcement,
    singleAnnouncementLoading: loading,
    setSingleAnnouncement,
    performVoteDetails,
    singleAnnouncementRatingLoading,
    deleteAnnouncement,
  } = useAnnouncementStore();

  const { setRightbarStage } = useUiStore();
  const { visible, openGallery } = useGalleryStore();
  const navigate = useNavigate();
  const uiStore = useUiStore();
  const slug = window.location.pathname.split(`${ANNOUNCEMENT}/`).pop();
  useEffect(() => {
    setSingleAnnouncement(slug!, (announcement: AnnouncementDto) => {
      if (announcement.isCommentable) {
        uiStore.openBothPanels();
      } else {
        uiStore.openOnlyLeftPanel();
      }
    });
  }, [announcement?.id, slug]);

  useEffect(() => {
    return () => {
      handleSetMapStage();
    };
  }, []);

  const handleSetMapStage = () => {
    setRightbarStage(RIGHTBAR_STAGE_MAP);
  };

  const images = announcement?.attachments
    .filter(
      (attachment: AttachmentDto) => attachment.fileType === FILE_IMAGE_NAME,
    )
    .map((attachment: AttachmentDto) => ({
      src: `${FILES_URL}${announcement?.filePaths.IMAGE}${attachment.fileName}`,
    }));

  const handleOpenGallery = () => {
    openGallery(images);
  };

  const navigateList = () => {
    navigate(ROUTES.MAP.ANNOUNCEMENTS.path());
  };

  const handleNavigateEdit = () => {
    navigate(ROUTES.MAP.ANNOUNCEMENT_EDIT.BY_NAME.path(announcement?.slug));
  };

  const handleDelete = () => {
    deleteAnnouncement(`${announcement?.id}`, navigateList);
  };

  return loading ? (
    <PanelLoader />
  ) : announcement ? (
    <div className="flex flex-col p-6 bg-white rounded-lg gap-5">
      <LoadableImage
        className="h-24 md:h-52 rounded-lg"
        src={`${FILES_URL}${announcement.filePaths.IMAGE}${announcement.thumbnail}`}
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between items-baseline">
          <h2 className="text-xl font-semibold">{announcement.title}</h2>
          <div>
            <TimeFromNow date={announcement.createdAt} />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <UserInfo
            url={announcement.responsible}
            fullName={announcement.responsible}
          />
          <div>
            <Rating
              postId={`${announcement.id}`}
              upvoteCount={announcement.upvoteCount}
              downvoteCount={announcement.downvoteCount}
              currentVote={announcement.personalRating}
              loading={singleAnnouncementRatingLoading}
              callback={performVoteDetails}
            />
          </div>
        </div>
      </div>
      <div className="text-justify">{announcement.content}</div>
      <AttachmentsArea
        filePaths={announcement.filePaths}
        attachments={announcement.attachments}
      />
      <AuthGuard
        allowedRoles={[Role.OFFICIAL]}
        renderAllowed={
          <div className="flex gap-4 justify-center">
            <IconButton
              text={'Edytuj'}
              icon={<EditIcon />}
              onClick={handleNavigateEdit}
            />

            <DeletePostIcon onClick={handleDelete} />
          </div>
        }
      />

      <ToggleButton
        icon={<GalleryIcon />}
        onClick={handleOpenGallery}
        isActive={visible}>
        <>Galeria zdjęć</>
      </ToggleButton>

      <div className={'justify-center align-middle flex '}>
        <ShareButtons url={window.location.href}
                      buttonSize={48}
                      thumbnail={`${announcement.filePaths.IMAGE}${announcement.thumbnail}`}
        />
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
