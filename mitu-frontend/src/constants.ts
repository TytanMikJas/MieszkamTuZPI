import { LatLng } from 'leaflet';

export const DATE_FORMAT = 'dddd, YYYY-MM-DD HH:mm';

export const SCREEN_SM = 640;
export const SCREEN_MD = 768;
export const SCREEN_LG = 1024;
export const SCREEN_XL = 1280;
export const SCREEN_2XL = 1536;

// MAP
export const MAP_WROCLAW_CENTER = new LatLng(51.110383, 17.033536);
export const MAP_INIT_ZOOM = 15;
export const MAP_MIN_ZOOM = 13;
export const MAP_POST_FETCHING_THRESHOLD = 0.01;

export const ANNOUNCEMENT_CARD_CONTENT_TRUNCATE_LENGTH = 100;

export const INVESTMENT_SORTING_PARAMS_NEWEST = {
  orderBy: 'createdAt',
  sortOrder: 'desc',
};

export const INVESTMENT_SORTING_PARAMS_OLDEST = {
  orderBy: 'createdAt',
  sortOrder: 'asc',
};

export const INVESTMENT_SORTING_PARAMS_BEST = {
  orderBy: 'upvoteCount',
  sortOrder: 'desc',
};

export const INVESTMENT_SORTING_PARAMS_WORST = {
  orderBy: 'downvoteCount',
  sortOrder: 'desc',
};

export const ANNOUNCEMENT_SORTING_PARAMS_NEWEST = {
  orderBy: 'createdAt',
  sortOrder: 'desc',
};

export const LISTING_SORTING_PARAMS_NEWEST = {
  orderBy: 'createdAt',
  sortOrder: 'desc',
};

export const ANNOUNCEMENT_SORTING_PARAMS_OLDEST = {
  orderBy: 'createdAt',
  sortOrder: 'asc',
};

export const LISTING_SORTING_PARAMS_OLDEST = {
  orderBy: 'createdAt',
  sortOrder: 'asc',
};

export const ANNOUNCEMENT_SORTING_PARAMS_BEST = {
  orderBy: 'upvoteCount',
  sortOrder: 'desc',
};

export const ANNOUNCEMENT_SORTING_PARAMS_WORST = {
  orderBy: 'downvoteCount',
  sortOrder: 'desc',
};

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const TD_MIME_TYPES = ['model/gltf+json', 'model/gltf-binary'];
export const DOC_MIME_TYPES = ['application/pdf'];

export const IMAGE_EXT_LIST = ['jpg', 'jpeg', 'png', 'gif'];
export const TD_EXT_LIST = ['glb'];
export const DOC_EXT_LIST = ['pdf'];

export const IMAGE_SIZE_LIMIT = 5000000;
export const TD_SIZE_LIMIT = 200000000;
export const DOC_SIZE_LIMIT = 10000000;
export const PAGE_NUM_LIMIT = 100;

export const IMAGE_INVESTMENT_QUANTITY_LIMIT = 15;
export const TD_INVESTMENT_QUANTITY_LIMIT = 1;
export const DOC_INVESTMENT_QUANTITY_LIMIT = 5;

export const IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT = 15;
export const TD_ANNOUNCEMENT_QUANTITY_LIMIT = 0;
export const DOC_ANNOUNCEMENT_QUANTITY_LIMIT = 3;

export const IMAGE_LISTING_QUANTITY_LIMIT = 20;
export const TD_LISTING_QUANTITY_LIMIT = 0;
export const DOC_LISTING_QUANTITY_LIMIT = 3;

export const IMAGE_COMMENT_QUANTITY_LIMIT = 1;
export const TD_COMMENT_QUANTITY_LIMIT = 0;
export const DOC_COMMENT_QUANTITY_LIMIT = 0;

export const POST_TAKE_COMMENTS = 3;

export const INVESTMENT_PAGE_SIZE = 10;
export const ANNOUNCEMENT_PAGE_SIZE = 10;
export const LISTING_PAGE_SIZE = 10;
export const COMMENTS_PAGE_SIZE = 10;
export const SUBCOMMENTS_PAGE_SIZE = 5;
export const POST_TYPE_COMMENT = 'COMMENT';

export const UPVOTE_COUNT = 'upvoteCount';
export const DOWNVOTE_COUNT = 'downvoteCount';
export const REPLY_TO_CONTENT_TRUNCATE_LENGTH = 50;

export const MIESZKAMTU_BLUE = '#2b6cb0';

export const FILES_URL = `/uploads/`;
