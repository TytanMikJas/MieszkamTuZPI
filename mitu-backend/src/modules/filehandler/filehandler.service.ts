import { Injectable } from '@nestjs/common';
import { writeFile, mkdir, readdir, unlink, access, rm } from 'fs/promises';

import {
  DesiredImageFormat,
  FileExcludeRegExp,
  FileExcludeString,
  FileExtensionRegExp,
  PRISMA_ID,
} from 'src/types';
import { ImageCompressionStrategy } from './compression.strategies/image.compression.strategy';
import { NoCompressionStrategy } from './compression.strategies/doc.compression.strategy';
import { GLTFCompressionStrategy } from './compression.strategies/td.compression.strategy';
import { ICompressionStrategy } from './compression.strategies/i.compression.strategy';
import { PostFilesPaths } from 'src/dto/post-files-paths.internal';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import {
  ERROR_INVALID_EXCLUDE_STRING,
  ERROR_TOO_MANY_DOC_FILES,
  ERROR_TOO_MANY_IMAGE_FILES,
  ERROR_TOO_MANY_TD_FILES,
  FILE_PATHS_DOC,
  FILE_PATHS_IMAGE,
  FILE_PATHS_TD,
} from 'src/strings';

import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { AttachmentService } from '../attachment/attachment.service';

import { $Enums } from '@prisma/client';
import { FiledetailsStrategyFactory } from './factories/filedetailsStrategy.factory';

@Injectable()
export class FilehandlerService {
  constructor(private readonly attachmentService: AttachmentService) {}

  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async createDirectory(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  }

  transformOriginalnameToFormat(originalname: string): string {
    return originalname.replace(FileExtensionRegExp, DesiredImageFormat);
  }

  async preparePostDirectories(
    type: $Enums.PostType,
    id: PRISMA_ID,
  ): Promise<void> {
    const _dir = this.providePath(type, id);
    if (!(await this.fileExists(_dir))) await this.createDirectory(_dir);
    if (!(await this.fileExists(`${_dir}/${$Enums.FileType.IMAGE}`)))
      await this.createDirectory(`${_dir}/${$Enums.FileType.IMAGE}`);
    if (!(await this.fileExists(`${_dir}/${$Enums.FileType.TD}`)))
      await this.createDirectory(`${_dir}/${$Enums.FileType.TD}`);
    if (!(await this.fileExists(`${_dir}/${$Enums.FileType.DOC}`)))
      await this.createDirectory(`${_dir}/${$Enums.FileType.DOC}`);
  }

  async canAssignThumbnail(
    id: PRISMA_ID,
    postType: $Enums.PostType,
    thumbnail: string,
    sent: string[],
  ) {
    const _dir = `${this.providePath(postType, id)}/${
      $Enums.FileType.IMAGE
    }/${thumbnail}`;

    return (await this.fileExists(_dir)) || sent.includes(thumbnail);
  }

  private async saveFile(
    file: Express.Multer.File,
    dir: string,
    fileType: $Enums.FileType,
    postType: $Enums.PostType,
    postId: PRISMA_ID,
  ): Promise<void> {
    if (!(await this.fileExists(dir))) await mkdir(dir, { recursive: true });
    let compressedFile: Express.Multer.File;

    switch (fileType) {
      case $Enums.FileType.IMAGE:
        compressedFile = await this.compressFile(
          file,
          new ImageCompressionStrategy(),
        );
        break;
      case $Enums.FileType.DOC:
        compressedFile = await this.compressFile(
          file,
          new NoCompressionStrategy(),
        );
        break;
      case $Enums.FileType.TD:
        compressedFile = await this.compressFile(
          file,
          new GLTFCompressionStrategy(),
        );
        break;
      default:
        compressedFile = file;
        break;
    }

    await this.attachmentService.create({
      fileType,
      postType,
      fileName: compressedFile.originalname,
      postId,
    });

    return await writeFile(
      `${dir}/${compressedFile.originalname}`,
      compressedFile.buffer,
    );
  }

