import {
  DeleteComment,
  EditComment,
  FilterFieldRuleValue,
  FilterRule,
  GetDeleteCommentLoading,
  PerformVote,
  PostComment,
  SelectCardLoadingList,
  SetReplyTarget,
  SortingParams,
} from '@/types';
import AnnouncementDto from '../api/announcement/dto/announcement';
import CategoryDto from '../api/announcement/dto/category';
import AnnouncementInputDto from '../api/announcement/dto/announcement.input';
import AnnouncementInputPatchDto from '../api/announcement/dto/announcement-patch.input';
import { create } from 'zustand';
import {
  ANNOUNCEMENT_PAGE_SIZE,
  ANNOUNCEMENT_SORTING_PARAMS_NEWEST,
} from '@/constants';
import { ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL } from '@/strings';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import { RatingType, RatingDto } from '../api/common/rating/RatingDto';
import {
  ratingsToRatingCountIncrements,
  RatingTypeToAttribute,
} from '../api/common/rating/RatingUtils';

interface ListSection {
  announcementsList: AnnouncementDto[];
  loadingList: boolean;
  currentPageList: number;
  isMoreList: boolean;
  loadingListIds: string[];
}
interface DetailsSection {
  singleAnnouncement: AnnouncementDto | null;
  singleAnnouncementLoading: boolean;
  singleAnnouncementRatingLoading: boolean;

  isMoreComments: boolean;
  loadingComments: boolean;
  currentPageComments: number;
  replyParentId: string | null;
  postCommentLoading: boolean;
  deleteCommentLoadingList: string[];
}

interface CreatorSection {
  categories: CategoryDto[];
}

export interface AnnouncementStore
  extends ListSection,
    DetailsSection,
    CreatorSection {
  resetList: boolean;
  setResetList: (reset: boolean) => void;
  sortingParams: SortingParams;
  sortingOption: string;
  setSortingOption: (option: string) => void;
  filterFieldRuleValue: FilterFieldRuleValue;
  fetchAnnouncementsList: () => void;
  setSortingParams: (sortingParams: SortingParams) => void;
  setFilterParams: (filterValues: string[]) => void;
  performVoteList: PerformVote;
  performVoteDetails: PerformVote;
  selectCardLoadingList: SelectCardLoadingList;
  setSingleAnnouncement: (
    slug: string,
    onSuccess: (announcement: AnnouncementDto) => void,
  ) => void;
  clearSingleAnnouncement: () => void;

  fetchAvailableCategories: () => void;
  postAnnouncement: (
    announcement: AnnouncementInputDto,
    files: File[],
    onSuccess: () => void,
  ) => void;

  fetchAnnouncementComments: () => void;
  loadMoreSubcomments: (parentNodeId: string) => void;
  postComment: PostComment;
  setCommentReplyTarget: SetReplyTarget;
  clearCommentReplyTarget: () => void;

  patchAnnouncement: (
    id: string,
    Announcement: AnnouncementInputPatchDto,
    files: File[],
    onSuccess: (slug: string) => void,
  ) => void;
  deleteComment: DeleteComment;
  getLoadingDeleteComment: GetDeleteCommentLoading;
  editComment: EditComment;

  deleteAnnouncement: (id: string, onSuccess: () => void) => void;
}

const initialListSection: ListSection = {
  announcementsList: [],
  loadingList: false,
  currentPageList: 0,
  isMoreList: true,
  loadingListIds: [],
};

const initialDetailsSection: DetailsSection = {
  singleAnnouncement: null,
  singleAnnouncementLoading: false,
  singleAnnouncementRatingLoading: false,

  isMoreComments: true,
  loadingComments: false,
  currentPageComments: 0,
  replyParentId: null,
  postCommentLoading: false,
  deleteCommentLoadingList: [],
};

const initialCreatorSection: CreatorSection = {
  categories: [],
};

export const useAnnouncementStore = create<
  AnnouncementStore,
  [['zustand/devtools', never]]
