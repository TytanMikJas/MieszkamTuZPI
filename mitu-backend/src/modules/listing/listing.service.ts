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
import { slugify } from 'src/utils/string-utils';
import { PoiService } from 'src/modules/poi/poi.service';
import UpdateListingExcludePoiDto from 'src/modules/listing/dto/update-listing-dto.internal';
import CreateListingExcludePoiDto from 'src/modules/listing/dto/create-listing-dto.internal';

@Injectable()
export class ListingService {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly postService: PostService,
    private readonly poiService: PoiService,
  ) {}

  getPoiParameters(listing: CreateListingInputDto | UpdateListingInputDto) {
    return {
      title: listing.title,
      slug: slugify(listing.title),
      locationX: listing.locationX,
      locationY: listing.locationY,
      responsible: listing.responsible,
      street: listing.street,
      buildingNr: listing.buildingNr,
      apartmentNr: listing.apartmentNr,
    };
  }

  getUpdateListingParameters(
    listing: UpdateListingInputDto,
  ): UpdateListingExcludePoiDto {
    return {
      sell: listing.sell,
      price: listing.price,
      surface: listing.surface,
    };
  }

  getCreateListingParameters(
    listing: CreateListingInputDto,
  ): CreateListingExcludePoiDto {
    return {
      sell: listing.sell,
      price: listing.price,
      surface: listing.surface,
    };
  }

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
        this.getCreateListingParameters(body),
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

  async getOne(id: PRISMA_ID): Promise<ListingDto | null> {
    const _l = await this.listingRepository.getOne(id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    return _l;
  }

  async getOneBySlug(slug: string): Promise<ListingDto> {
    const _p = await this.poiService.getOneBySlug(slug);
    const _l = await this.listingRepository.getOne(_p.id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    return _l;
  }

  async update(
    id: PRISMA_ID,
    body: UpdateListingInputDto,
    files: PostFilesGrouped,
  ): Promise<{ slug: string; prevSlug: string }> {
    const { exclude, thumbnail, content, ...listingRest } = body;
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

    if (listingRest.title) {
      listingRest.slug = slugify(listingRest.title);
    }

    await this.listingRepository.update(id, listingRest);

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
    const prevSlug = _l.slug;
    const _s = listingRest.slug ? listingRest.slug : _l.slug;

    return {
      slug: _s,
      prevSlug,
    };
  }

  async delete(id: PRISMA_ID): Promise<{ prevSlug: string }> {
    const _l = await this.listingRepository.getOne(id);

    if (!_l) throw new SimpleNotFound(ERROR_LISTING_NOT_FOUND);

    await this.postService.delete(id);
    await this.poiService.delete(id);

    return { prevSlug: _l.slug };
  }
}