  private async savePostFilesByType(
    files: Array<Express.Multer.File>,
    fileType: $Enums.FileType,
    dir: string,
    postType: $Enums.PostType,
    postId: PRISMA_ID,
  ): Promise<void> {
    return files.forEach(async (file) => {
      await this.saveFile(
        file,
        `${dir}/${fileType}`,
        fileType,
        postType,
        postId,
      );
    });
  }

  async saveAllPostFiles(
    files: PostFilesGrouped,
    postType: $Enums.PostType,
    postId: PRISMA_ID,
  ): Promise<void> {
    const dir = this.providePath(postType, postId);

    await this.savePostFilesByType(
      files[FILE_PATHS_IMAGE],
      $Enums.FileType.IMAGE,
      dir,
      postType,
      postId,
    );
    await this.savePostFilesByType(
      files[FILE_PATHS_TD],
      $Enums.FileType.TD,
      dir,
      postType,
      postId,
    );
    await this.savePostFilesByType(
      files[FILE_PATHS_DOC],
      $Enums.FileType.DOC,
      dir,
      postType,
      postId,
    );
  }

  private async compressFile(
    file: Express.Multer.File,
    strategy: ICompressionStrategy,
  ): Promise<Express.Multer.File> {
    return await strategy.compress(file);
  }

  providePath(type: $Enums.PostType, id: PRISMA_ID): string {
    return `./uploads/${type}/${id}`;
  }

  private async getAttachments(
    type: $Enums.PostType,
    id: PRISMA_ID,
  ): Promise<PostFilesPaths> {
    const _dir = this.providePath(type, id);

    if (!this.fileExists(_dir))
      return {
        [FILE_PATHS_IMAGE]: [],
        [FILE_PATHS_TD]: [],
        [FILE_PATHS_DOC]: [],
      };

    const images = this.fileExists(`${_dir}/${$Enums.FileType.IMAGE}`)
      ? await this.getFilesInDirectory(`${_dir}/${$Enums.FileType.IMAGE}`)
      : [];

    const tds = this.fileExists(`${_dir}/${$Enums.FileType.TD}`)
      ? await this.getFilesInDirectory(`${_dir}/${$Enums.FileType.TD}`)
      : [];

    const docs = this.fileExists(`${_dir}/${$Enums.FileType.DOC}`)
      ? await this.getFilesInDirectory(`${_dir}/${$Enums.FileType.DOC}`)
      : [];

    return {
      [FILE_PATHS_IMAGE]: images,
      [FILE_PATHS_TD]: tds,
      [FILE_PATHS_DOC]: docs,
    };
  }

  private async getFilesInDirectory(dir: string): Promise<string[]> {
    return (await readdir(dir)).map((file) => `${file}`);
  }

  private groupExcludedFiles(exclude: FileExcludeString): PostFilesPaths {
    if (!exclude)
      return {
        [FILE_PATHS_IMAGE]: [],
        [FILE_PATHS_TD]: [],
        [FILE_PATHS_DOC]: [],
      };

    if (!FileExcludeRegExp.test(exclude))
      throw new SimpleBadRequest(ERROR_INVALID_EXCLUDE_STRING);

    const _files = exclude.split(';');
    const _groupedFiles: PostFilesPaths = {
      [FILE_PATHS_IMAGE]: [],
      [FILE_PATHS_DOC]: [],
      [FILE_PATHS_TD]: [],
    };

    _files.forEach((file) => {
      const s = file.split('/');
      const _type = s[0];
      if (!_groupedFiles[_type])
        throw new SimpleBadRequest(ERROR_INVALID_EXCLUDE_STRING);
      _groupedFiles[_type].push(s[1]);
    });

    return _groupedFiles;
  }

