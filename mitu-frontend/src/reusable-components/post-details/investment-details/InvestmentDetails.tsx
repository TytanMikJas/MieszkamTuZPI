import { Separator } from '../../../shadcn/separator';
import IconLabel from '../../misc/icon-label/IconLabel';
import AttachmentsArea from '../attachments-area/AttachmentsArea';
import BadgesArea from './badges-area/BadgesArea';
import ImageBackgroundContainer from './image-background/ImageBackgroundContainer';
import { useInvestmentStore } from '../../../core/stores/investment-store';
import NotFound from '../../not-found/NotFound';
import { useEffect } from 'react';
import PanelLoader from '../../loaders/PanelLoader';
import { investmentStatusParser } from '../../../utils';
import { useUiStore } from '@/core/stores/ui-store';
import {
  FILE_IMAGE_NAME,
  FILE_TD_NAME,
  RIGHTBAR_STAGE_MAP,
  RIGHTBAR_STAGE_MODEL,
} from '@/strings';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import AuthGuard from '@/core/auth/AuthGuard';
import IconButton from '@/reusable-components/IconButton';
import { Role } from '@/core/auth/roles';
import EditIcon from '@/reusable-components/icons/edit-icon/EditIcon';
import { useNavigate } from 'react-router-dom';
import { INVESTMENT, ROUTES } from '@/core/routing/Router';
import ToggleButton from '@/reusable-components/buttons/ToggleButton';
import { useGalleryStore } from '@/core/stores/gallery-store';
import GalleryIcon from '@/reusable-components/icons/gallery-icon/GalleryIcon';
import ModelIcon from '@/reusable-components/icons/model-icon/ModelIcon';
import { FILES_URL } from '@/constants';
import InvestmentDto from '@/core/api/investment/dto/investment';
import DeletePostIcon from '@/reusable-components/icons/delete-icon/DeletePostIcon';
import { buildAddress } from '@/utils/string-utils';

export default function InvestmentDetails() {
  const {
    singleInvestment: investment,
    singleInvestmentLoading: loading,
    setSingleInvestment,
    deleteInvestment,
  } = useInvestmentStore();

  const { setRightbarStage, rightbarStage } = useUiStore();
  const { visible, openGallery } = useGalleryStore();
  const navigate = useNavigate();
  const uiStore = useUiStore();

  const slug = window.location.pathname.split(`${INVESTMENT}/`).pop();
  useEffect(() => {
    setSingleInvestment(slug!, (investment: InvestmentDto) => {
      if (investment.isCommentable) {
        uiStore.openBothPanels();
      } else {
        uiStore.openOnlyLeftPanel();
      }
    });
  }, [investment?.id, slug]);

  const handleNavigateEdit = () => {
    if (investment?.slug) {
      navigate(ROUTES.MAP.INVESTMENT_EDIT.BY_NAME.path(investment.slug));
    }
  };

  const navigateList = () => {
    navigate(ROUTES.MAP.INVESTMENTS.path());
  };

  const handleDelete = () => {
    deleteInvestment(`${investment?.id}`, navigateList);
  };

  const images =
    investment?.attachments
      .filter(
        (attachment: AttachmentDto) => attachment.fileType === FILE_IMAGE_NAME,
      )
      .map((attachment: AttachmentDto) => ({
        src: `${FILES_URL}${investment?.filePaths.IMAGE}${attachment.fileName}`,
      })) || [];

  const handleOpenGallery = () => {
    openGallery(images);
  };

  return loading ? (
    <PanelLoader />
  ) : investment ? (
    <div className="flex flex-col p-2 md:p-4 bg-white gap-5 relative">
      <ImageBackgroundContainer
        url={`${FILES_URL}${investment.filePaths.IMAGE}${investment.thumbnail}`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex  justify-between items-center">
            <h2 className="text-xl font-bold">{investment.title}</h2>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <IconLabel
            verified={false}
            text={investment.responsible}
            icon="person"
          />
          <IconLabel text={investment.category?.name} icon="category" />
          <IconLabel
            text={investmentStatusParser[investment.status]}
            icon="manufacturing"
          />
          <IconLabel
            text={buildAddress(
              investment.street,
              investment.buildingNr,
              investment.apartmentNr,
            )}
            icon="location_on"
          />
        </div>
        <Separator className="my-4" />
        <div className="text-justify">{investment.content}</div>
      </ImageBackgroundContainer>
      <BadgesArea badges={investment.badges} />
      <AttachmentsArea
        filePaths={investment.filePaths}
        attachments={investment.attachments}
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
    </div>
  ) : (
    <NotFound />
  );
}
