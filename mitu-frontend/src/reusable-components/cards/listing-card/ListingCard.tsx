import { transformSurface } from '@/utils/string-utils';
import { Separator } from '../../../shadcn/separator';
import IconLabel from '../../misc/icon-label/IconLabel';
import LoadableImage from '../../misc/lazy-loaded-image/LoadableImage';
import TruncateAuto from '../../misc/truncate/TruncateAuto';
import { FILES_URL } from '@/constants';
import ListingDto from '@/core/api/listing/dto/listing';
import Price from '@/reusable-components/post-details/price/Price';
import { SELL_FALSE, SELL_TRUE } from '@/strings';
import { buildAddress } from '@/utils/string-utils';

export default function ListingCard({
  listing,
  onClick,
}: {
  listing: ListingDto;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col relative gap-2 w-full md:max-w-64 max-w-72 min-w-32">
      <LoadableImage
        onClick={onClick}
        className="rounded-lg"
        src={`${FILES_URL}${listing?.filePaths.IMAGE}${listing?.thumbnail}`}
        height="200px"
        width="100%"
      />
      <div className="flex flex-col gap-1">
        <TruncateAuto
          text={listing?.title}
          tooltip={true}
          maxLines={1}
          classNames="text-lg font-bold z-[500]"
        />

        <div className="flex items-center space-x-1 justify-between">
          <TruncateAuto
            text={buildAddress(
              listing.street,
              listing.buildingNr,
              listing.apartmentNr,
            )}
            tooltip={true}
            maxLines={1}
            classNames="z-[999999]"
          />
          <Price sell={listing?.sell} price={listing?.price} />
        </div>
      </div>
      <Separator className="my-1 bg-gray-300" />
      <div className="flex flex-col gap-1">
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            verified={false}
            text={listing.responsible}
            icon="person"
          />
        </div>
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            text={listing?.sell ? SELL_TRUE : SELL_FALSE}
            icon="sell"
          />
        </div>
        <div className="h-6 overflow-hidden">
          <IconLabel
            size={26}
            text={transformSurface(listing?.surface)}
            icon="straighten"
          />
        </div>
      </div>
    </div>
  );
}
