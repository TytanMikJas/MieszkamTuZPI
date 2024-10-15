import { Injectable } from '@nestjs/common';
import { FilehandlerService } from 'src/modules/filehandler/filehandler.service';
import { PostService } from 'src/modules/post/post.service';
import CreateAnnouncementInputDto from 'src/modules/announcement/dto/create-announcement-dto.input';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { AnnouncementDto } from 'src/modules/announcement//dto/announcement-dto';
import { $Enums } from '@prisma/client';
import {
  ERROR_ANNOUNCEMENT_NOT_FOUND,
  ERROR_POST_ANNOUNCEMENT,
  FILE_PATHS_IMAGE,
} from '../../strings';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { GenericFilter } from 'src/query.filter';
import { PRISMA_ID } from 'src/types';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { UpdateAnnouncementInputDto } from 'src/modules/announcement/dto/update-announcement-dto.input';
import AnnouncementRepository from 'src/modules/announcement/announcement.repository';
import CategoryDto from 'src/modules/announcement/dto/category-dto';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly postService: PostService,
  ) {}

  async create(
    body: CreateAnnouncementInputDto,
    files: PostFilesGrouped,
    userId: number,
  ): Promise<AnnouncementDto> {
    const { thumbnail, content, ...announcementRest } = body;

    const post = await this.postService.create(
      {
        postType: $Enums.PostType.ANNOUNCEMENT,
        content,
      },
      userId,
    );

    let announcement = null;
    try {
      announcement = await this.announcementRepository.create({
        ...announcementRest,
        id: post.id,
      });
    } catch (e) {
      await this.postService.delete(post.id);
      throw new SimpleBadRequest(ERROR_POST_ANNOUNCEMENT);
    }

    await this.filehandlerService.saveAllPostFiles(
      files,
      $Enums.PostType.ANNOUNCEMENT,
      announcement.id,
    );

    //check if the thumbnail is to be set
    if (
      await this.filehandlerService.canAssignThumbnail(
        announcement.id,
        $Enums.PostType.ANNOUNCEMENT,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      )
    ) {
      await this.postService.setThumbnail(announcement.id, thumbnail);
    }

    return { ...announcement };
  }

  async getAll(filter: GenericFilter): Promise<AnnouncementDto[]> {
    if (!filter.orderBy) {
      return this.announcementRepository.getAll(filter);
    } else {
      filter.pagination = false;
      const _a = await this.announcementRepository.getAll(filter);
      filter.pagination = true;
      return await this.postService.sortPosts(
        _a,
        filter,
        $Enums.PostType.ANNOUNCEMENT,
      );
    }
  }

  async getOne(id: PRISMA_ID): Promise<AnnouncementDto> {
    const _a = await this.announcementRepository.getOne(id);

    if (!_a) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    return _a;
  }

  async getOneBySlug(slug: string): Promise<AnnouncementDto> {
    const _i = await this.announcementRepository.getOneBySlug(slug);

    if (!_i) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    return _i;
  }

  async update(
    id: PRISMA_ID,
    body: UpdateAnnouncementInputDto,
    files: PostFilesGrouped,
  ): Promise<{ slug: string; prevSlug: string }> {
    const { exclude, thumbnail, content, ...announcement } = body;
    const _p = await this.postService.getOne(id);

    const _l = await this.announcementRepository.getOne(id);
    if (!_l) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    const isThumbnailDeleted = await this.filehandlerService.handlePatchedFiles(
      id,
      $Enums.PostType.ANNOUNCEMENT,
      files,
      exclude,
      _p.thumbnail,
    );
    if (isThumbnailDeleted) await this.postService.setThumbnail(id, '');

    await this.postService.setContent(id, content);

    await this.announcementRepository.update(id, announcement);

    //check if the thumbnail is to be updated
    //and if it can be updated
    if (
      thumbnail &&
      (await this.filehandlerService.canAssignThumbnail(
        id,
        $Enums.PostType.ANNOUNCEMENT,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      ))
    ) {
      await this.postService.setThumbnail(id, thumbnail);
    }
    const prevSlug = _l.slug;
    const _s = announcement.slug ? announcement.slug : _l.slug;

    return {
      slug: _s,
      prevSlug,
    };
  }

  async delete(id: PRISMA_ID): Promise<{ prevSlug: string }> {
    const _a = await this.announcementRepository.getOne(id);

    if (!_a) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    await this.postService.delete(id);

    return { prevSlug: _a.slug };
  }

  getCategories(): Promise<CategoryDto[]> {
    return this.announcementRepository.getCategories();
  }
}
