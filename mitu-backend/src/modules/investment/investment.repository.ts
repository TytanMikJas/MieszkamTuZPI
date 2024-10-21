import { $Enums, PrismaClient } from '@prisma/client';
import { GenericFilter } from 'src/query.filter';
import { InvestmentDto } from 'src/modules/investment/dto/investment-dto';
import { Injectable } from '@nestjs/common';
import { FilterInvestmentDto } from 'src/modules/investment/dto/filter-investment.dto';
import { CategoryDto } from 'src/modules/investment/dto/category-dto';
import BadgeDto from 'src/modules/investment/dto/badge-dto';
import { POIDTO } from 'src/modules/poi/dto/poi-dto.internal';
import { InvestmentInternalDto } from 'src/modules/investment/dto/investment-dto.internal';
import UpdateInvestmentExcludePoiDto from 'src/modules/investment/dto/update-investment-dto.internal';
import CreateInvestmentExcludePoiDto from 'src/modules/investment/dto/create-investment-dto.internal';

/**
 * Investment repository.
 * @class
 * @exports
 * @constructor
 * @param {PrismaClient} prisma - The prisma client.
 * @requires Injectable
 * @see {@link PrismaClient}
 */
@Injectable()
export default class InvestmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  mapInvestmentToDto(i: InvestmentInternalDto, p: POIDTO): InvestmentDto {
    return {
      ...i,
      ...p,
    };
  }

  async create(
    id: number,
    body: CreateInvestmentExcludePoiDto,
  ): Promise<InvestmentDto> {
    const { badges, categoryName, ...rest } = body;
    return this.prisma.investment
      .create({
        data: {
          ...rest,
          badges: {
            connect: badges?.map((name: string) => ({ name })),
          },
          post: {
            connect: {
              id: id,
            },
          },
          category: {
            connect: {
              name: categoryName,
            },
          },
          poi: {
            connect: {
              id: id,
            },
          },
        },
        include: {
          badges: true,
          category: true,
          poi: true,
        },
      })
      .then((i) => this.mapInvestmentToDto(i, i.poi));
  }

  async getAll(
    genericFilter: GenericFilter,
    investmentFilter: FilterInvestmentDto,
  ): Promise<InvestmentDto[]> {
    return this.prisma.investment
      .findMany({
        skip: genericFilter.skip,
        take: genericFilter.take,
        orderBy: genericFilter.orderBySpecialization,
        where: {
          AND: [
            genericFilter.where,
            investmentFilter.badgesWhere,
            investmentFilter.categoryWhere,
          ],
        },
        include: {
          badges: true,
          category: true,
          poi: true,
        },
      })
      .then((investment) =>
        investment.map((i) => this.mapInvestmentToDto(i, i.poi)),
      );
  }

  async getOne(id: number): Promise<InvestmentDto> {
    return this.prisma.investment
      .findUnique({
        where: { id },
        include: {
          badges: true,
          category: true,
          poi: true,
        },
      })
      .then((i) => this.mapInvestmentToDto(i, i.poi));
  }

  async update(
    id: number,
    body: UpdateInvestmentExcludePoiDto,
  ): Promise<InvestmentDto> {
    const { badges, categoryName, ...rest } = body;

    const connections: any = {};

    if (badges) {
      connections.badges = {
        set: badges.map((name: string) => ({ name })),
      };
    }

    if (categoryName) {
      connections.category = {
        connect: {
          name: categoryName,
        },
      };
    }

    return this.prisma.investment
      .update({
        where: { id },
        data: {
          ...rest,
          ...connections,
        },
        include: {
          badges: true,
          category: true,
          poi: true,
        },
      })
      .then((i) => this.mapInvestmentToDto(i, i.poi));
  }

  getStatuses(): typeof $Enums.InvestmentStatus {
    return $Enums.InvestmentStatus;
  }

  getCategories(): Promise<CategoryDto[]> {
    return this.prisma.investmentCategory.findMany();
  }

  getBadges(): Promise<BadgeDto[]> {
    return this.prisma.badge.findMany();
  }
}
