import {
  DOC_ANNOUNCEMENT_QUANTITY_LIMIT,
  DOC_EXT_LIST,
  DOC_INVESTMENT_QUANTITY_LIMIT,
  DOC_LISTING_QUANTITY_LIMIT,
  DOC_MIME_TYPES,
  DOC_SIZE_LIMIT,
  IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT,
  IMAGE_EXT_LIST,
  IMAGE_INVESTMENT_QUANTITY_LIMIT,
  IMAGE_LISTING_QUANTITY_LIMIT,
  IMAGE_MIME_TYPES,
  IMAGE_SIZE_LIMIT,
  TD_ANNOUNCEMENT_QUANTITY_LIMIT,
  TD_EXT_LIST,
  TD_INVESTMENT_QUANTITY_LIMIT,
  TD_LISTING_QUANTITY_LIMIT,
  TD_MIME_TYPES,
  TD_SIZE_LIMIT,
} from './constants';
import {
  ANNOUNCEMENT_NAME,
  DISTRICT_LABEL_BARANIEC,
  DISTRICT_LABEL_BIERUN_NOWY,
  DISTRICT_LABEL_BIERUN_STARY,
  DISTRICT_LABEL_BIJASOWICE,
  DISTRICT_LABEL_CZARNUCHOWICE,
  DISTRICT_LABEL_JAJOSTY,
  DISTRICT_LABEL_KOPAN,
  DISTRICT_LABEL_LIGNOZA,
  DISTRICT_LABEL_LYSINA,
  DISTRICT_LABEL_NORAS,
  DISTRICT_LABEL_SCIERNIE,
  DISTRICT_LABEL_WITTA,
  DISTRICT_NAME_BARANIEC,
  DISTRICT_NAME_BIERUN_NOWY,
  DISTRICT_NAME_BIERUN_STARY,
  DISTRICT_NAME_BIJASOWICE,
  DISTRICT_NAME_CZARNUCHOWICE,
  DISTRICT_NAME_JAJOSTY,
  DISTRICT_NAME_KOPAN,
  DISTRICT_NAME_LIGNOZA,
  DISTRICT_NAME_LYSINA,
  DISTRICT_NAME_NORAS,
  DISTRICT_NAME_SCIERNIE,
  DISTRICT_NAME_WITTA,
  FILE_DOC_LABEL,
  FILE_DOC_NAME,
  FILE_IMAGE_LABEL,
  FILE_IMAGE_NAME,
  FILE_OTHER_NAME,
  FILE_TD_LABEL,
  FILE_TD_NAME,
  INVESTMENT_NAME,
  INVESTMENT_STATUS_LABEL_APPROVED,
  INVESTMENT_STATUS_LABEL_COMPLETED,
  INVESTMENT_STATUS_LABEL_IN_PROGRESS,
  INVESTMENT_STATUS_LABEL_PENDING,
  INVESTMENT_STATUS_LABEL_REJECTED,
  INVESTMENT_STATUS_NAME_APPROVED,
  INVESTMENT_STATUS_NAME_COMPLETED,
  INVESTMENT_STATUS_NAME_IN_PROGRESS,
  INVESTMENT_STATUS_NAME_PENDING,
  INVESTMENT_STATUS_NAME_REJECTED,
  LISTING_NAME,
  MORE_COMMENT_NAME,
  MOST_COMMENT_NAME,
  ONE_COMMENT_NAME,
  USER_ROLE_LABEL_ADMIN,
  USER_ROLE_LABEL_OFFICIAL,
  USER_ROLE_LABEL_USER,
  USER_ROLE_NAME_ADMIN,
  USER_ROLE_NAME_OFFICIAL,
  USER_ROLE_NAME_USER,
} from 'src/strings';
import { FileType, PostType } from 'src/types';

