import { Separator } from '../../../shadcn/separator';
import IconLabel from '../../misc/icon-label/IconLabel';
import AttachmentsArea from '../attachments-area/AttachmentsArea';
import NotFound from '../../not-found/NotFound';
import { useEffect } from 'react';
import PanelLoader from '../../loaders/PanelLoader';
import { useUiStore } from '@/core/stores/ui-store';
import {
  FILE_IMAGE_NAME,
  FILE_TD_NAME,
  RIGHTBAR_STAGE_MAP,
  RIGHTBAR_STAGE_MODEL,
  SELL_FALSE,
  SELL_TRUE,
} from '@/strings';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';

import AuthGuard from '@/core/auth/AuthGuard';
import IconButton from '@/reusable-components/IconButton';
import { Role } from '@/core/auth/roles';
import EditIcon from '@/reusable-components/icons/edit-icon/EditIcon';
import { useNavigate } from 'react-router-dom';
import { LISTING, ROUTES } from '@/core/routing/Router';

import ToggleButton from '@/reusable-components/buttons/ToggleButton';
import { useGalleryStore } from '@/core/stores/gallery-store';
import GalleryIcon from '@/reusable-components/icons/gallery-icon/GalleryIcon';
import { FILES_URL } from '@/constants';
import { useListingStore } from '@/core/stores/listing-store';
import ListingDto from '@/core/api/listing/dto/listing';
import Price from '../price/Price';
import { buildAddress, transformSurface } from '@/utils/string-utils';
import ImageBackgroundContainer from '../investment-details/image-background/ImageBackgroundContainer';
import DeletePostIcon from '@/reusable-components/icons/delete-icon/DeletePostIcon';
import { useMapSettingsStore } from '@/core/stores/map/map-settings-store';
import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import { LatLng } from 'leaflet';

export default function ListingDetails() {
  const {
    singleListing: listing,
    singleListingLoading: loading,
    setSingleListing,
    deleteListing,
  } = useListingStore();

  const { setRightbarStage, rightbarStage } = useUiStore();
  const { visible, openGallery } = useGalleryStore();
  const { setCenterWithForce } = useMapSettingsStore();
  const { setSpecificPostWithForce } = useMapWithPostsStore();
  const navigate = useNavigate();
  const uiStore = useUiStore();
  const slug = window.location.pathname.split(`${LISTING}/`).pop();

  useEffect(() => {
    setSingleListing(slug!, (listing: ListingDto) => {
      uiStore.openOnlyLeftPanel();

      setCenterWithForce(new LatLng(listing.locationX, listing.locationY));
      setSpecificPostWithForce(listing);
    });
  }, [listing?.id, slug]);

  const handleSetMapStage = () => {
    setRightbarStage(RIGHTBAR_STAGE_MAP);
  };

  const handleNavigateEdit = () => {
    if (listing?.slug) {
      navigate(ROUTES.MAP.LISTING_EDIT.BY_NAME.path(listing.slug));
    }
  };

  useEffect(() => {
    return () => {
      handleSetMapStage();
    };
  }, []);

  const images =
    listing?.attachments
      .filter(
        (attachment: AttachmentDto) => attachment.fileType === FILE_IMAGE_NAME,
      )
      .map((attachment: AttachmentDto) => ({
        src: `${FILES_URL}${listing?.filePaths.IMAGE}${attachment.fileName}`,
      })) || [];

  const handleOpenGallery = () => {
    openGallery(images);
  };

  const navigateList = () => {
    navigate(ROUTES.MAP.LISTINGS.path());
  };

  const handleDelete = () => {
    deleteListing(`${listing?.id}`, navigateList);
  };

  return loading ? (
    <PanelLoader />
  ) : listing ? (
    <div className="flex flex-col p-2 md:p-6 bg-white rounded-lg gap-5 relative">
      <ImageBackgroundContainer
        url={`${FILES_URL}${listing.filePaths.IMAGE}${listing.thumbnail}`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex  justify-between items-baseline">
            <h2 className="text-xl font-bold">{listing.title}</h2>
            <Price price={listing.price} sell={listing.sell} />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <IconLabel
            verified={false}
            text={listing.responsible}
            icon="person"
          />
          <IconLabel
            text={listing?.sell ? SELL_TRUE : SELL_FALSE}
            icon="sell"
          />
          <IconLabel
            text={transformSurface(listing?.surface)}
            icon="straighten"
          />
          <IconLabel
            text={buildAddress(
              listing.street,
              listing.buildingNr,
              listing.apartmentNr,
            )}
            icon="location_on"
          />
        </div>
        <Separator className="my-4" />
        <div className="text-justify">{listing.content}</div>
      </ImageBackgroundContainer>
      <AttachmentsArea
        filePaths={listing.filePaths}
        attachments={listing.attachments}
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
        isActive={visible}
      >
        <span>Galeria zdjęć</span>
      </ToggleButton>

      <div className={'justify-center align-middle flex '}>
        {/* // TODO add share buttons here in later sprint */}
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
