import ListingDto from '../api/listing/dto/listing';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import {
  FilterFieldRuleValue,
  FilterRule,
  SelectCardLoadingList,
  SortingParams,
} from '../../types';
import {
  LISTING_PAGE_SIZE,
  LISTING_SORTING_PARAMS_NEWEST,
} from '../../constants';

import { LISTING_SORTING_OPTION_NEWEST_LABEL } from '@/strings';

import ListingInputDto from '../api/listing/dto/listing.input';
import ListingInputPatchDto from '../api/listing/dto/listing-patch.input';

interface ListSection {
  listingsList: ListingDto[];
  loadingList: boolean;
  currentPageList: number;
  isMoreList: boolean;
  loadingListIds: string[];
}
interface DetailsSection {
  singleListing: ListingDto | null;
  singleListingLoading: boolean;
}

export interface ListingStore extends ListSection, DetailsSection {
  sortingParams: SortingParams;
  sortingOption: string;
  setSortingOption: (option: string) => void;
  filterFieldRuleValue: FilterFieldRuleValue;
  fetchListingsList: () => void;
  setSortingParams: (sortingParams: SortingParams) => void;
  setFilterParams: (filterValues: string[]) => void;
  selectCardLoadingList: SelectCardLoadingList;
  setSingleListing: (
    slug: string,
    onSuccess?: (listing: ListingDto) => void,
  ) => void;
  clearSingleListing: () => void;

  postListing: (
    listing: ListingInputDto,
    files: File[],
    onSuccess: () => void,
  ) => void;

  patchListing: (
    id: string,
    listing: ListingInputPatchDto,
    files: File[],
    onSuccess: (string: string) => void,
  ) => void;
  deleteListing: (id: string, onSuccess: () => void) => void;

  resetList: boolean;
  setResetList: (reset: boolean) => void;
}

const initialListSection: ListSection = {
  listingsList: [],
  loadingList: false,
  currentPageList: 0,
  isMoreList: true,
  loadingListIds: [],
};

const initialDetailsSection: DetailsSection = {
  singleListing: null,
  singleListingLoading: false,
};

interface CreatorSection {}

const initialCreatorSection: CreatorSection = {};

