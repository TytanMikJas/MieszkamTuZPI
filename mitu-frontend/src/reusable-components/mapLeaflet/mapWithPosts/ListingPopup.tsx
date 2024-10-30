import { FILES_URL } from '@/constants';
import ListingDto from '@/core/api/listing/dto/listing';
import MarkerablePostDto from '@/core/api/post/dto/markerable-post';
import { ROUTES } from '@/core/routing/Router';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import { buildAddress } from '@/utils/string-utils';
import { useNavigate } from 'react-router-dom';

interface ListingPopupProps {
  post: MarkerablePostDto;
}

export default function ListingPopup({ post }: ListingPopupProps) {
  const listing = post as ListingDto;
  const navigate = useNavigate();
  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.LISTING.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-64 font-sans">
      <LoadableImage
        onClick={() => handleClick(listing.slug)}
        className="rounded-lg"
        src={`${FILES_URL}${listing?.filePaths.IMAGE}${listing?.thumbnail}`}
        height="200px"
        width="100%"
      />

      <div className="text-lg font-bold leading-tight pt-1">
        {listing.title}
      </div>

      <div className="h-6 line-clamp-1">
        {buildAddress(listing.street, listing.buildingNr, listing.apartmentNr)}
      </div>
    </div>
  );
}
