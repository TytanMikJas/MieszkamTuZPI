import { create } from 'zustand';
import CommentDto from '../api/common/comment/CommentDto';
import { axiosInstance } from '../api/axios-instance';
import { SuccessResponse } from '../api/response';
import { COMMENTS_PAGE_SIZE } from '@/constants';
import { FilterFieldRuleValue, SortingParams } from '@/types';
import { devtools } from 'zustand/middleware';
import { COMMENT_STATUS_APPROVED } from '@/strings';

interface ListSection {
  commentsList: CommentDto[];
  loadingList: boolean;
  currentPageList: number;
  isMoreList: boolean;
  loadingListIds: string[];
}

export interface OfficialStore extends ListSection {
  fetchCommentsList: () => void;
  filterParams: any;
  sortingParams: SortingParams;
  postRejectComment: (id: string) => void;
  postApproveComment: (id: string) => void;
  getCommentLoading: (id: string) => boolean;
}

const initialListSection: ListSection = {
  commentsList: [],
  loadingList: false,
  currentPageList: 0,
  isMoreList: true,
  loadingListIds: [],
};

const initialSortingParams = {
  orderBy: 'createdAt',
  sortOrder: 'asc',
};

const initialFilterParams = {
  filter: 'status_equals=PENDING',
};

export const useOfficialStore = create<
  OfficialStore,
  // eslint-disable-next-line prettier/prettier
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialListSection,
    filterParams: initialFilterParams,
    sortingParams: initialSortingParams,
    fetchCommentsList: () => {
      const {
        currentPageList,
        filterParams,
        sortingParams,
        commentsList,
        loadingList,
      } = get();
      if (loadingList) return;
      set({
        loadingList: true,
      });

      axiosInstance
        .get<SuccessResponse<CommentDto[]>>('/comment', {
          params: {
            page: currentPageList,
            pageSize: COMMENTS_PAGE_SIZE,
            ...sortingParams,
            ...filterParams,
          },
        })
        .then((response) => {
          set({
            commentsList: [...commentsList, ...response.data.data],
            loadingList: false,
            isMoreList: response.data.data.length === COMMENTS_PAGE_SIZE,
            currentPageList: currentPageList + 1,
          });
        })
        .catch((error) => {
          set({
            loadingList: false,
          });
        });
    },
    postRejectComment: (id: string) => {
      const { loadingListIds, commentsList } = get();
      if (loadingListIds.includes(id)) return;
      set({
        loadingListIds: [...loadingListIds, id],
      });
      axiosInstance
        .delete(`/comment/one/${id}`)
        .then(() => {
          set({
            loadingListIds: loadingListIds.filter(
              (loadingId) => loadingId !== id,
            ),
            commentsList: commentsList.filter(
              (comment) => `${comment.id}` !== id,
            ),
          });
        })
        .catch((error) => {});
    },
    postApproveComment: (id: string) => {
      const { loadingListIds, commentsList } = get();
      if (loadingListIds.includes(id)) return;
      set({
        loadingListIds: [...loadingListIds, id],
      });
      axiosInstance
        .patch(`/comment/status/${id}?status=${COMMENT_STATUS_APPROVED}`)
        .then(() => {
          set({
            loadingListIds: loadingListIds.filter(
              (loadingId) => loadingId !== id,
            ),
            commentsList: commentsList.filter(
              (comment) => `${comment.id}` !== id,
            ),
          });
        })
        .catch((error) => {});
    },
    getCommentLoading: (id: string) => {
      const { loadingListIds } = get();
      return loadingListIds.includes(id);
    },
  })),
);
