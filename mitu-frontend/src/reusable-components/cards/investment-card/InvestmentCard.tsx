import { buildAddress, mapInvestmentStatusToLabel } from '@/utils/string-utils';
import InvestmentDto from '../../../core/api/investment/dto/investment';
import { Separator } from '../../../shadcn/separator';
import { SelectCardLoadingList } from '../../../types'; // TODO: Check if this import is correct
import IconLabel from '../../misc/icon-label/IconLabel';
import LoadableImage from '../../misc/lazy-loaded-image/LoadableImage';
import TruncateAuto from '../../misc/truncate/TruncateAuto';
import { FILES_URL } from '@/constants';

export default function InvestmentCard({
  investment,
  selectCardLoadingList,
  onClick,
}: {
  investment: InvestmentDto;
  selectCardLoadingList: SelectCardLoadingList;
  onClick: () => void;
}) {
  const ratingLoading = selectCardLoadingList(`${investment?.id}`);

  return (
    <div className="flex flex-col relative gap-2 w-full md:max-w-64 max-w-72 min-w-32">
      <LoadableImage
        onClick={onClick}
        className="rounded-lg"
        src={`${FILES_URL}${investment?.filePaths.IMAGE}${investment?.thumbnail}`}
        height="200px"
        width="100%"
      />
      <div className="flex flex-col gap-1">
        <TruncateAuto
          text={investment?.title}
          tooltip={true}
          maxLines={2}
          classNames="text-lg font-bold z-[500]"
        />
        <div className="flex items-center space-x-1 justify-between">
          <div className="h-6 line-clamp-1">
            {buildAddress(
              investment.street,
              investment.buildingNr,
              investment.apartmentNr,
            )}
          </div>
        </div>
      </div>
      <Separator className="my-1 bg-gray-300" />
      <div className="flex flex-col gap-1">
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            verified={false}
            text={investment.responsible}
            icon="person"
          />
        </div>
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            text={investment?.category?.name}
            icon="category"
          />
        </div>
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            text={mapInvestmentStatusToLabel(investment?.status)}
            icon="manufacturing"
          />
        </div>
      </div>
    </div>
  );
}
