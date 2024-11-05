import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import InvestmentDto from '../api/investment/dto/investment';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import {
  FilterFieldRuleValue,
  FilterRule,
  InvestmentStatus,
  PerformVote,
  SelectCardLoadingList,
  SortingParams,
} from '../../types';
import {
  INVESTMENT_PAGE_SIZE,
  INVESTMENT_SORTING_PARAMS_NEWEST,
} from '../../constants';

import CategoryDto from '../api/investment/dto/category';
import BadgeDto from '../api/investment/dto/badge';
import {
  INVESTMENT_SORTING_OPTION_NEWEST_LABEL,
  INVESTMENT_STATUS_NAME_APPROVED,
  INVESTMENT_STATUS_NAME_COMPLETED,
  INVESTMENT_STATUS_NAME_IN_PROGRESS,
  INVESTMENT_STATUS_NAME_PENDING,
  INVESTMENT_STATUS_NAME_REJECTED,
} from '@/strings';
import InvestmentInputDto from '../api/investment/dto/investment.input';
import InvestmentInputPatchDto from '../api/investment/dto/investment-patch.input';
import {
  ratingsToRatingCountIncrements,
  RatingTypeToAttribute,
} from '../api/common/rating/RatingUtils';
import { RatingType, RatingDto } from '../api/common/rating/RatingDto';

interface ListSection {
  investmentsList: InvestmentDto[];
  loadingList: boolean;
  currentPageList: number;
  isMoreList: boolean;
  loadingListIds: string[];
}

interface DetailsSection {
  singleInvestment: InvestmentDto | null;
  singleInvestmentLoading: boolean;
  singleInvestmentRatingLoading: boolean;
}

interface CreatorSection {
  statuses: InvestmentStatus[];
  badges: BadgeDto[];
  categories: CategoryDto[];
}

export interface InvestmentStore
  extends ListSection,
    DetailsSection,
    CreatorSection {
  resetList: boolean;
  setResetList: (reset: boolean) => void;
  sortingParams: SortingParams;
  sortingOption: string;
  setSortingOption: (option: string) => void;
  filterFieldRuleValue: FilterFieldRuleValue;
  fetchInvestmentsList: () => void;
  setSortingParams: (sortingParams: SortingParams) => void;
  setFilterParams: (filterValues: string[]) => void;
  selectCardLoadingList: SelectCardLoadingList;
  performVoteList: PerformVote;
  performVoteDetails: PerformVote;
  setSingleInvestment: (
    slug: string,
    onSuccess: (investment: InvestmentDto) => void,
  ) => void;
  clearSingleInvestment: () => void;
  fetchAvailableBadges: () => void;
  fetchAvailableCategories: () => void;
  postInvestment: (
    investment: InvestmentInputDto,
    files: File[],
    onSuccess: () => void,
  ) => void;

  patchInvestment: (
    id: string,
    investment: InvestmentInputPatchDto,
    files: File[],
    onSuccess: (slug: string) => void,
  ) => void;
  deleteInvestment: (id: string, onSuccess: () => void) => void;
}

const initialListSection: ListSection = {
  investmentsList: [],
  loadingList: false,
  currentPageList: 0,
  isMoreList: true,
  loadingListIds: [],
};

const initialDetailsSection: DetailsSection = {
  singleInvestment: null,
  singleInvestmentLoading: false,
  singleInvestmentRatingLoading: false,
};

const initialCreatorSection: CreatorSection = {
  statuses: [
    INVESTMENT_STATUS_NAME_APPROVED,
    INVESTMENT_STATUS_NAME_COMPLETED,
    INVESTMENT_STATUS_NAME_IN_PROGRESS,
    INVESTMENT_STATUS_NAME_PENDING,
    INVESTMENT_STATUS_NAME_REJECTED,
  ],
  badges: [],
  categories: [],
};

