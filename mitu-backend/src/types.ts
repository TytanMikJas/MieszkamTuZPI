type Latitude = number;
type Longitude = number;
export type LocationTuple = `${Longitude},${Latitude}`;
export type LocationChain =
  `${LocationTuple};${LocationTuple};${LocationTuple};${LocationTuple}`;

// images or tds or docs / filename ; - .. - ; ...
export type FileExcludeString = string;
export const FileExcludeRegExp = /^(?:\w+\/[\w. ]+;)*\w+\/[\w. -_]+$/i;
export const FileExtensionRegExp = /(\.[\w\d_-]+)$/i;

export type PRISMA_ID = number;

export const DesiredImageFormat = '.png';
