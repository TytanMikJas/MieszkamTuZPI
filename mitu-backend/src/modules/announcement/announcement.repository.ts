import { Injectable } from '@nestjs/common';
import { AnnouncementDto } from 'src/modules/announcement/dto/announcement-dto';
import { PrismaClient } from '@prisma/client';
import { GenericFilter } from 'src/query.filter';
import CategoryDto from './dto/category-dto';
import { POIDTO } from '../poi/dto/poi-dto.internal';
import { AnnouncementInternalDto } from './dto/announcement-dto.internal';
import AnnouncementExcludePoiDto from './dto/create-announcement-dto.internal';

/**
 * Repository for Announcement
 * @export
 * @class AnnouncementRepository
 * @param {PrismaClient} prisma
 * @method mapAnnouncementToDto
 * @method create
 * @method getAll
 * @method getOne
 * @method update
 * @method getCategories
 */
@Injectable()
export default class AnnouncementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Map announcement to DTO
   * @param {AnnouncementInternalDto} a
   * @param {POIDTO} p
   * @returns {AnnouncementDto}
   */
  mapAnnouncementToDto(a: AnnouncementInternalDto, p: POIDTO): AnnouncementDto {
    return {
      ...a,
      ...p,
    };
  }

  /**
   * Create announcement
   * @param {number} id
   * @param {AnnouncementExcludePoiDto} body
   * @returns {Promise<AnnouncementDto>}
   * */
  async create(
    id: number,
    body: AnnouncementExcludePoiDto,
  ): Promise<AnnouncementDto> {
    const { categoryName, ...rest } = body;
    return this.prisma.announcement
      .create({
        data: {
          ...rest,
          category: { connect: { name: categoryName } },
          post: {
            connect: {
              id: id,
            },
          },
          poi: {
            connect: {
              id: id,
            },
          },
        },
        include: {
          category: true,
          poi: true,
        },
      })
      .then((a) => this.mapAnnouncementToDto(a, a.poi));
  }

  /**
   * Delete announcement
   * @param {number} id
   * @returns {Promise<AnnouncementDto>}
   * */
  async getAll(filter: GenericFilter): Promise<AnnouncementDto[]> {
    return this.prisma.announcement
      .findMany({
        skip: filter.skip,
        take: filter.take,
        orderBy: filter.orderBySpecialization,
        where: {
          AND: [filter.where],
        },
        include: {
          category: true,
          poi: true,
        },
      })
      .then((announcements) =>
        announcements.map((a) => this.mapAnnouncementToDto(a, a.poi)),
      );
  }

  /**
   * Get one announcement
   * @param {number} id
   * @returns {Promise<AnnouncementDto>}
   * */
  async getOne(id: number): Promise<AnnouncementDto | null> {
    return this.prisma.announcement
      .findUnique({
        where: { id },
        include: {
          category: true,
          poi: true,
        },
      })
      .then((a) => this.mapAnnouncementToDto(a, a.poi));
  }

  /**
   * Get one announcement by slug
   * @param {string} slug
   * @returns {Promise<AnnouncementDto>}
   * */
  async update(
    id: number,
    body: AnnouncementExcludePoiDto,
  ): Promise<AnnouncementDto> {
    const { categoryName, ...rest } = body;

    const categoryConnection = categoryName
      ? { connect: { name: categoryName } }
      : {};

    return this.prisma.announcement
      .update({
        where: { id: id },
        data: {
          ...rest,
          category: categoryConnection,
        },
        include: {
          category: true,
          poi: true,
        },
      })
      .then((a) => this.mapAnnouncementToDto(a, a.poi));
  }

  /**
   * Delete announcement
   * @param {number} id
   * @returns {Promise<AnnouncementDto>}
   * */
  getCategories(): Promise<CategoryDto[]> {
    return this.prisma.announcementCategory.findMany();
  }
}
