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
  import { PostAttributesInterceptor } from 'src/modules/post/interceptors/postAttributes.interceptor';
  import { PostListAttributesInterceptor } from 'src/modules/post/interceptors/postListAttributes.interceptor';
  import CreateAnnouncementInputDto from 'src/modules/announcement/dto/create-announcement-dto.input';
  import { AnnouncementDto } from 'src/modules/announcement/dto/announcement-dto';
  import { UpdateAnnouncementInputDto } from 'src/modules/announcement/dto/update-announcement-dto.input';
  import { User } from 'src/modules/auth/decorators/user.decorator';
  import UserInternalDto from 'src/modules/user/dto/user.internal';
  import { JWTAuthGuard } from 'src/modules/auth/strategies/jwt.strategy';
  import { Roles } from 'src/modules/auth/decorators/roles.decorator';
  import { RolesGuard } from 'src/modules/auth/strategies/roles.guard';
  import { CategoryDto } from 'src/modules/investment/dto/category-dto';
  
  @ApiTags('announcement')
  @Controller('announcement')
  export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {}
  
    @Post()
    @Roles($Enums.UserRole.OFFICIAL)
    @UseGuards(JWTAuthGuard, RolesGuard)
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
  
    @Get()
    @UseInterceptors(PostListAttributesInterceptor)
    async getAll(@Query() filter: GenericFilter): Promise<AnnouncementDto[]> {
      return await this.announcementService.getAll(filter);
    }
  
    @Get('/one/:id')
    @UseInterceptors(PostAttributesInterceptor)
    async getOne(
      @Param('id', ParsePrismaID) id: PRISMA_ID,
    ): Promise<AnnouncementDto> {
      return this.announcementService.getOne(id);
    }
  
    @Get('/slug/:slug')
    @UseInterceptors(PostAttributesInterceptor)
    async getOneBySlug(@Param('slug') slug: string): Promise<AnnouncementDto> {
      return this.announcementService.getOneBySlug(slug);
    }
  
    @Patch('/one/:id')
    @Roles($Enums.UserRole.OFFICIAL)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @UseInterceptors(AnyFilesInterceptor())
    @SuccessMessage(SUCCESS_PATCH_ANNOUNCEMENT)
    async update(
      @UploadedPostFiles($Enums.PostType.ANNOUNCEMENT) files: PostFilesGrouped,
      @Param('id', ParsePrismaID) id: PRISMA_ID,
      @Body() body: UpdateAnnouncementInputDto,
    ): Promise<{ slug: string; prevSlug: string }> {
      return this.announcementService.update(id, body, files);
    }
  
    @Delete('/one/:id')
    @Roles($Enums.UserRole.OFFICIAL)
    @UseGuards(JWTAuthGuard, RolesGuard)
    async delete(
      @Param('id', ParsePrismaID) id: PRISMA_ID,
    ): Promise<{ prevSlug: string }> {
      return this.announcementService.delete(id);
    }
  
    @Get('categories')
    getCategories(): Promise<CategoryDto[]> {
      return this.announcementService.getCategories();
    }
  }
  