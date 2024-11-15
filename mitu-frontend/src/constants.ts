import { LatLng } from 'leaflet';

export const DATE_FORMAT = 'dddd, YYYY-MM-DD HH:mm';

export const SCREEN_SM = 640;
export const SCREEN_MD = 768;
export const SCREEN_LG = 1024;
export const SCREEN_XL = 1280;
export const SCREEN_2XL = 1536;

export const ECO_GREEN_COLOR = '#65c918';

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
export const TD_SIZE_LIMIT = 10000000;
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

// BAF CONSTANTS
export const SURFACES = [
  {
    category: 'Powierzchnie szczelne (nieprzepuszczalne)',
    items: [
      { name: 'Asfalt', value: '0' },
      { name: 'Beton', value: '0' },
      { name: 'Kamień', value: '0' },
    ],
  },
  {
    category: 'Powierzchnie półprzepuszczalne',
    items: [
      { name: 'Żwir, grys', value: '0.5' },
      { name: 'Płyta ażurowa betonowa', value: '0.5' },
      { name: 'Kruszywa łączone żywicą', value: '0.5' },
      { name: 'Inne materiały sypkie', value: '0.5' },
    ],
  },
  {
    category: 'Powierzchnie perforowane',
    items: [
      { name: 'Nawierzchnia mineralno-żywiczna', value: '0.3' },
      { name: 'Kostka brukowa z przestrzeniami dylatacyjnymi', value: '0.3' },
    ],
  },
  {
    category: 'Powierzchnie przepuszczalne',
    items: [{ name: 'Geokrata (geosiatka komórkowa)', value: '1' }],
  },
  {
    category: 'Pozostałe',
    items: [
      { name: 'Zabudowa', value: '0' },
      { name: 'Drzewo (pow. odkryta pod koroną, m2)', value: '1' },
      { name: 'Krzew (pow. odkryta pod krzewem, m2)', value: '0.7' },
      { name: 'Łąka kwietna', value: '0.7' },
      { name: 'Trawa (murawa)', value: '0.3' },
      { name: 'Dachy zielone', value: '0.7' },
      { name: 'Ściany zielone', value: '0.5' },
      { name: 'Rośliny pnące (na 1m2 powierzchni)', value: '0.3' },
      { name: 'Ogród deszczowy (na 1m2)', value: '0.7' },
    ],
  },
];

export const FORM_ZAGOSPODAROWANIA_OPTIONS = {
  'powierzchnie szczelne (nieprzepuszczalne)': 0,
  'powierzchnie półprzepuszczalne': 0.5,
  'powierzchnie perforowane': 0.3,
  'powierzchnie przepuszczalne': 1,
  zabudowa: 0,
  'drzewo (pow. odkryta pod koroną, m2)': 1,
  'krzew (pow. odkryta pod krzewem, m2)': 0.7,
  'łąka kwietna': 0.7,
  'trawa (murawa)': 0.3,
  'dachy zielone': 0.7,
  'ściany zielone': 0.5,
  'rośliny pnące (na 1m2 powierzchni)': 0.3,
  'ogród deszczowy (na 1m2)': 0.7,
};

export const INDICATORS = {
  mieszkaniowa: 0.6,
  'przestrzenie publiczne': 0.6,
  usługowa: 0.3,
  produkcyjna: 0.3,
  'usługowo-produkcyjna': 0.3,
  'usługowo-mieszkaniowa': 0.5,
  'składy i magazyny': 0.3,
};

export const SURFACES_WITH_COLORS = {
  'powierzchnie szczelne (nieprzepuszczalne)': {
    name: 'powierzchnie szczelne (nieprzepuszczalne)',
    value: 0,
    color: '#6e6e6e',
  },
  'powierzchnie półprzepuszczalne': {
    name: 'powierzchnie półprzepuszczalne',
    value: 0.5,
    color: '#6a916f',
  },
  'powierzchnie perforowane': {
    name: 'powierzchnie perforowane',
    value: 0.3,
    color: '#8be0d5',
  },
  'powierzchnie przepuszczalne': {
    name: 'powierzchnie przepuszczalne',
    value: 1,
    color: '#cd8df7',
  },
  zabudowa: {
    name: 'zabudowa',
    value: 0,
    color: '#f59520',
  },
  'drzewo (pow. odkryta pod koroną, m2)': {
    name: 'drzewo (pow. odkryta pod koroną, m2)',
    value: 1,
    color: '#20f52e',
  },
  'krzew (pow. odkryta pod krzewem, m2)': {
    name: 'krzew (pow. odkryta pod krzewem, m2)',
    value: 0.7,
    color: '#3520f5',
  },
  'łąka kwietna': {
    name: 'łąka kwietna',
    value: 0.7,
    color: '#f520aa',
  },
  'trawa (murawa)': {
    name: 'trawa (murawa)',
    value: 0.3,
    color: '#b1f520',
  },
  'dachy zielone': {
    name: 'dachy zielone',
    value: 0.7,
    color: '#20d5f5',
  },
  'ściany zielone': {
    name: 'ściany zielone',
    value: 0.5,
    color: '#f1f520',
  },
  'rośliny pnące (na 1m2 powierzchni)': {
    name: 'rośliny pnące (na 1m2 powierzchni)',
    value: 0.3,
    color: '#00ad0c',
  },
  'ogród deszczowy (na 1m2)': {
    name: 'ogród deszczowy (na 1m2)',
    value: 0.7,
    color: '#0600ad',
  },
};
