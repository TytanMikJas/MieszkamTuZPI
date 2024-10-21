import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import CreateInvestmentInputDto from 'src/modules/investment/dto/create-investment-dto.input';
import InvestmentRepository from 'src/modules/investment/investment.repository';
import { GenericFilter } from 'src/query.filter';
import { InvestmentDto } from 'src/modules/investment/dto/investment-dto';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { FilehandlerService } from 'src/modules/filehandler/filehandler.service';
import { PRISMA_ID } from 'src/types';
import {
  ERROR_INVESTMENT_NOT_FOUND,
  ERROR_POST_INVESTMENT,
  FILE_PATHS_IMAGE,
} from 'src/strings';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { UpdateInvestmentInputDto } from 'src/modules/investment/dto/update-investment-dto.input';
import { PostService } from 'src/modules/post/post.service';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { FilterInvestmentDto } from 'src/modules/investment/dto/filter-investment.dto';
import { CategoryDto } from 'src/modules/investment/dto/category-dto';
import BadgeDto from 'src/modules/investment/dto/badge-dto';
import { slugify } from 'src/utils/string-utils';
import { PoiService } from 'src/modules/poi/poi.service';
import UpdateInvestmentExcludePoiDto from 'src/modules/investment/dto/update-investment-dto.internal';
import CreateInvestmentExcludePoiDto from 'src/modules/investment/dto/create-investment-dto.internal';

/**
 * Investment service.
 * @class
 * @exports
 * @implements {InvestmentService}
 * @constructor
 * @param {InvestmentRepository} investmentRepository - The investment repository.
 * @param {FilehandlerService} filehandlerService - The filehandler service.
 * @param {PostService} postService - The post service.
 * @param {PoiService} poiService - The poi service.
 * @requires Injectable
 * @see {@link InvestmentRepository}
 * @see {@link FilehandlerService}
 * @see {@link PostService}
 * @see {@link PoiService}
 */
@Injectable()
export class InvestmentService {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly postService: PostService,
    private readonly poiService: PoiService,
  ) {}

  getPoiParameters(
    investment: CreateInvestmentInputDto | UpdateInvestmentInputDto,
  ) {
    return {
      title: investment.title,
      slug: slugify(investment.title),
      locationX: investment.locationX,
      locationY: investment.locationY,
      responsible: investment.responsible,
      street: investment.street,
      buildingNr: investment.buildingNr,
      apartmentNr: investment.apartmentNr,
    };
  }

  getUpdateInvestmentParameters(
    investment: UpdateInvestmentInputDto,
  ): UpdateInvestmentExcludePoiDto {
    return {
      area: investment.area,
      categoryName: investment.categoryName,
      isCommentable: investment.isCommentable,
      status: investment.status,
      badges: investment.badges,
    };
  }

  getCreateInvestmentParameters(
    investment: CreateInvestmentInputDto,
  ): CreateInvestmentExcludePoiDto {
    return {
      area: investment.area,
      isCommentable: investment.isCommentable,
      status: investment.status,
      badges: investment.badges,
      categoryName: investment.categoryName,
    };
  }

  async create(
    body: CreateInvestmentInputDto,
    files: PostFilesGrouped,
    userId: PRISMA_ID,
  ): Promise<InvestmentDto> {
    const { thumbnail, content } = body;

    const post = await this.postService.create(
      {
        postType: $Enums.PostType.INVESTMENT,
        content,
      },
      userId,
    );

    const poiParementers = this.getPoiParameters(body);
    await this.poiService.create({
      ...poiParementers,
      id: post.id,
    });

    let investment = null;
    try {
      investment = await this.investmentRepository.create(
        post.id,
        this.getCreateInvestmentParameters(body),
      );
    } catch (e) {
      await this.postService.delete(post.id);
      await this.poiService.delete(post.id);
      throw new SimpleBadRequest(ERROR_POST_INVESTMENT);
    }

    await this.filehandlerService.saveAllPostFiles(
      files,
      $Enums.PostType.INVESTMENT,
      investment.id,
    );

    //check if the thumbnail is to be set
    if (
      await this.filehandlerService.canAssignThumbnail(
        investment.id,
        $Enums.PostType.INVESTMENT,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      )
    ) {
      await this.postService.setThumbnail(investment.id, thumbnail);
    }

    return { ...investment };
  }

  async getAll(
    genericFilter: GenericFilter,
    investmentFilter: FilterInvestmentDto,
  ): Promise<InvestmentDto[]> {
    if (!genericFilter.orderBy) {
      return await this.investmentRepository.getAll(
        genericFilter,
        investmentFilter,
      );
    } else {
      genericFilter.pagination = false;
      const investments: InvestmentDto[] =
        await this.investmentRepository.getAll(genericFilter, investmentFilter);
      genericFilter.pagination = true;
      return await this.postService.sortPosts(
        investments,
        genericFilter,
        $Enums.PostType.INVESTMENT,
      );
    }
  }

  async getOne(id: PRISMA_ID): Promise<InvestmentDto | null> {
    const _i = await this.investmentRepository.getOne(id);

    if (!_i) throw new SimpleNotFound(ERROR_INVESTMENT_NOT_FOUND);

    return _i;
  }

  async getOneBySlug(slug: string): Promise<InvestmentDto> {
    const _p = await this.poiService.getOneBySlug(slug);
    const _i = await this.investmentRepository.getOne(_p.id);

    if (!_i) throw new SimpleNotFound(ERROR_INVESTMENT_NOT_FOUND);

    return _i;
  }

  async update(
    id: PRISMA_ID,
    body: UpdateInvestmentInputDto,
    files: PostFilesGrouped,
  ): Promise<{ slug: string; prevSlug: string }> {
    const { exclude, thumbnail, content, ...investment } = body;

    const _p = await this.postService.getOne(id);

    const _l = await this.investmentRepository.getOne(id);
    if (!_l) throw new SimpleNotFound(ERROR_INVESTMENT_NOT_FOUND);

    const isThumbnailDeleted = await this.filehandlerService.handlePatchedFiles(
      id,
      $Enums.PostType.INVESTMENT,
      files,
      exclude,
      _p.thumbnail,
    );
    if (isThumbnailDeleted) await this.postService.setThumbnail(id, '');

    await this.postService.setContent(id, content);
    await this.poiService.update({ id, ...this.getPoiParameters(body) });

    await this.investmentRepository.update(
      id,
      this.getUpdateInvestmentParameters(body),
    );

    if (
      thumbnail &&
      (await this.filehandlerService.canAssignThumbnail(
        id,
        $Enums.PostType.INVESTMENT,
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
    const _s = investment.slug ? investment.slug : _l.slug;

    return {
      slug: _s,
      prevSlug,
    };
  }

  async delete(id: PRISMA_ID): Promise<{ prevSlug: string }> {
    const _i = await this.investmentRepository.getOne(id);

    if (!_i) throw new SimpleNotFound(ERROR_INVESTMENT_NOT_FOUND);

    await this.postService.delete(id);
    await this.poiService.delete(id);

    return { prevSlug: _i.slug };
  }

  getStatuses(): typeof $Enums.InvestmentStatus {
    return this.investmentRepository.getStatuses();
  }

  getCategories(): Promise<CategoryDto[]> {
    return this.investmentRepository.getCategories();
  }

  getBadges(): Promise<BadgeDto[]> {
    return this.investmentRepository.getBadges();
  }
}
