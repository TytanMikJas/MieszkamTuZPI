import { PrismaClient } from '@prisma/client';
import { GenericFilter } from 'src/query.filter';
import { Injectable } from '@nestjs/common';
import { ListingDto } from 'src/modules/listing/dto/listing-dto';
import { POIDTO } from 'src/modules/poi/dto/poi-dto.internal';
import ListingExcludePoiDto from 'src/modules/listing/dto/create-listing-dto.internal';
import { ListingInternalDto } from './dto/listing-dto.internal';

/**
 * Listing repository.
 * @class
 * @exports
 * @constructor
 * @param {PrismaClient} prisma - The prisma client.
 * @requires Injectable
 * @see {@link PrismaClient}
 */
@Injectable()
export default class ListingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  mapListingToDto(l: ListingInternalDto, p: POIDTO): ListingDto {
    return {
      ...l,
      ...p,
    };
  }

  async create(id: number, body: ListingExcludePoiDto): Promise<ListingDto> {
    const { ...rest } = body;
    return this.prisma.listing
      .create({
        data: {
          ...rest,
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
          poi: true,
        },
      })
      .then((l) => this.mapListingToDto(l, l.poi));
  }

  async getAll(filter: GenericFilter): Promise<ListingDto[]> {
    return this.prisma.listing
      .findMany({
        skip: filter.skip,
        take: filter.take,
        orderBy: filter.orderBySpecialization,
        where: {
          AND: [filter.where], // TODO: Fix this - previously [filter.where, filter.whereLocation]
        },
        include: {
          poi: true,
        },
      })
      .then((listings) => listings.map((l) => this.mapListingToDto(l, l.poi)));
  }

  async getOne(id: number): Promise<ListingDto | null> {
    return this.prisma.listing
      .findUnique({
        where: { id },
        include: {
          poi: true,
        },
      })
      .then((l) => (l ? this.mapListingToDto(l, l.poi) : null));
  }

  async update(id: number, body: ListingExcludePoiDto): Promise<ListingDto> {
    return this.prisma.listing
      .update({
        where: { id },
        data: body,
        include: {
          poi: true,
        },
      })
      .then((l) => this.mapListingToDto(l, l.poi));
  }
}
