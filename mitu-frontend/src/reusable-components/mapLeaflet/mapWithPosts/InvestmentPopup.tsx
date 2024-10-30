import { FILES_URL } from '@/constants';
import InvestmentDto from '@/core/api/investment/dto/investment';
import MarkerablePostDto from '@/core/api/post/dto/markerable-post';
import { ROUTES } from '@/core/routing/Router';
import LoadableImage from '@/reusable-components/misc/lazy-loaded-image/LoadableImage';
import { buildAddress } from '@/utils/string-utils';
import { useNavigate } from 'react-router-dom';

interface InvestmentPopupProps {
  post: MarkerablePostDto;
}

export default function InvestmentPopup({ post }: InvestmentPopupProps) {
  const investment = post as InvestmentDto;
  const navigate = useNavigate();
  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.INVESTMENT.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-64 font-sans space-y-1">
      <LoadableImage
        onClick={() => handleClick(investment.slug)}
        className="rounded-lg"
        src={`${FILES_URL}${investment?.filePaths.IMAGE}${investment?.thumbnail}`}
        height="200px"
        width="100%"
      />

      <div className="text-lg font-bold leading-tight pt-1">
        {investment.title}
      </div>

      <div className="h-6 line-clamp-1">
        {buildAddress(
          investment.street,
          investment.buildingNr,
          investment.apartmentNr,
        )}
      </div>
    </div>
  );
}
