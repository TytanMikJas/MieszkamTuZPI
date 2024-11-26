import * as process from 'node:process';
import { join } from 'path';

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const TD_MIME_TYPES = ['model/gltf+json', 'model/gltf-binary'];
export const DOC_MIME_TYPES = ['application/pdf'];

export const STATIC_ROOT_PATH =
  process.env.STATIC_ROOT_PATH || join(__dirname, '../../');

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

export const TEN_MINUTES_MODERATION_INTERVAL = 1_000 * 60 * 10; // 10m
export const DEFAULT_CACHE_TTL_SECONDS = 1_000 * 60 * 60; // 1h
export const CONSTANT_CACHE_TTL_SECONDS = 1_000 * 60 * 60 * 24; // 24h
