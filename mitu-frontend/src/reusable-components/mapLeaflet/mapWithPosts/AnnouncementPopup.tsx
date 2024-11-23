import { FILES_URL } from '@/constants';
import AnnouncementDto from '@/core/api/announcement/dto/announcement';
import MarkerablePostDto from '@/core/api/post/dto/markerable-post';
import { ROUTES } from '@/core/routing/Router';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import { buildAddress } from '@/utils/string-utils';
import { useNavigate } from 'react-router-dom';

interface AnnouncementPopupProps {
  post: MarkerablePostDto;
}

export default function AnnouncementPopup({ post }: AnnouncementPopupProps) {
  const announcement = post as AnnouncementDto;
  const navigate = useNavigate();
  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.ANNOUNCEMENT.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-64 font-sans">
      <LoadableImage
        onClick={() => handleClick(announcement.slug)}
        className="rounded-lg"
        src={`${FILES_URL}${announcement?.filePaths.IMAGE}${announcement?.thumbnail}`}
        height="200px"
        width="100%"
      />
      <div
        className="font-bold hover:text-primary duration-1 ease-in cursor-pointer pt-1 leading-tight text-base"
        onClick={() => handleClick(announcement.slug)}
      >
        {announcement.title}
      </div>
      <div className="line-clamp-1">
        {buildAddress(
          announcement.street,
          announcement.buildingNr,
          announcement.apartmentNr,
        )}
      </div>
    </div>
  );
}
