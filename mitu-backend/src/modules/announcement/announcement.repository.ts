import { Injectable } from '@nestjs/common';
import { CreateAnnouncementInputDtoWithId } from 'src/modules/announcement/dto/create-announcement-dto.input';
import { AnnouncementDto } from 'src/modules/announcement/dto/announcement-dto';
import { PrismaClient } from '@prisma/client';
import { GenericFilter } from 'src/query.filter';
import UpdateAnnouncementInternalDto from 'src/modules/announcement/dto/update-announcement-dto.input';
import { slugify } from 'src/utils/string-utils';

import CategoryDto from './dto/category-dto';

@Injectable()
export default class AnnouncementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    body: CreateAnnouncementInputDtoWithId,
  ): Promise<AnnouncementDto> {
    const { title, categoryName, id, ...rest } = body;
    return this.prisma.announcement.create({
      data: {
        ...rest,
        title,
        slug: slugify(title),
        category: { connect: { name: categoryName } },
        post: {
          connect: {
            id: id,
          },
        },
      },

      include: {
        category: true,
      },
    });
  }

  async getAll(filter: GenericFilter): Promise<AnnouncementDto[]> {
    return this.prisma.announcement.findMany({
      skip: filter.skip,
      take: filter.take,
      orderBy: filter.orderBySpecialization,
      where: {
        AND: [filter.where, filter.whereLocation],
      },
      include: {
        category: true,
      },
    });
  }

  async getOne(id: number): Promise<AnnouncementDto | null> {
    return this.prisma.announcement.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async getOneBySlug(slug: string): Promise<AnnouncementDto> {
    return this.prisma.announcement.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: number,
    body: UpdateAnnouncementInternalDto,
  ): Promise<AnnouncementDto> {
    if (body.title) {
      body.slug = slugify(body.title);
    }

    const { categoryName, id: ID, ...rest } = body;

    const categoryConnection = categoryName
      ? { connect: { name: categoryName } }
      : {};
    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...rest,
        category: categoryConnection,
      },
      include: {
        category: true,
      },
    });
  }

  getCategories(): Promise<CategoryDto[]> {
    return this.prisma.announcementCategory.findMany();
  }
}
