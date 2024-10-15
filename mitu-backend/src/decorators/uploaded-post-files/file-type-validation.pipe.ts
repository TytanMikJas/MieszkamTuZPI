import { Injectable, PipeTransform } from '@nestjs/common';
import {
  DOC_MIME_TYPES,
  DOC_SIZE_LIMIT,
  IMAGE_MIME_TYPES,
  IMAGE_SIZE_LIMIT,
  TD_MIME_TYPES,
  TD_SIZE_LIMIT,
} from 'src/constants';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import {
  ERROR_FILE_TOO_LARGE,
  ERROR_INVALID_FILE_TYPE,
  ERROR_TOO_MANY_DOC_FILES,
  ERROR_TOO_MANY_IMAGE_FILES,
  ERROR_TOO_MANY_TD_FILES,
  FILE_PATHS_DOC,
  FILE_PATHS_IMAGE,
  FILE_PATHS_TD,
} from 'src/strings';
import { IFiledetailsStrategy } from './filedetails.strategies/i.filedetails.strategy';
import { $Enums } from '@prisma/client';
import { FiledetailsStrategyFactory } from 'src/modules/filehandler/factories/filedetailsStrategy.factory';

/**
 * Pipe to validate the file types and sizes.
 */
@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private filedetails: IFiledetailsStrategy;

  /**
   *
   * @param type The type of the post, for which the files are validated.
   */
  constructor(type: $Enums.PostType) {
    this.filedetails = FiledetailsStrategyFactory(type);
  }

  private isFileSizeValid(file: Express.Multer.File, maxSize: number) {
    if (file.size > maxSize) {
      throw new SimpleBadRequest(
        `${ERROR_FILE_TOO_LARGE}: ${file.originalname}`,
      );
    }
  }
  /**
   * Validation of the files.
   * @param files array of files to be validated
   * @returns dictionary of files grouped by their type (IMAGE, TD, DOC)
   */
  async transform(
    files: Array<Express.Multer.File>,
  ): Promise<PostFilesGrouped> {
    const { fileTypeFromBuffer } = await import('file-type');

    files = await Promise.all(
      files.map(async (file) => {
        console.log(file);
        const type = await fileTypeFromBuffer(file.buffer);
        console.log(type);
        if (!type) {
          throw new SimpleBadRequest(ERROR_INVALID_FILE_TYPE);
        }
        return {
          ...file,
          mimetype: type.mime,
        };
      }),
    );

    const IMAGE_FILES = files.filter((file) =>
      IMAGE_MIME_TYPES.includes(file.mimetype),
    );
    const TD_FILES = files.filter((file) =>
      TD_MIME_TYPES.includes(file.mimetype),
    );
    const DOC_FILES = files.filter((file) =>
      DOC_MIME_TYPES.includes(file.mimetype),
    );

    if (
      files.length !==
      IMAGE_FILES.length + TD_FILES.length + DOC_FILES.length
    ) {
      throw new SimpleBadRequest(ERROR_INVALID_FILE_TYPE);
    }

    if (IMAGE_FILES.length > this.filedetails.getQuantityLimit_images()) {
      throw new SimpleBadRequest(ERROR_TOO_MANY_IMAGE_FILES);
    }

    if (TD_FILES.length > this.filedetails.getQuantityLimit_tds()) {
      throw new SimpleBadRequest(ERROR_TOO_MANY_TD_FILES);
    }

    if (DOC_FILES.length > this.filedetails.getQuantityLimit_docs()) {
      throw new SimpleBadRequest(ERROR_TOO_MANY_DOC_FILES);
    }

    IMAGE_FILES.forEach((file) => this.isFileSizeValid(file, IMAGE_SIZE_LIMIT));
    DOC_FILES.forEach((file) => this.isFileSizeValid(file, DOC_SIZE_LIMIT));
    TD_FILES.forEach((file) => this.isFileSizeValid(file, TD_SIZE_LIMIT));

    return {
      [FILE_PATHS_IMAGE]: IMAGE_FILES,
      [FILE_PATHS_TD]: TD_FILES,
      [FILE_PATHS_DOC]: DOC_FILES,
    };
  }
}
