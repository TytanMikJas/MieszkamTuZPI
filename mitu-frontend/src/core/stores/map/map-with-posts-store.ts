import { PostType } from '../../types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { axiosInstance } from '../../api/axios-instance';
import { SuccessResponse } from '../../api/response';
import MarkerablePostDto from '../../api/post/dto/markerable-post';
import { MAP_POST_FETCHING_THRESHOLD } from '../../../constants';
import {
  ALL_POSTS_NAME,
  ANNOUNCEMENT_NAME,
  INVESTMENT_NAME,
  LISTING_NAME,
} from '@/strings';
import AirQualityResult from '@/core/api/cartography/AirQualityResultDto';

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

  airQualityData: any;
  getAirQualityData: () => void;
  airQualityVisible: boolean;
  toggleAirQualityVisibility: () => void;
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
  airQualityData: [],
  getAirQualityData: () => {},
  airQualityVisible: true,
  toggleAirQualityVisibility: () => {},
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
      const { postType, north, east, south, west, specificPost } = get();
      const mg = MAP_POST_FETCHING_THRESHOLD;

      const baseParams = {
        pageSize: 100,
        location: `N=${north + mg},E=${east + mg},S=${south - mg},W=${west - mg}`,
      };

      const fetchPostsForType = (type: PostType) =>
        axiosInstance.get<SuccessResponse<MarkerablePostDto[]>>(`/${type}`, {
          params: baseParams,
        });

      if (postType === ALL_POSTS_NAME) {
        const postTypes: PostType[] = [
          INVESTMENT_NAME,
          ANNOUNCEMENT_NAME,
          LISTING_NAME,
        ];

        Promise.all(postTypes.map((type) => fetchPostsForType(type)))
          .then((responses) => {
            const allPosts = responses.flatMap(
              (response) => response.data.data,
            );
            set({
              postsList: allPosts,
              specificPost: specificPost,
            });
          })
          .catch((error) => {
            console.error('Error fetching all posts:', error);
          });
      } else {
        fetchPostsForType(postType)
          .then((response) => {
            set({
              postsList: [...response.data.data],
              specificPost: specificPost,
            });
          })
          .catch((error) => {
            console.error('Error fetching posts:', error);
          });
      }
    },
    setSpecificPost: (specificPost: MarkerablePostDto | null) => {
      set({ specificPost });
    },
    setSpecificPostWithForce: (specificPost: MarkerablePostDto | null) => {
      set({ specificPost, specificPostForceFlag: true });
    },
    clearSpecificPostForceFlag: () => set({ specificPostForceFlag: false }),
    getAirQualityData: () => {
      axiosInstance
        .get<SuccessResponse<AirQualityResult[]>>('/cartography/airQuality')
        .then((response) => {
          set({ airQualityData: response.data.data });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    toggleAirQualityVisibility: () => {
      set({ airQualityVisible: !get().airQualityVisible });
    },
  })),
);