export const getContrastColor = (backgroundColor: string): string => {
  // Parse the hex color string
  const hex = backgroundColor.startsWith('#')
    ? backgroundColor.slice(1)
    : backgroundColor;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate luminance
  const luminance =
    0.2126 * (r / 255) ** 2.2 +
    0.7152 * (g / 255) ** 2.2 +
    0.0722 * (b / 255) ** 2.2;

  // Using the luminance threshold of 0.179, return 'black' for light backgrounds and 'white' for dark backgrounds
  return luminance > 0.179 ? 'black' : 'white';
};

export const nounCountParser = (count: number, words: string[]): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    (count % 100 > 4 && count % 100 < 20) ||
    (count % 10 === 1 && count % 100 !== 11)
      ? 2
      : cases[count % 10 < 5 ? count % 10 : 5]
    ];
};

export const commentCountParser = (count: number): string => {
  return nounCountParser(count, [
    ONE_COMMENT_NAME,
    MORE_COMMENT_NAME,
    MOST_COMMENT_NAME,
  ]);
};

export const defaultTruncateLogic = (text: string, length: number): string => {
  return text.slice(0, length) + '...';
};

export const attachmentNameTruncateLogic = (
  text: string,
  length: number,
): string => {
  const parts = text.split('.');
  const ext = parts[parts.length - 1];
  const name = parts.slice(0, parts.length - 1).join('.');
  return name.slice(0, length - 6) + '...' + ext;
};

export const districtParser: any = {
  [DISTRICT_NAME_JAJOSTY]: DISTRICT_LABEL_JAJOSTY,
  [DISTRICT_NAME_BIERUN_NOWY]: DISTRICT_LABEL_BIERUN_NOWY,
  [DISTRICT_NAME_KOPAN]: DISTRICT_LABEL_KOPAN,
  [DISTRICT_NAME_LIGNOZA]: DISTRICT_LABEL_LIGNOZA,
  [DISTRICT_NAME_CZARNUCHOWICE]: DISTRICT_LABEL_CZARNUCHOWICE,
  [DISTRICT_NAME_BIJASOWICE]: DISTRICT_LABEL_BIJASOWICE,
  [DISTRICT_NAME_LYSINA]: DISTRICT_LABEL_LYSINA,
  [DISTRICT_NAME_WITTA]: DISTRICT_LABEL_WITTA,
  [DISTRICT_NAME_BIERUN_STARY]: DISTRICT_LABEL_BIERUN_STARY,
  [DISTRICT_NAME_NORAS]: DISTRICT_LABEL_NORAS,
  [DISTRICT_NAME_SCIERNIE]: DISTRICT_LABEL_SCIERNIE,
  [DISTRICT_NAME_BARANIEC]: DISTRICT_LABEL_BARANIEC,
};

export const investmentStatusParser: any = {
  [INVESTMENT_STATUS_NAME_PENDING]: INVESTMENT_STATUS_LABEL_PENDING,
  [INVESTMENT_STATUS_NAME_IN_PROGRESS]: INVESTMENT_STATUS_LABEL_IN_PROGRESS,
  [INVESTMENT_STATUS_NAME_COMPLETED]: INVESTMENT_STATUS_LABEL_COMPLETED,
  [INVESTMENT_STATUS_NAME_APPROVED]: INVESTMENT_STATUS_LABEL_APPROVED,
  [INVESTMENT_STATUS_NAME_REJECTED]: INVESTMENT_STATUS_LABEL_REJECTED,
};

export const userRoleParser: any = {
  [USER_ROLE_NAME_ADMIN]: USER_ROLE_LABEL_ADMIN,
  [USER_ROLE_NAME_USER]: USER_ROLE_LABEL_USER,
  [USER_ROLE_NAME_OFFICIAL]: USER_ROLE_LABEL_OFFICIAL,
};

export const userRoleParserReverse: any = {
  [USER_ROLE_LABEL_ADMIN]: USER_ROLE_NAME_ADMIN,
  [USER_ROLE_LABEL_USER]: USER_ROLE_NAME_USER,
  [USER_ROLE_LABEL_OFFICIAL]: USER_ROLE_NAME_OFFICIAL,
};

