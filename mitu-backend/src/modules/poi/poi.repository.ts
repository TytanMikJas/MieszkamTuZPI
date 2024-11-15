import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePOIDTO } from './dto/create-poi-dto.internal';
import { POIDTO } from './dto/poi-dto.internal';
import { PRISMA_ID } from 'src/types';
import { UpdatePOIDTO } from './dto/update-poi-dto.internal';

/**
 * Poi repository
 * @export
 * @class PoiRepository
 * @param {PrismaClient} prisma
 * @constructor
 */
@Injectable()
export default class PoiRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new POI
   * @param {CreatePOIDTO} body - The POI DTO
   * @returns {Promise<POIDTO>} - The POI DTO
   */
  async create(body: CreatePOIDTO): Promise<POIDTO> {
    return await this.prisma.pOI.create({
      data: body,
    });
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO[]>}
   */
  async update(body: UpdatePOIDTO): Promise<POIDTO> {
    const { id, ...rest } = body;

    const notNull = Object.keys(rest).reduce((acc, key) => {
      if (rest[key] !== undefined) {
        acc[key] = rest[key];
      }
      return acc;
    }, {});

    return await this.prisma.pOI.update({
      where: { id },
      data: notNull,
    });
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO[]>}
   */
  async getOneBySlug(slug: string): Promise<POIDTO> {
    return await this.prisma.pOI.findUnique({ where: { slug } });
  }

  async getOneById(id: PRISMA_ID): Promise<POIDTO> {
    return await this.prisma.pOI.findUnique({ where: { id } });
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO[]>}
   */
  async delete(id: PRISMA_ID): Promise<void> {
    await this.prisma.pOI.delete({ where: { id } });
  }
}
