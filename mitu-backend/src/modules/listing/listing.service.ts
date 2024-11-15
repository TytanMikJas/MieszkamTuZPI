import { Injectable } from '@nestjs/common';
import CreateListingInputDto from './dto/create-listing-dto.input';
import { GenericFilter } from '../../query.filter';
import { ListingDto } from './dto/listing-dto';
import { $Enums } from '@prisma/client';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { FilehandlerService } from '../filehandler/filehandler.service';
import { PRISMA_ID } from 'src/types';
import {
  ERROR_LISTING_NOT_FOUND,
  ERROR_POST_LISTING,
  FILE_PATHS_IMAGE,
} from 'src/strings';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { PostService } from 'src/modules/post/post.service';
import ListingRepository from './listing.repository';
import { SimpleBadRequest } from '../../exceptions/simple-bad-request.exception';
import { UpdateListingInputDto } from './dto/update-listing-dto';
import { PoiService } from 'src/modules/poi/poi.service';
import ListingExcludePoiDto from 'src/modules/listing/dto/create-listing-dto.internal';
import { PatchCommonDTO } from 'src/dto/patch-common-dto';

/**
 * Listing service
 * @export
 * @class ListingService
 * @param {ListingRepository} listingRepository
 * @param {FilehandlerService} filehandlerService
 * @param {PostService} postService
 * @param {PoiService} poiService
 * @constructor
 */
@Injectable()
export class ListingService {
  /**
   * Creates an instance of ListingService.
   * @param {ListingRepository} listingRepository
   * @param {FilehandlerService} filehandlerService
   * @param {PostService} postService
   * @param {PoiService} poiService
   * @memberof ListingService
   */
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly postService: PostService,
    private readonly poiService: PoiService,
  ) {}

  /**
   * Get POI parameters
   * @param {CreateListingInputDto | UpdateListingInputDto} listing - The listing DTO
   * @returns {ListingExcludePoiDto} - The listing DTO
   */
  getPoiParameters(listing: CreateListingInputDto | UpdateListingInputDto) {
    return {
      title: listing.title,
      slug: listing.title,
      locationX: listing.locationX,
      locationY: listing.locationY,
      responsible: listing.responsible,
      street: listing.street,
      buildingNr: listing.buildingNr,
      apartmentNr: listing.apartmentNr,
    };
  }

  /**
   * Get listing parameters
   * @param {CreateListingInputDto | UpdateListingInputDto} listing - The listing DTO
   * @returns {ListingExcludePoiDto} - The listing DTO
   */
  getListingParameters(
    listing: CreateListingInputDto | UpdateListingInputDto,
  ): ListingExcludePoiDto {
    return {
      sell: listing.sell,
      price: listing.price,
      surface: listing.surface,
    };
  }

  /**
   * Create a listing
   * @param {CreateListingInputDto} body - The listing DTO
   * @param {PostFilesGrouped} files - The files
   * @param {number} userId - The user ID
   * @returns {Promise<ListingDto>} - The listing DTO
   */
  async create(
    body: CreateListingInputDto,
    files: PostFilesGrouped,
    userId: number,
  ): Promise<ListingDto> {
    const { thumbnail, content } = body;

    const post = await this.postService.create(
      {
        postType: $Enums.PostType.LISTING,
        content,
      },
      userId,
    );

    const poiParemeters = this.getPoiParameters(body);
    await this.poiService.create({
      ...poiParemeters,
      id: post.id,
    });

    let listing = null;
    try {
      listing = await this.listingRepository.create(
        post.id,
        this.getListingParameters(body),
      );
    } catch (e) {
      await this.postService.delete(post.id);
      await this.poiService.delete(post.id);
      throw new SimpleBadRequest(ERROR_POST_LISTING);
    }
    await this.filehandlerService.saveAllPostFiles(
      files,
      $Enums.PostType.LISTING,
      listing.id,
    );

    //check if the thumbnail is to be set
    if (
      await this.filehandlerService.canAssignThumbnail(
        listing.id,
        $Enums.PostType.LISTING,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      )
    ) {
      await this.postService.setThumbnail(listing.id, thumbnail);
    }

    return { ...listing };
  }

  /**
   * Get all listings
   * @param {GenericFilter} filter - The filter
   * @returns {Promise<ListingDto[]>} - The listing DTO
   */
  async getAll(filter: GenericFilter): Promise<ListingDto[]> {
    if (!filter.orderBy) {
      return this.listingRepository.getAll(filter);
    } else {
      filter.pagination = false;
      const listings: ListingDto[] =
        await this.listingRepository.getAll(filter);
      filter.pagination = true;
      return await this.postService.sortPosts(
        listings,
        filter,
        $Enums.PostType.LISTING,
      );
    }
  }

  /**
   * Get one listing
   * @param {PRISMA_ID} id - The ID
   * @returns {Promise<ListingDto | null>} - The listing DTO
   */
  async getOne(id: PRISMA_ID): Promise<ListingDto | null> {
    const _l = await this.listingRepository.getOne(id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    return _l;
  }

  /**
   * Get one listing by slug
   * @param {string} slug - The slug
   * @returns {Promise<ListingDto>} - The listing DTO
   */
  async getOneBySlug(slug: string): Promise<ListingDto> {
    const _p = await this.poiService.getOneBySlug(slug);
    const _l = await this.listingRepository.getOne(_p.id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    return _l;
  }

  /**
   * Update a listing
   * @param {PRISMA_ID} id - The ID
   * @param {UpdateListingInputDto} body - The listing DTO
   * @param {PostFilesGrouped} files - The files
   * @returns {Promise<string>} - The slug
   */
  async update(
    id: PRISMA_ID,
    body: UpdateListingInputDto,
    files: PostFilesGrouped,
  ): Promise<PatchCommonDTO> {
    const { exclude, thumbnail, content } = body;

    const _p = await this.postService.getOne(id);
    const _l = await this.listingRepository.getOne(id);
    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    const isThumbnailDeleted = await this.filehandlerService.handlePatchedFiles(
      id,
      $Enums.PostType.LISTING,
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

    await this.listingRepository.update(id, this.getListingParameters(body));

    if (
      thumbnail &&
      (await this.filehandlerService.canAssignThumbnail(
        id,
        $Enums.PostType.LISTING,
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
   * Delete a listing
   * @param {PRISMA_ID} id - The ID
   * @returns {Promise<{ prevSlug: string }>} - The slug
   */
  async delete(id: PRISMA_ID): Promise<{ prevSlug: string }> {
    const _l = await this.listingRepository.getOne(id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    await this.postService.delete(id);
    await this.poiService.delete(id);

    return { prevSlug: _l.slug };
  }
}