export const useListingStore = create<
  ListingStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialListSection,
    ...initialDetailsSection,
    ...initialCreatorSection,
    resetList: false,
    setResetList: (reset: boolean) => {
      set({ resetList: reset });
    },
    sortingParams: LISTING_SORTING_PARAMS_NEWEST,
    sortingOption: LISTING_SORTING_OPTION_NEWEST_LABEL,
    setSortingOption: (option: string) => {
      set({ sortingOption: option });
    },
    filterFieldRuleValue: new FilterFieldRuleValue('status', FilterRule.IN, []),
    fetchListingsList: async () => {
      const {
        loadingList,
        listingsList,
        currentPageList,
        sortingParams,
        filterFieldRuleValue,
      } = get();
      if (loadingList) return;
      set({ loadingList: true });

      axiosInstance
        .get<SuccessResponse<ListingDto[]>>('/listing', {
          params: {
            page: currentPageList,
            pageSize: LISTING_PAGE_SIZE,
            ...sortingParams,
            ...filterFieldRuleValue.parse(),
          },
        })
        .then((response) => {
          set({
            listingsList: [...listingsList, ...response.data.data],
            loadingList: false,
            currentPageList: currentPageList + 1,
            isMoreList: response.data.data.length === LISTING_PAGE_SIZE,
          });
        })
        .catch((error) => {
          set({ loadingList: false });
          console.error(error);
        });
    },
    setSortingParams(sortingParams: SortingParams) {
      const { fetchListingsList, sortingParams: currentSortingParams } = get();
      if (currentSortingParams === sortingParams) return;
      set({ sortingParams, ...initialListSection });
      fetchListingsList();
    },
    setFilterParams(filterValues: string[]) {
      const { fetchListingsList, filterFieldRuleValue: currentFilter } = get();
      if (JSON.stringify(currentFilter.value) === JSON.stringify(filterValues))
        return;
      currentFilter.value = filterValues;
      set({ filterFieldRuleValue: currentFilter, ...initialListSection });
      fetchListingsList();
    },
    selectCardLoadingList: (listingId: string) => {
      const { loadingListIds } = get();
      return loadingListIds.includes(listingId);
    },
    setSingleListing: (
      slug: string,
      onSuccess?: (listing: ListingDto) => void,
    ) => {
      set({ singleListingLoading: true });

      axiosInstance
        .get<SuccessResponse<ListingDto>>(`/listing/slug/${slug}`)
        .then((response) => {
          set({
            singleListing: response.data.data,
            singleListingLoading: false,
          });
          if (onSuccess) {
            onSuccess(response.data.data);
          }
        })
        .catch((error) => {
          set({ singleListingLoading: false });
        });
    },
    clearSingleListing: () => {
      set({ ...initialDetailsSection });
    },
    postListing: (
      listing: ListingInputDto,
      files: File[],
      onSuccess: () => void,
    ) => {
      const formData = new FormData();
      formData.append('title', listing.title);
      formData.append('locationX', listing.locationX.toString());
      formData.append('locationY', listing.locationY.toString());
      if (listing.street) formData.append('street', listing.street);
      if (listing.buildingNr) formData.append('buildingNr', listing.buildingNr);
      if (listing.apartmentNr)
        formData.append('apartmentNr', listing.apartmentNr);
      formData.append('responsible', listing.responsible);
      formData.append('sell', listing.sell.toString());
      formData.append('price', listing.price.toString());
      formData.append('surface', listing.surface.toString());
      formData.append('content', listing.content);
      formData.append('thumbnail', listing.thumbnail);
      files.forEach((file) => {
        formData.append('files', file);
      });

      // DO TEJ PORY JEST GIT
      axiosInstance
        .post<SuccessResponse<ListingDto>>('/listing', formData)
        .then((response) => {
          onSuccess();
        })
        .catch((error) => {});
    },
    patchListing: (
      id: string,
      listing: ListingInputPatchDto,
      files: File[],
      onSuccess: (string: string) => void,
    ) => {
      const formData = new FormData();
      if (listing.title) formData.append('title', listing.title);
      if (listing.locationX)
        formData.append('locationX', listing.locationX.toString());
      if (listing.locationY)
        formData.append('locationY', listing.locationY.toString());
      if (listing.street || listing.street === '')
        formData.append('street', listing.street);
      if (listing.buildingNr || listing.buildingNr === '')
        formData.append('buildingNr', listing.buildingNr);
      if (listing.apartmentNr || listing.apartmentNr === '')
        formData.append('apartmentNr', listing.apartmentNr);
      if (listing.responsible)
        formData.append('responsible', listing.responsible);
      if (listing.content) formData.append('content', listing.content);
      if (listing.thumbnail) formData.append('thumbnail', listing.thumbnail);
      if (listing.exclude) formData.append('exclude', listing.exclude);
      if (listing.sell) formData.append('sell', listing.sell.toString());
      if (listing.price) formData.append('price', listing.price.toString());
      if (listing.surface)
        formData.append('surface', listing.surface.toString());

      files.forEach((file) => {
        formData.append('files', file);
      });

      axiosInstance
        .patch<SuccessResponse<string>>(`/listing/one/${id}`, formData)
        .then((response) => {
          onSuccess(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteListing: (id: string, onSuccess: () => void) => {
      const { listingsList } = get();
      axiosInstance
        .delete(`/listing/one/${id}`)
        .then(() => {
          onSuccess();
          set({
            singleListing: null,
            listingsList: listingsList.filter(
              (listing) => `${listing.id}` !== id,
            ),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  })),
);