  //if error is not thrown -> can proceed
  private canProceedWithFileUpload(
    files: PostFilesGrouped,
    exclude: PostFilesPaths,
    attachments: PostFilesPaths,
    postType: $Enums.PostType,
  ): void {
    const _ca = {
      images: attachments[FILE_PATHS_IMAGE].map(
        (file) => file.split('/').slice(-1)[0],
      ).filter((file) => !exclude[FILE_PATHS_IMAGE].includes(file)),
      tds: attachments[FILE_PATHS_TD].map(
        (file) => file.split('/').slice(-1)[0],
      ).filter((file) => !exclude[FILE_PATHS_TD].includes(file)),
      docs: attachments[FILE_PATHS_DOC].map(
        (file) => file.split('/').slice(-1)[0],
      ).filter((file) => !exclude[FILE_PATHS_DOC].includes(file)),
    };

    const _fd = FiledetailsStrategyFactory(postType);

    if (
      _ca.images.length + files[FILE_PATHS_IMAGE].length >
      _fd.getQuantityLimit_images()
    )
      throw new SimpleBadRequest(ERROR_TOO_MANY_IMAGE_FILES);

    if (
      _ca.tds.length + files[FILE_PATHS_TD].length >
      _fd.getQuantityLimit_tds()
    )
      throw new SimpleBadRequest(ERROR_TOO_MANY_TD_FILES);

    if (
      _ca.docs.length + files[FILE_PATHS_DOC].length >
      _fd.getQuantityLimit_docs()
    )
      throw new SimpleBadRequest(ERROR_TOO_MANY_DOC_FILES);
  }

  private async deleteExcludedFiles(
    exclude: PostFilesPaths,
    dir: string,
    postId: PRISMA_ID,
    thumbnail?: string,
  ): Promise<boolean> {
    let shouldDeleteThumbnail = false;
    exclude[FILE_PATHS_IMAGE].map(async (f) => {
      await this.deleteFile(dir, $Enums.FileType.IMAGE, f, postId);
      if (thumbnail === f) shouldDeleteThumbnail = true;
    });
    exclude[FILE_PATHS_TD].map(async (f) => {
      await this.deleteFile(dir, $Enums.FileType.TD, f, postId);
    });
    exclude[FILE_PATHS_DOC].map(async (f) => {
      await this.deleteFile(dir, $Enums.FileType.DOC, f, postId);
    });
    return shouldDeleteThumbnail;
  }

  private async deleteFile(
    dir: string,
    type: $Enums.FileType,
    filename: string,
    postId: PRISMA_ID,
  ): Promise<void> {
    const _path = `${dir}/${type}/${filename}`;
    if (await this.fileExists(_path))
      await unlink(_path).then(
        async () =>
          await this.attachmentService.delete({
            fileName: filename,
            postId,
          }),
      );
  }

  async deletePostDirectory(
    type: $Enums.PostType,
    id: PRISMA_ID,
  ): Promise<void> {
    const _dir = this.providePath(type, id);
    if (await this.fileExists(_dir)) {
      await rm(_dir, { recursive: true, force: true });
    }
  }

  async handlePatchedFiles(
    id: PRISMA_ID,
    postType: $Enums.PostType,
    files: PostFilesGrouped,
    exclude: string,
    thumbnail?: string,
  ) {
    const grouppedExlude = this.groupExcludedFiles(exclude);
    const attachments = await this.getAttachments(postType, id);
    //throws an exception if there are too much files
    //that means: too little files were excluded
    //for the amount of files uploaded
    this.canProceedWithFileUpload(files, grouppedExlude, attachments, postType);

    await this.saveAllPostFiles(files, postType, id);
    // ^ - newly uploaded files are saved

    const isThumbnailDeleted = await this.deleteExcludedFiles(
      grouppedExlude,
      this.providePath(postType, id),
      id,
      thumbnail,
    );
    return isThumbnailDeleted;
  }
}