const filetypeBasedMaxSize = {
  [FILE_IMAGE_NAME]: IMAGE_SIZE_LIMIT,
  [FILE_DOC_NAME]: DOC_SIZE_LIMIT,
  [FILE_TD_NAME]: TD_SIZE_LIMIT,
  [FILE_OTHER_NAME]: 0,
};

const filetypeBasedMaxQuantity: any = {
  [INVESTMENT_NAME]: {
    [FILE_IMAGE_NAME]: IMAGE_INVESTMENT_QUANTITY_LIMIT,
    [FILE_DOC_NAME]: DOC_INVESTMENT_QUANTITY_LIMIT,
    [FILE_TD_NAME]: TD_INVESTMENT_QUANTITY_LIMIT,
  },
  [LISTING_NAME]: {
    [FILE_IMAGE_NAME]: IMAGE_LISTING_QUANTITY_LIMIT,
    [FILE_DOC_NAME]: DOC_LISTING_QUANTITY_LIMIT,
    [FILE_TD_NAME]: TD_LISTING_QUANTITY_LIMIT,
  },
  [ANNOUNCEMENT_NAME]: {
    [FILE_IMAGE_NAME]: IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT,
    [FILE_DOC_NAME]: DOC_ANNOUNCEMENT_QUANTITY_LIMIT,
    [FILE_TD_NAME]: TD_ANNOUNCEMENT_QUANTITY_LIMIT,
  },
};

const fileTypeNameParser: any = {
  [FILE_IMAGE_NAME]: FILE_IMAGE_LABEL,
  [FILE_DOC_NAME]: FILE_DOC_LABEL,
  [FILE_TD_NAME]: FILE_TD_LABEL,
};

export const validateFiles = (
  files: File[],
  postType: PostType,
): string | null => {
  const count: any = {
    [FILE_IMAGE_NAME]: 0,
    [FILE_DOC_NAME]: 0,
    [FILE_TD_NAME]: 0,
  };

  for (const file of files) {
    const [error, fileType] = validateFile(file);
    if (error) {
      return error;
    }
    if (fileType) {
      count[fileType] += 1;
    }
  }

  for (const key in count) {
    if (count[key] > filetypeBasedMaxQuantity[postType][key]) {
      return `Przekroczono limit plików typu ${fileTypeNameParser[key]}`;
    }
  }

  return null;
};

export const validateFile = (
  file: File,
  desiredTypes: FileType[] = [FILE_IMAGE_NAME, FILE_DOC_NAME, FILE_TD_NAME],
): [string, null] | [null, string] => {
  const ext = file.name.split('.')[1];
  const fileType =
    IMAGE_MIME_TYPES.includes(file.type) || IMAGE_EXT_LIST.includes(ext)
      ? FILE_IMAGE_NAME
      : DOC_MIME_TYPES.includes(file.type) || DOC_EXT_LIST.includes(ext)
        ? FILE_DOC_NAME
        : TD_MIME_TYPES.includes(file.type) || TD_EXT_LIST.includes(ext)
          ? FILE_TD_NAME
          : FILE_OTHER_NAME;

  if (!desiredTypes.includes(fileType)) {
    return [`Plik ${file.name} ma niepoprawny format!`, null];
  }

  if (file.size > filetypeBasedMaxSize[fileType]) {
    return ['Plik jest zbyt duży', null];
  }

  return [null, fileType];
};


export function extractUniqueFiles(files: File[], ignoreFiles: string[]): File[] {
  console.log('ignore', ignoreFiles);
  const uniqueFiles = files.filter(
    (file: File, index, array) =>
      array.findIndex((f) => (f.name === file.name)
      ) === index
  );
  return uniqueFiles.filter((file) => !ignoreFiles.some((ignoreName) => ignoreName === file.name));
}
