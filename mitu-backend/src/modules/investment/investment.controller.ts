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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { $Enums } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { InvestmentService } from 'src/modules/investment/investment.service';
import CreateInvestmentInputDto from 'src/modules/investment/dto/create-investment-dto.input';
import { InvestmentDto } from 'src/modules/investment/dto/investment-dto';
import { UpdateInvestmentInputDto } from 'src/modules/investment/dto/update-investment-dto.input';
import { FilterInvestmentDto } from 'src/modules/investment/dto/filter-investment.dto';
import { CategoryDto } from 'src/modules/investment/dto/category-dto';
import BadgeDto from 'src/modules/investment/dto/badge-dto';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';
import { UploadedPostFiles } from 'src/decorators/uploaded-post-files/uploaded-post-files.decorator';
import { GenericFilter } from 'src/query.filter';
import { SUCCESS_PATCH_INVESTMENT, SUCCESS_POST_INVESTMENT } from 'src/strings';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { PostAttributesInterceptor } from 'src/modules/post/interceptors/postAttributes.interceptor';
import { PostListAttributesInterceptor } from 'src/modules/post/interceptors/postListAttributes.interceptor';
import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';
import { PRISMA_ID } from 'src/types';
import { IdentifyAuthGuard } from 'src/modules/auth/strategies/identify.strategy';
import { JWTAuthGuard } from 'src/modules/auth/strategies/jwt.strategy';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import { RolesGuard } from 'src/modules/auth/strategies/roles.guard';

/**
 * Controller for Investment
 * @export
 * @class InvestmentController
 * @param {InvestmentService} investmentsService
 * @method create
 * @method getAll
 * @method getOne
 * @method getOneBySlug
 * @method update
 * @method delete
 * @method getStatuses
 * @method getCategories
 * @method getBadges
 */
@ApiTags('investment')
@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentsService: InvestmentService) {}

  /**
   * Create investment
   * @param files - files
   * @param body - CreateInvestmentInputDto
   * @param user - UserInternalDto
   * @returns {Promise<InvestmentDto>} - investmentDto
   */
  @Post()
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @UseInterceptors(PostAttributesInterceptor)
  @SuccessMessage(SUCCESS_POST_INVESTMENT)
  async create(
    @UploadedPostFiles($Enums.PostType.INVESTMENT) files: PostFilesGrouped,
    @Body() body: CreateInvestmentInputDto,
    @User() user: UserInternalDto,
  ): Promise<InvestmentDto> {
    return this.investmentsService.create(body, files, user.id);
  }

  /**
   * Get all investments
   * @param genericFilter - generic filter
   * @param investmentFilter - investment filter
   * @returns {Promise<InvestmentDto[]>} - array of investmentDto
   */
  @Get()
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(PostListAttributesInterceptor)
  async getAll(
    @Query() genericFilter: GenericFilter,
    @Query() investmentFilter: FilterInvestmentDto,
  ): Promise<InvestmentDto[]> {
    return await this.investmentsService.getAll(
      genericFilter,
      investmentFilter,
    );
  }

  /**
   * Get investment by id
   * @param id - investment id
   * @returns {Promise<InvestmentDto>} - investmentDto
   */
  @Get('/one/:id')
  @UseInterceptors(PostAttributesInterceptor)
  async getOne(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<InvestmentDto> {
    return this.investmentsService.getOne(id);
  }

  /**
   * Get investment by slug
   * @param slug - investment slug
   * @returns {Promise<InvestmentDto>} - investmentDto
   */
  @Get('/slug/:slug')
  @UseInterceptors(PostAttributesInterceptor)
  async getOneBySlug(@Param('slug') slug: string): Promise<InvestmentDto> {
    return this.investmentsService.getOneBySlug(slug);
  }

  /**
   * Update investment
   * @param files - files
   * @param id - investment id
   * @param body - UpdateInvestmentInputDto
   * @returns Promise<string> - newly generated slug
   */
  @Patch('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_PATCH_INVESTMENT)
  async update(
    @UploadedPostFiles($Enums.PostType.INVESTMENT) files: PostFilesGrouped,
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @Body() body: UpdateInvestmentInputDto,
  ): Promise<string> {
    return await this.investmentsService.update(id, body, files);
  }

  /**
   * Delete investment
   * @param id - investment id
   * @returns { prevSlug: string } - object with previous slug
   */
  @Delete('/one/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  async delete(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<{ prevSlug: string }> {
    return this.investmentsService.delete(id);
  }

  /**
   * Get all statuses
   * @returns {typeof $Enums.InvestmentStatus}
   */
  @Get('statuses')
  getStatuses(): typeof $Enums.InvestmentStatus {
    return this.investmentsService.getStatuses();
  }

  /**
   * Get all categories
   * @returns {Promise<CategoryDto[]>}
   */
  @Get('categories')
  getCategories(): Promise<CategoryDto[]> {
    return this.investmentsService.getCategories();
  }

  /**
   * Get all badges
   * @returns {Promise<BadgeDto[]>}
   */
  @Get('badges')
  getBadges(): Promise<BadgeDto[]> {
    return this.investmentsService.getBadges();
  }
}
