import SortingButton from '@/reusable-components/sorting-button/SortingButton';
import {
  INVESTMENT_SORTING_PARAMS_BEST,
  INVESTMENT_SORTING_PARAMS_NEWEST,
  INVESTMENT_SORTING_PARAMS_OLDEST,
  INVESTMENT_SORTING_PARAMS_WORST,
} from '../../../../constants';
import { useInvestmentStore } from '../../../../core/stores/investment-store';
import {
  INVESTMENT_SORTING_OPTION_NEWEST_LABEL,
  INVESTMENT_SORTING_OPTION_OLDEST_LABEL,
  INVESTMENT_SORTING_OPTION_BEST_LABEL,
  INVESTMENT_SORTING_OPTION_WORST_LABEL,
} from '../../../../strings';

export default function InvestmentSorting() {
  const { setSortingParams, setSortingOption, sortingOption } =
    useInvestmentStore();
  const sortingOptions = [
    [
      INVESTMENT_SORTING_OPTION_NEWEST_LABEL,
      INVESTMENT_SORTING_OPTION_OLDEST_LABEL,
    ],
    [
      INVESTMENT_SORTING_OPTION_BEST_LABEL,
      INVESTMENT_SORTING_OPTION_WORST_LABEL,
    ],
  ];

  const sortingParams: any = {
    [INVESTMENT_SORTING_OPTION_NEWEST_LABEL]: INVESTMENT_SORTING_PARAMS_NEWEST,
    [INVESTMENT_SORTING_OPTION_OLDEST_LABEL]: INVESTMENT_SORTING_PARAMS_OLDEST,
    [INVESTMENT_SORTING_OPTION_BEST_LABEL]: INVESTMENT_SORTING_PARAMS_BEST,
    [INVESTMENT_SORTING_OPTION_WORST_LABEL]: INVESTMENT_SORTING_PARAMS_WORST,
  };

  return (
    <SortingButton
      callback={(option) => {
        setSortingParams(sortingParams[option]);
      }}
      options={sortingOptions}
      setCurrentOption={setSortingOption}
      currentOption={sortingOption}
      defaultOption={'Najnowsze'}
      menuAlignment={'end'}
    />
  );
}