export const useInvestmentStore = create<
  InvestmentStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialListSection,
    ...initialDetailsSection,
    ...initialCreatorSection,
    sortingParams: INVESTMENT_SORTING_PARAMS_NEWEST,
    sortingOption: INVESTMENT_SORTING_OPTION_NEWEST_LABEL,
    filterFieldRuleValue: new FilterFieldRuleValue('status', FilterRule.IN, []),
    setSortingOption: (option: string) => {
      set({ sortingOption: option });
    },
    resetList: false,
    setResetList: (reset: boolean) => {
      set({ resetList: reset });
    },
    fetchInvestmentsList: async () => {
      const {
        loadingList,
        investmentsList,
        currentPageList,
        sortingParams,
        filterFieldRuleValue,
      } = get();
      if (loadingList) return;
      set({ loadingList: true });
      axiosInstance
        .get<SuccessResponse<InvestmentDto[]>>('/investment', {
          params: {
            page: currentPageList,
            pageSize: INVESTMENT_PAGE_SIZE,
            ...sortingParams,
            ...filterFieldRuleValue.parse(),
          },
        })
        .then((response) => {
          set({
            investmentsList: [...investmentsList, ...response.data.data],
            loadingList: false,
            currentPageList: currentPageList + 1,
            isMoreList: response.data.data.length === INVESTMENT_PAGE_SIZE,
          });
        })
        .catch((error) => {
          set({ loadingList: false });
          console.error(error);
        });
    },
    setSortingParams(sortingParams: SortingParams) {
      const { fetchInvestmentsList, sortingParams: currentSortingParams } =
        get();
      if (currentSortingParams === sortingParams) return;
      set({ sortingParams, ...initialListSection });
      fetchInvestmentsList();
    },
    setFilterParams(filterValues: string[]) {
      const { fetchInvestmentsList, filterFieldRuleValue: currentFilter } =
        get();
      if (JSON.stringify(currentFilter.value) === JSON.stringify(filterValues))
        return;
      currentFilter.value = filterValues;
      set({ filterFieldRuleValue: currentFilter, ...initialListSection });
      fetchInvestmentsList();
    },
    selectCardLoadingList: (investmentId: string) => {
      const { loadingListIds } = get();
      return loadingListIds.includes(investmentId);
    },
    setSingleInvestment: (
      slug: string,
      onSuccess: (investment: InvestmentDto) => void,
    ) => {
      set({ singleInvestmentLoading: true });
      axiosInstance
        .get<SuccessResponse<InvestmentDto>>(`/investment/slug/${slug}`)
        .then((response) => {
          set({
            singleInvestment: response.data.data,
            singleInvestmentLoading: false,
          });
          onSuccess(response.data.data);
        })
        .catch((error) => {
          set({ singleInvestmentLoading: false });
        });
    },
    clearSingleInvestment: () => {
      set({ ...initialDetailsSection });
    },
    fetchAvailableBadges: () => {
      axiosInstance
        .get<SuccessResponse<BadgeDto[]>>('/investment/badges')
        .then((response) => {
          set({ badges: response.data.data });
        })
        .catch((error) => {});
    },
    fetchAvailableCategories: () => {
      axiosInstance
        .get<SuccessResponse<CategoryDto[]>>('/investment/categories')
        .then((response) => {
          set({ categories: response.data.data });
        })
        .catch((error) => {});
    },
    postInvestment: (
      investment: InvestmentInputDto,
      files: File[],
      onSuccess: () => void,
    ) => {
      const formData = new FormData();
      formData.append('title', investment.title);
      formData.append('locationX', investment.locationX.toString());
      formData.append('locationY', investment.locationY.toString());
      formData.append('area', investment.area);
      if (investment.street) formData.append('street', investment.street);
      if (investment.buildingNr)
        formData.append('buildingNr', investment.buildingNr);
      if (investment.apartmentNr)
        formData.append('apartmentNr', investment.apartmentNr);
      formData.append('responsible', investment.responsible);
      formData.append('isCommentable', investment.isCommentable.toString());
      formData.append('status', investment.status);
      formData.append('categoryName', investment.categoryName);
      formData.append('content', investment.content);
      formData.append('thumbnail', investment.thumbnail);
      if (investment.badges) formData.append('badges', investment.badges);
      files.forEach((file) => {
        formData.append('files', file);
      });
      axiosInstance
        .post<SuccessResponse<InvestmentDto>>('/investment', formData)
        .then((response) => {
          onSuccess();
        })
        .catch((error) => {});
    },
    patchInvestment: (
      id: string,
      investment: InvestmentInputPatchDto,
      files: File[],
      onSuccess: (slug: string) => void,
    ) => {
      const formData = new FormData();
      if (investment.title) formData.append('title', investment.title);
      if (investment.locationX)
        formData.append('locationX', investment.locationX.toString());
      if (investment.locationY)
        formData.append('locationY', investment.locationY.toString());
      if (investment.area) formData.append('area', investment.area);
      if (investment.street || investment.street === '')
        formData.append('street', investment.street);
      if (investment.buildingNr || investment.buildingNr === '')
        formData.append('buildingNr', investment.buildingNr);
      if (investment.apartmentNr || investment.apartmentNr === '')
        formData.append('apartmentNr', investment.apartmentNr);
      if (investment.responsible)
        formData.append('responsible', investment.responsible);
      if (investment.isCommentable !== undefined)
        formData.append('isCommentable', investment.isCommentable.toString());
      if (investment.status) formData.append('status', investment.status);
      if (investment.categoryName)
        formData.append('categoryName', investment.categoryName);
      if (investment.content) formData.append('content', investment.content);
      if (investment.thumbnail)
        formData.append('thumbnail', investment.thumbnail);
      if (investment.badges) formData.append('badges', investment.badges);
      if (investment.exclude) formData.append('exclude', investment.exclude);
      files.forEach((file) => {
        formData.append('files', file);
      });
      axiosInstance
        .patch<SuccessResponse<string>>(`/investment/one/${id}`, formData)
        .then((response) => {
          onSuccess(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteInvestment: (id: string, onSuccess: () => void) => {
      const { investmentsList } = get();
      axiosInstance
        .delete(`/investment/one/${id}`)
        .then(() => {
          onSuccess();
          set({
            singleInvestment: null,
            investmentsList: investmentsList.filter(
              (investment) => `${investment.id}` !== id,
            ),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    performVoteList: async (type: RatingType, investmentId: string) => {
      const { loadingListIds, investmentsList } = get();
      if (loadingListIds.includes(investmentId)) return;
      set({ loadingListIds: [...loadingListIds, investmentId] });
      axiosInstance
        .post<SuccessResponse<RatingDto>>(`/rating/${type}/${investmentId}`)
        .then((response) => {
          const ratedInvestment = investmentsList.find(
            (investment) => `${investment.id}` === investmentId,
          );

          if (ratedInvestment) {
            const returnedType = response.data.data.type;
            const oldType = ratedInvestment?.personalRating;
            const increments = ratingsToRatingCountIncrements(
              oldType,
              returnedType,
            );
            ratedInvestment.upvoteCount += increments.upvoteCountIncrement;
            ratedInvestment.downvoteCount += increments.downvoteCountIncrement;
            ratedInvestment['personalRating'] = returnedType;

            set({
              investmentsList: [...investmentsList],
              loadingListIds: loadingListIds.filter(
                (id) => id !== investmentId,
              ),
            });
          }
        })
        .catch((error) => {
          console.error(error);
          set({
            loadingListIds: loadingListIds.filter((id) => id !== investmentId),
          });
        });
    },
    performVoteDetails: async (type: RatingType, investmentId: string) => {
      const { singleInvestmentRatingLoading } = get();
      if (singleInvestmentRatingLoading) return;
      set({ singleInvestmentRatingLoading: true });
      const investments = get().investmentsList;
      const investmentFromList = investments.find(
        (investment) => `${investment.id}` === investmentId,
      );
      axiosInstance
        .post<SuccessResponse<RatingDto>>(`/rating/${type}/${investmentId}`)
        .then((response) => {
          const { singleInvestment } = get();
          if (singleInvestment) {
            const returnedType = response.data.data.type;
            const personalRating = singleInvestment.personalRating;
            const increments = ratingsToRatingCountIncrements(
              personalRating,
              returnedType,
            );

            singleInvestment.upvoteCount += increments.upvoteCountIncrement;
            singleInvestment.downvoteCount += increments.downvoteCountIncrement;
            singleInvestment['personalRating'] = returnedType;

            if (investmentFromList) {
              investmentFromList.upvoteCount += increments.upvoteCountIncrement;
              investmentFromList.downvoteCount +=
                increments.downvoteCountIncrement;
              investmentFromList['personalRating'] = returnedType;
            }
            set({ singleInvestment, singleInvestmentRatingLoading: false });
            set({
              investmentsList: [...investments],
            });
          }
        })
        .catch((error) => {
          set({ singleInvestmentRatingLoading: false });
        });
    },
  })),
);
