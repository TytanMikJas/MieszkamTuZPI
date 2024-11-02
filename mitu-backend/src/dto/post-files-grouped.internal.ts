import { FILE_PATHS_DOC, FILE_PATHS_IMAGE, FILE_PATHS_TD } from 'src/strings';

/**
 * Post files grouped
 * @export
 * @class PostFilesGrouped
 */
export class PostFilesGrouped {
  [FILE_PATHS_IMAGE]: Array<Express.Multer.File>;
  [FILE_PATHS_TD]: Array<Express.Multer.File>;
  [FILE_PATHS_DOC]: Array<Express.Multer.File>;
}
