import { PostType } from '../../types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { axiosInstance } from '../../api/axios-instance';
import { SuccessResponse } from '../../api/response';
import MarkerablePostDto from '../../api/post/dto/markerable-post';
import { MAP_POST_FETCHING_THRESHOLD } from '../../../constants';
import { INVESTMENT_NAME } from '@/strings';

export interface MapWithPostsStore {
  postType: PostType;
  setPostType: (postType: PostType) => void;

  north: number;
  east: number;
  south: number;
  west: number;
  setNESW: (north: number, east: number, south: number, west: number) => void;

  prevNorth: number;
  prevEast: number;

  postsList: MarkerablePostDto[];
  fetchPosts: () => void;
  specificPost: MarkerablePostDto | null;
  setSpecificPost: (post: MarkerablePostDto | null) => void;

  specificPostForceFlag: boolean;
  setSpecificPostWithForce: (post: MarkerablePostDto | null) => void;
  clearSpecificPostForceFlag: () => void;
}

const initialValues: MapWithPostsStore = {
  postType: INVESTMENT_NAME as PostType,
  setPostType: () => {},

  north: 0,
  east: 0,
  south: 0,
  west: 0,
  setNESW: () => {},

  prevNorth: 0,
  prevEast: 0,

  postsList: [],
  fetchPosts: () => {},
  specificPost: null,
  setSpecificPost: () => {},

  specificPostForceFlag: false,
  setSpecificPostWithForce: () => {},
  clearSpecificPostForceFlag: () => {},
};
export const useMapWithPostsStore = create<
  MapWithPostsStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialValues,
    setPostType: (postType: PostType) => {
      if (postType === get().postType) return;
      set({ postType, specificPost: null });
    },
    setNESW: (north: number, east: number, south: number, west: number) => {
      set({ north, east, south, west });
      const { prevNorth, prevEast } = get();

      if (
        Math.abs(north - prevNorth) > MAP_POST_FETCHING_THRESHOLD || // moving up or down
        Math.abs(east - prevEast) > MAP_POST_FETCHING_THRESHOLD // moving right or left
      ) {
        set({ prevNorth: north, prevEast: east });
        get().fetchPosts();
      }
    },

    fetchPosts: () => {
      const { postType, north, east, south, west } = get();
      const mg = MAP_POST_FETCHING_THRESHOLD;
      const specificPost = get().specificPost;
      axiosInstance
        .get<SuccessResponse<MarkerablePostDto[]>>(`/${postType}`, {
          params: {
            pageSize: 100, // all posts should be fetched
            location: `N=${north + mg},E=${east + mg},S=${south - mg},W=${
              west - mg
            }`,
          },
        })
        .then((response) => {
          set({
            postsList: [...response.data.data],
            specificPost: specificPost,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setSpecificPost: (specificPost: MarkerablePostDto | null) => {
      set({ specificPost });
    },
    setSpecificPostWithForce: (specificPost: MarkerablePostDto | null) => {
      set({ specificPost, specificPostForceFlag: true });
    },
    clearSpecificPostForceFlag: () => set({ specificPostForceFlag: false }),
  })),
);
