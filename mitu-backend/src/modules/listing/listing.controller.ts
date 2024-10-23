import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ListingService } from 'src/modules/listing/listing.service';
import { SuccessMessage } from '../../decorators/success-message/success-message.decorator';
import CreateListingInputDto from './dto/create-listing-dto.input';
import { GenericFilter } from '../../query.filter';
import { ListingDto } from './dto/listing-dto';
import { $Enums } from '@prisma/client';
import { SUCCESS_PATCH_LISTING, SUCCESS_POST_LISTING } from 'src/strings';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadedPostFiles } from 'src/decorators/uploaded-post-files/uploaded-post-files.decorator';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { UpdateListingInputDto } from './dto/update-listing-dto';
import { ApiTags } from '@nestjs/swagger';
import { PostAttributesInterceptor } from '../post/interceptors/postAttributes.interceptor';
import { ParsePrismaID } from '../../pipes/parse-prisma-id.pipe';
import { PRISMA_ID } from '../../types';
import { PostListAttributesInterceptor } from '../post/interceptors/postListAttributes.interceptor';
import { User } from '../auth/decorators/user.decorator';
import UserInternalDto from '../user/dto/user.internal';
import { JWTAuthGuard } from '../auth/strategies/jwt.strategy';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/strategies/roles.guard';
import { IdentifyAuthGuard } from '../auth/strategies/identify.strategy';

/**
 * Controller for Listing
 * @export
 * @class ListingController
 * @param {ListingService} listingService
 * @method create
 * @method getAll
 * @method getOne
 * @method getOneBySlug
 * @method update
 * @method delete
 */
@ApiTags('listing')
@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  /**
   * Create listing
   * @param files - files
   * @param body - CreateListingInputDto
   * @param user - UserInternalDto
   * @returns {Promise<ListingDto>} - listingDto
   */
  @Post()
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(PostAttributesInterceptor)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_POST_LISTING)
  async create(
    @UploadedPostFiles($Enums.PostType.LISTING) files: PostFilesGrouped,
    @Body() body: CreateListingInputDto,
    @User() user: UserInternalDto,
  ): Promise<ListingDto> {
    return this.listingService.create(body, files, user.id);
  }

  /**
   * Get all listings
   * @param filter - genereic filter
   * @returns {Promise<ListingDto[]>} - listingDto[] (array of listingDto)
   */
  @Get()
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(PostListAttributesInterceptor)
  async getAll(@Query() filter: GenericFilter): Promise<ListingDto[]> {
    return await this.listingService.getAll(filter);
  }

  /**
   * Get listing by id
   * @param id - listing id
   * @returns {Promise<ListingDto>} - listingDto
   */
  @Get('/one/:id')
  @UseInterceptors(PostAttributesInterceptor)
  async getOne(@Param('id', ParsePrismaID) id: PRISMA_ID): Promise<ListingDto> {
    return this.listingService.getOne(id);
  }

  /**
   * Get listing by slug
   * @param slug - listing slug
   * @returns {Promise<ListingDto>} - listingDto
   */
  @Get('/slug/:slug')
  @UseInterceptors(PostAttributesInterceptor)
  async getOneBySlug(@Param('slug') slug: string): Promise<ListingDto> {
    return this.listingService.getOneBySlug(slug);
  }

  /**
   * Update listing
   * @param files - files
   * @param id - listing id
   * @param body - UpdateListingInputDto
   * @returns Promise<string> - newly generated slug
   */
  @Patch('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_PATCH_LISTING)
  async update(
    @UploadedPostFiles($Enums.PostType.LISTING) files: PostFilesGrouped,
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @Body() body: UpdateListingInputDto,
  ): Promise<string> {
    return this.listingService.update(id, body, files);
  }

  /**
   * Delete listing
   * @param id - listing id
   * @returns { prevSlug: string } - object with previous slug
   */
  @Delete('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  async delete(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<{ prevSlug: string }> {
    return this.listingService.delete(id);
  }
}
