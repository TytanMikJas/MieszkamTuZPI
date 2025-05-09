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
import { ApiTags } from '@nestjs/swagger';
import { AnnouncementService } from 'src/modules/announcement/announcement.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { $Enums } from '@prisma/client';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';
import { UploadedPostFiles } from 'src/decorators/uploaded-post-files/uploaded-post-files.decorator';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';
import { GenericFilter } from 'src/query.filter';
import {
  SUCCESS_PATCH_ANNOUNCEMENT,
  SUCCESS_POST_ANNOUNCEMENT,
} from 'src/strings';
import { PRISMA_ID } from 'src/types';
import { PostListAttributesInterceptor } from 'src/modules/post/interceptors/postListAttributes.interceptor';
import CreateAnnouncementInputDto from 'src/modules/announcement/dto/create-announcement-dto.input';
import { AnnouncementDto } from 'src/modules/announcement/dto/announcement-dto';
import { UpdateAnnouncementInputDto } from 'src/modules/announcement/dto/update-announcement-dto.input';
import { User } from 'src/modules/auth/decorators/user.decorator';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import { JWTAuthGuard } from 'src/modules/auth/strategies/jwt.strategy';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/strategies/roles.guard';
import CategoryDto from 'src/modules/announcement/dto/category-dto';
import { PostAttributesInterceptor } from 'src/modules/post/interceptors/postAttributes.interceptor';
import { IdentifyAuthGuard } from '../auth/strategies/identify.strategy';
import { ClearCacheInterceptor } from 'src/interceptors/redis-caching/clear-cache-interceptor';
import { ClearCache } from 'src/interceptors/redis-caching/clear-cache.decorator';
import { ConditionalCacheInterceptor } from 'src/interceptors/redis-caching/conditional-cache-interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ConstantCache } from 'src/decorators/cache/const-cache.decorator';
import { PatchCommonDTO } from 'src/dto/patch-common-dto';

/**
 * Controller for Announcement
 * @export
 * @class AnnouncementController
 * @param {AnnouncementService} announcementService
 * @method create
 * @method getAll
 * @method getOne
 * @method getOneBySlug
 * @method update
 * @method delete
 * @method getCategories
 **/
@ApiTags('announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  /**
   * Create announcement
   * @param {CreateAnnouncementInputDto} body
   * @param {PostFilesGrouped} files
   * @param {UserInternalDto} user
   * @returns {Promise<AnnouncementDto>}
   */
  @Post()
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(ClearCacheInterceptor)
  @UseInterceptors(AnyFilesInterceptor())
  @UseInterceptors(PostAttributesInterceptor)
  @SuccessMessage(SUCCESS_POST_ANNOUNCEMENT)
  async create(
    @UploadedPostFiles($Enums.PostType.ANNOUNCEMENT) files: PostFilesGrouped,
    @Body() body: CreateAnnouncementInputDto,
    @User() user: UserInternalDto,
  ): Promise<AnnouncementDto> {
    return this.announcementService.create(body, files, user.id);
  }

  /**
   * Get all announcements
   * @param {GenericFilter} filter
   * @returns {Promise<AnnouncementDto[]>}
   * */
  @Get()
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(PostListAttributesInterceptor)
  @ClearCache(['location=N'])
  @UseInterceptors(ConditionalCacheInterceptor)
  async getAll(@Query() filter: GenericFilter): Promise<AnnouncementDto[]> {
    return await this.announcementService.getAll(filter);
  }

  /**
   * Get one announcement
   * @param {PRISMA_ID} id
   * @returns {Promise<AnnouncementDto>}
   * */
  @Get('/one/:id')
  @UseInterceptors(PostAttributesInterceptor)
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getOne(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<AnnouncementDto> {
    return this.announcementService.getOne(id);
  }

  /**
   * Get one announcement by slug
   * @param {string} slug
   * @returns {Promise<AnnouncementDto>}
   * */
  @Get('/slug/:slug')
  @UseInterceptors(PostAttributesInterceptor)
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getOneBySlug(@Param('slug') slug: string): Promise<AnnouncementDto> {
    return this.announcementService.getOneBySlug(slug);
  }

  /**
   * Update announcement
   * @param {PRISMA_ID} id - id
   * @param {UpdateAnnouncementInputDto} body - Announcement
   * @param {PostFilesGrouped} files - files
   * @returns Promise<string> - newly generated slug
   * */
  @Patch('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ClearCache(['/api/announcement', '/api/announcement/slug'])
  @UseInterceptors(ClearCacheInterceptor)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_PATCH_ANNOUNCEMENT)
  async update(
    @UploadedPostFiles($Enums.PostType.ANNOUNCEMENT) files: PostFilesGrouped,
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @Body() body: UpdateAnnouncementInputDto,
  ): Promise<PatchCommonDTO> {
    return this.announcementService.update(id, body, files);
  }

  /**
   * Delete announcement
   * @param {PRISMA_ID} id
   * @returns {Promise<{ prevSlug: string }>}
   * */
  @Delete('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ClearCache(['/api/announcement', '/api/announcement/slug'])
  @UseInterceptors(ClearCacheInterceptor)
  async delete(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<{ prevSlug: string }> {
    return this.announcementService.delete(id);
  }

  /**
   * Get announcement categories
   * @returns {Promise<CategoryDto[]>}
   **/
  @Get('categories')
  @UseInterceptors(ConstantCache)
  getCategories(): Promise<CategoryDto[]> {
    return this.announcementService.getCategories();
  }
}
