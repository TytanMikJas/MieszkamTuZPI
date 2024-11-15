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
import { PoiService } from '../poi/poi.service';
import AnnouncementExcludePoiDto from './dto/create-announcement-dto.internal';
import { PatchCommonDTO } from 'src/dto/patch-common-dto';

/**
 * Service for Announcement
 * @export
 * @class AnnouncementService
 * @param {AnnouncementRepository} announcementRepository
 * @param {FilehandlerService} filehandlerService
 * @param {PostService} postService
 * @param {PoiService} poiService
 * @method create
 * @method getAll
 * @method getOne
 * @method getOneBySlug
 * @method update
 * @method delete
 * @method getCategories
 * @method getPoiParameters
 * @method getAnnouncementParameters
 * @method getCategories
 * */
@Injectable()
export class AnnouncementService {
  /**
   * Creates an instance of AnnouncementService.
   * @param {AnnouncementRepository} announcementRepository
   * @param {FilehandlerService} filehandlerService
   * @param {PostService} postService
   * @param {PoiService} poiService
   * @memberof AnnouncementService
   */
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly postService: PostService,
    private readonly poiService: PoiService,
  ) {}

  /**
   * Get POI parameters
   * @param {CreateAnnouncementInputDto}
   * @returns {AnnouncementExcludePoiDto}
   */
  getPoiParameters(
    announcement: CreateAnnouncementInputDto | UpdateAnnouncementInputDto,
  ) {
    return {
      title: announcement.title,
      slug: announcement.title,
      locationX: announcement.locationX,
      locationY: announcement.locationY,
      responsible: announcement.responsible,
      street: announcement.street,
      buildingNr: announcement.buildingNr,
      apartmentNr: announcement.apartmentNr,
    };
  }

  /**
   * Get announcement parameters
   * @param {CreateAnnouncementInputDto}
   * @returns {AnnouncementExcludePoiDto}
   * */
  getAnnouncementParameters(
    announcement: CreateAnnouncementInputDto | UpdateAnnouncementInputDto,
  ): AnnouncementExcludePoiDto {
    return {
      area: announcement.area,
      isCommentable: announcement.isCommentable,
      categoryName: announcement.categoryName,
    };
  }

  /**
   * Create announcement
   * @param {CreateAnnouncementInputDto} body
   * @param {PostFilesGrouped} files
   * @param {number} userId
   * @returns {Promise<AnnouncementDto>}
   */
  async create(
    body: CreateAnnouncementInputDto,
    files: PostFilesGrouped,
    userId: number,
  ): Promise<AnnouncementDto> {
    const { thumbnail, content } = body;

    const post = await this.postService.create(
      {
        postType: $Enums.PostType.ANNOUNCEMENT,
        content,
      },
      userId,
    );
    const poiParementers = this.getPoiParameters(body);
    await this.poiService.create({
      ...poiParementers,
      id: post.id,
    });

    let announcement = null;
    try {
      announcement = await this.announcementRepository.create(
        post.id,
        this.getAnnouncementParameters(body),
      );
    } catch (e) {
      await this.postService.delete(post.id);
      await this.poiService.delete(post.id);
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

  /**
   * Get all announcements
   * @param {GenericFilter} filter
   * @returns {Promise<AnnouncementDto[]>}
   * */
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

  /**
   * Get one announcement
   * @param {PRISMA_ID} id
   * @returns {Promise<AnnouncementDto>}
   * */
  async getOne(id: PRISMA_ID): Promise<AnnouncementDto> {
    const _a = await this.announcementRepository.getOne(id);

    if (!_a) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    return _a;
  }

  /**
   * Get one announcement by slug
   * @param {string} slug
   * @returns {Promise<AnnouncementDto>}
   * */
  async getOneBySlug(slug: string): Promise<AnnouncementDto> {
    const _p = await this.poiService.getOneBySlug(slug);

    if (!_p) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    const _i = await this.announcementRepository.getOne(_p.id);

    if (!_i) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    return _i;
  }

  /**
   * Update announcement
   * @param {PRISMA_ID} id
   * @param {UpdateAnnouncementInputDto} body
   * @param {PostFilesGrouped} files
   * @returns {Promise<string>}
   * */
  async update(
    id: PRISMA_ID,
    body: UpdateAnnouncementInputDto,
    files: PostFilesGrouped,
  ): Promise<PatchCommonDTO> {
    const { exclude, thumbnail, content } = body;
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
    const poi = await this.poiService.update({
      id,
      ...this.getPoiParameters(body),
    });

    await this.announcementRepository.update(
      id,
      this.getAnnouncementParameters(body),
    );

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

    return { slug: poi.slug, prevSlug: _l.slug };
  }

  /**
   * Delete announcement
   * @param {PRISMA_ID} id
   * @returns {Promise<{ prevSlug: string }>}
   * */
  async delete(id: PRISMA_ID): Promise<{ prevSlug: string }> {
    const _a = await this.announcementRepository.getOne(id);

    if (!_a) throw new SimpleNotFound(ERROR_ANNOUNCEMENT_NOT_FOUND);

    await this.postService.delete(id);
    await this.poiService.delete(id);

    return { prevSlug: _a.slug };
  }

  /**
   * Get categories
   * @returns {Promise<CategoryDto[]>}
   * */
  getCategories(): Promise<CategoryDto[]> {
    return this.announcementRepository.getCategories();
  }
}