>((set, get) => ({
  ...initialListSection,
  ...initialDetailsSection,
  ...initialCreatorSection,
  sortingParams: ANNOUNCEMENT_SORTING_PARAMS_NEWEST,
  sortingOption: ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL,
  setSortingOption: (option: string) => {
    set({ sortingOption: option });
  },
  resetList: false,
  setResetList: (reset: boolean) => {
    set({ resetList: reset });
  },
  filterFieldRuleValue: new FilterFieldRuleValue('status', FilterRule.IN, []),
  fetchAnnouncementsList: () => {
    const {
      loadingList,
      announcementsList,
      currentPageList,
      sortingParams,
      filterFieldRuleValue,
    } = get();
    if (loadingList) return;
    set({ loadingList: true });

    axiosInstance
      .get<SuccessResponse<AnnouncementDto[]>>('/announcement', {
        params: {
          page: currentPageList,
          pageSize: ANNOUNCEMENT_PAGE_SIZE,
          ...sortingParams,
          ...filterFieldRuleValue.parse(),
        },
      })
      .then((response) => {
        set({
          announcementsList: [...announcementsList, ...response.data.data],
          loadingList: false,
          currentPageList: currentPageList + 1,
          isMoreList: response.data.data.length === ANNOUNCEMENT_PAGE_SIZE,
        });
      })
      .catch((error) => {
        set({ loadingList: false, isMoreList: false });
        console.error(error);
      });
  },
  setSortingParams: (sortingParams: SortingParams) => {
    const { fetchAnnouncementsList, sortingParams: currentSortingParams } =
      get();
    if (currentSortingParams === sortingParams) return;
    set({ sortingParams, ...initialListSection });
    fetchAnnouncementsList();
  },
  setFilterParams: (filterValues: string[]) => {},
  selectCardLoadingList: (announcementId) => {
    const { loadingListIds } = get();
    return loadingListIds.includes(announcementId);
  },
  setSingleAnnouncement: (
    slug: string,
    onSuccess: (announcement: AnnouncementDto) => void,
  ) => {
    const { singleAnnouncementLoading } = get();
    if (singleAnnouncementLoading) return;
    set({ singleAnnouncementLoading: true });

    axiosInstance
      .get<SuccessResponse<AnnouncementDto>>(`/announcement/slug/${slug}`)
      .then((response) => {
        set({
          singleAnnouncement: response.data.data,
          singleAnnouncementLoading: false,
        });
        onSuccess(response.data.data);
      })
      .catch((error) => {
        set({ singleAnnouncementLoading: false });
      });
  },
  clearSingleAnnouncement: () => {
    set({ ...initialDetailsSection });
  },
  fetchAvailableBadges: () => {},
  fetchAvailableCategories: () => {
    axiosInstance
      .get<SuccessResponse<CategoryDto[]>>('/announcement/categories')
      .then((response) => {
        set({ categories: response.data.data });
      })
      .catch((error) => {});
  },
  postAnnouncement: (
    announcement: AnnouncementInputDto,
    files: File[],
    onSuccess: () => void,
  ) => {
    const formData = new FormData();
    formData.append('title', announcement.title);
    formData.append('locationX', announcement.locationX.toString());
    formData.append('locationY', announcement.locationY.toString());

    if (announcement.area) formData.append('area', announcement.area);

    if (announcement.street) formData.append('street', announcement.street);
    if (announcement.buildingNr)
      formData.append('buildingNr', announcement.buildingNr);
    if (announcement.apartmentNr)
      formData.append('apartmentNr', announcement.apartmentNr);

    formData.append('isCommentable', announcement.isCommentable.toString());
    formData.append('categoryName', announcement.categoryName);
    formData.append('content', announcement.content);
    formData.append('thumbnail', announcement.thumbnail);
    formData.append('responsible', announcement.responsible);
    files.forEach((file) => {
      formData.append('files', file);
    });

    axiosInstance
      .post<SuccessResponse<AnnouncementDto>>('/announcement', formData)
      .then((response) => {
        onSuccess();
      })
      .catch((error) => {});
  },

  fetchAnnouncementComments: () => {},
  loadMoreSubcomments: () => {},
  performVoteComment: () => {},
  perfomVoteSubcomment: () => {},
  postComment: () => {},
  setCommentReplyTarget: () => {},
  clearCommentReplyTarget: () => {},
  getReplyTarget: () => undefined,
  patchAnnouncement: (
    id: string,
    announcement: AnnouncementInputPatchDto,
    files: File[],
    onSuccess: (slug: string) => void,
  ) => {
    const formData = new FormData();
    if (announcement.title) formData.append('title', announcement.title);
    if (announcement.locationX)
      formData.append('locationX', announcement.locationX.toString());
    if (announcement.locationY)
      formData.append('locationY', announcement.locationY.toString());
    if (announcement.area) formData.append('area', announcement.area);
    if (announcement.street || announcement.street === '')
      formData.append('street', announcement.street);
    if (announcement.buildingNr || announcement.buildingNr === '')
      formData.append('buildingNr', announcement.buildingNr);
    if (announcement.apartmentNr || announcement.apartmentNr === '')
      formData.append('apartmentNr', announcement.apartmentNr);
    if (announcement.isCommentable !== undefined)
      formData.append('isCommentable', announcement.isCommentable.toString());
    if (announcement.categoryName)
      formData.append('categoryName', announcement.categoryName);
    if (announcement.content) formData.append('content', announcement.content);
    if (announcement.thumbnail)
      formData.append('thumbnail', announcement.thumbnail);
    if (announcement.exclude) formData.append('exclude', announcement.exclude);
    if (announcement.responsible)
      formData.append('responsible', announcement.responsible);

    files.forEach((file) => {
      formData.append('files', file);
    });

    axiosInstance
      .patch<SuccessResponse<string>>(`/announcement/one/${id}`, formData)
      .then((response) => {
        onSuccess(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  deleteComment: () => {},
  getLoadingDeleteComment: () => false,
  editComment: () => {},
  selectCommentById: () => undefined,
  deleteAnnouncement: (id: string, onSuccess: () => void) => {
    const { announcementsList } = get();
    axiosInstance
      .delete(`/announcement/one/${id}`)
      .then(() => {
        onSuccess();
        set({
          singleAnnouncement: null,
          announcementsList: announcementsList.filter(
            (announcement) => `${announcement.id}` !== id,
          ),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
  performVoteList: (type: RatingType, announcementId: string) => {
    const { loadingListIds, announcementsList } = get();
    if (loadingListIds.includes(announcementId)) return;
    set({ loadingListIds: [...loadingListIds, announcementId] });
    axiosInstance
      .post<SuccessResponse<RatingDto>>(`/rating/${type}/${announcementId}`)
      .then((response) => {
        const ratedAnnouncement = announcementsList.find(
          (investment) => `${investment.id}` === announcementId,
        );

        if (ratedAnnouncement) {
          const returnedType = response.data.data.type;
          const oldType = ratedAnnouncement?.personalRating;

          const increments = ratingsToRatingCountIncrements(
            oldType,
            returnedType,
          );
          ratedAnnouncement.upvoteCount += increments.upvoteCountIncrement;
          ratedAnnouncement.downvoteCount += increments.downvoteCountIncrement;

          ratedAnnouncement['personalRating'] = returnedType;

          set({
            announcementsList: [...announcementsList],
            loadingListIds: loadingListIds.filter(
              (id) => id !== announcementId,
            ),
          });
        }
      })
      .catch((error) => {
        console.error(error);
        set({
          loadingListIds: loadingListIds.filter((id) => id !== announcementId),
        });
      });
  },
  performVoteDetails: (type: RatingType, announcementId: string) => {
    const { singleAnnouncementRatingLoading } = get();
    if (singleAnnouncementRatingLoading) return;
    set({ singleAnnouncementRatingLoading: true });
    axiosInstance
      .post<SuccessResponse<RatingDto>>(`/rating/${type}/${announcementId}`)
      .then((response) => {
        const { singleAnnouncement } = get();
        const { announcementsList } = get();
        const announcementFromList = announcementsList.find(
          (announcement) => announcement.id === singleAnnouncement?.id,
        );
        if (singleAnnouncement) {
          const returnedType = response.data.data.type;
          const oldType = singleAnnouncement.personalRating;

          const increments = ratingsToRatingCountIncrements(
            oldType,
            returnedType,
          );
          singleAnnouncement.upvoteCount += increments.upvoteCountIncrement;
          singleAnnouncement.downvoteCount += increments.downvoteCountIncrement;
          singleAnnouncement['personalRating'] = returnedType;

          if (announcementFromList) {
            announcementFromList.upvoteCount += increments.upvoteCountIncrement;
            announcementFromList.downvoteCount +=
              increments.downvoteCountIncrement;
            announcementFromList['personalRating'] = returnedType;
          }

          set({ singleAnnouncement, singleAnnouncementRatingLoading: false });
          set({
            announcementsList: [...announcementsList],
            loadingListIds: [],
          });
        }
      })
      .catch((error) => {
        set({ singleAnnouncementRatingLoading: false });
      });
  },
}));
