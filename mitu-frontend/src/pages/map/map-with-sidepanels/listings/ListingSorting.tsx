import {
  LISTING_SORTING_PARAMS_NEWEST,
  LISTING_SORTING_PARAMS_OLDEST,
} from '../../../../constants';
import SortingButton from '@/reusable-components/sorting-button/SortingButton';
import {
  LISTING_SORTING_OPTION_NEWEST_LABEL,
  LISTING_SORTING_OPTION_OLDEST_LABEL,
} from '../../../../strings';
import { useListingStore } from '@/core/stores/listing-store';

export default function ListingSorting() {
  const { setSortingParams, setSortingOption, sortingOption } =
    useListingStore();

  const sortingOptions = [
    [LISTING_SORTING_OPTION_NEWEST_LABEL, LISTING_SORTING_OPTION_OLDEST_LABEL],
  ];

  const sortingParams: any = {
    [LISTING_SORTING_OPTION_NEWEST_LABEL]: LISTING_SORTING_PARAMS_NEWEST,
    [LISTING_SORTING_OPTION_OLDEST_LABEL]: LISTING_SORTING_PARAMS_OLDEST,
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
