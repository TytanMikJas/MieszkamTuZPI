import {
  ANNOUNCEMENT_NAME,
  FILE_DOC_NAME,
  FILE_IMAGE_NAME,
  FILE_OTHER_NAME,
  FILE_TD_NAME,
  INVESTMENT_NAME,
  INVESTMENT_STATUS_NAME_APPROVED,
  INVESTMENT_STATUS_NAME_COMPLETED,
  INVESTMENT_STATUS_NAME_IN_PROGRESS,
  INVESTMENT_STATUS_NAME_PENDING,
  INVESTMENT_STATUS_NAME_REJECTED,
  LISTING_NAME,
  COMMENT_STATUS_APPROVED,
  COMMENT_STATUS_HIDDEN,
  COMMENT_STATUS_PENDING,
  ERROR_DISPLAY_ALERT,
  ERROR_DISPLAY_FORM,
  FILE_PATHS_DOC,
  FILE_PATHS_IMAGE,
  FILE_PATHS_TD,
  RIGHTBAR_STAGE_MAP,
  RIGHTBAR_STAGE_AREA,
  RIGHTBAR_STAGE_MODEL,
  ADMIN_CREATE_STAGE,
  ADMIN_DETAILS_STAGE,
  ADMIN_NONE_STAGE,
  COMMENT_STATUS_REJECTED,
} from './strings';

export type SortingParams = {
  orderBy: string;
  sortOrder: string;
};

export enum FilterRule {
  EQUALS = 'equals', // strings, numbers,
  IN = 'in', // strings, numbers,
  NOT_IN = 'notIn', // strings, numbers,
  NOT = 'not', // strings, numbers,
  LESS_THAN = 'lt', // strings, numbers, dates
  LESS_THAN_EQUAL = 'lte', // strings, numbers, dates
  GREATER_THAN = 'gt', // strings, numbers, dates
  GREATER_THAN_EQUAL = 'gte', // strings, numbers, dates
  CONTAINS = 'contains', // string
  STARTS_WITH = 'startsWith', // string
}

export class FilterFieldRuleValue {
  #field: string;
  value: string | string[];
  #rule: FilterRule;

  constructor(field: string, rule: FilterRule, value: string | string[]) {
    this.#field = field;
    this.value = value;
    this.#rule = rule;
  }

  parse() {
    if (this.value.length === 0) return {};
    return { filter: `${this.#field}_${this.#rule}=${this.value}` };
  }
}

export type FileBadge = {
  fileName: string;
  fileType: FileType;
};

export type TruncateLogic = (text: string, length: number) => string;

export type FilePaths = {
  [FILE_PATHS_IMAGE]: string;
  [FILE_PATHS_DOC]: string;
  [FILE_PATHS_TD]: string;
};

export type PostComment = (id: string, content: string, files?: File[]) => void;
export type SelectCardLoadingList = (postId: string) => boolean;
export type SetReplyTarget = (postId: string) => void;
export type DeleteComment = (commentId: string, parentNodeId?: string) => void;
export type GetDeleteCommentLoading = (commentId: string) => boolean;
export type EditComment = (
  commentId: string,
  content: string,
  onSuccess: () => void,
  parentNodeId?: string,
) => void;

export type ErrorType = typeof ERROR_DISPLAY_ALERT | typeof ERROR_DISPLAY_FORM;
export type CommentStatus =
  | typeof COMMENT_STATUS_PENDING
  | typeof COMMENT_STATUS_APPROVED
  | typeof COMMENT_STATUS_HIDDEN
  | typeof COMMENT_STATUS_REJECTED;

export type InvestmentStatus =
  | typeof INVESTMENT_STATUS_NAME_APPROVED
  | typeof INVESTMENT_STATUS_NAME_COMPLETED
  | typeof INVESTMENT_STATUS_NAME_IN_PROGRESS
  | typeof INVESTMENT_STATUS_NAME_PENDING
  | typeof INVESTMENT_STATUS_NAME_REJECTED;

export type PostType =
  | typeof INVESTMENT_NAME
  | typeof ANNOUNCEMENT_NAME
  | typeof LISTING_NAME;

export type FileType =
  | typeof FILE_IMAGE_NAME
  | typeof FILE_DOC_NAME
  | typeof FILE_TD_NAME
  | typeof FILE_OTHER_NAME;

export type RightbarStage =
  | typeof RIGHTBAR_STAGE_MAP
  | typeof RIGHTBAR_STAGE_AREA
  | typeof RIGHTBAR_STAGE_MODEL;

export type AdminSidebarStage =
  | typeof ADMIN_CREATE_STAGE
  | typeof ADMIN_DETAILS_STAGE
  | typeof ADMIN_NONE_STAGE;
