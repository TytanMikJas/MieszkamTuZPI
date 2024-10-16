import { useAnnouncementStore } from '@/core/stores/announcement-store';
import {
  ANNOUNCEMENT_SORTING_PARAMS_BEST,
  ANNOUNCEMENT_SORTING_PARAMS_NEWEST,
  ANNOUNCEMENT_SORTING_PARAMS_OLDEST,
  ANNOUNCEMENT_SORTING_PARAMS_WORST,
} from '../../../../constants';
import SortingButton from '../../../../reusable-components/SortingButton';
import {
  ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL,
  ANNOUNCEMENT_SORTING_OPTION_OLDEST_LABEL,
  ANNOUNCEMENT_SORTING_OPTION_BEST_LABEL,
  ANNOUNCEMENT_SORTING_OPTION_WORST_LABEL,
} from '../../../../strings';

export default function AnnouncementSorting() {
  const { setSortingParams, setSortingOption, sortingOption } =
    useAnnouncementStore();

  const sortingOptions = [
    [
      ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL,
      ANNOUNCEMENT_SORTING_OPTION_OLDEST_LABEL,
    ],
    [
      ANNOUNCEMENT_SORTING_OPTION_BEST_LABEL,
      ANNOUNCEMENT_SORTING_OPTION_WORST_LABEL,
    ],
  ];

  const sortingParams: any = {
    [ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL]:
      ANNOUNCEMENT_SORTING_PARAMS_NEWEST,
    [ANNOUNCEMENT_SORTING_OPTION_OLDEST_LABEL]:
      ANNOUNCEMENT_SORTING_PARAMS_OLDEST,
    [ANNOUNCEMENT_SORTING_OPTION_BEST_LABEL]: ANNOUNCEMENT_SORTING_PARAMS_BEST,
    [ANNOUNCEMENT_SORTING_OPTION_WORST_LABEL]:
      ANNOUNCEMENT_SORTING_PARAMS_WORST,
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
