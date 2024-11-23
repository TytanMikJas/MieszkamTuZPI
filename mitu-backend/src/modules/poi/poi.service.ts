import { Injectable } from '@nestjs/common';
import PoiRepository from 'src/modules/poi/poi.repository';
import { CreatePOIDTO } from 'src/modules/poi/dto/create-poi-dto.internal';
import { POIDTO } from 'src/modules/poi/dto/poi-dto.internal';
import { slugify } from 'src/utils/string-utils';

/**
 * Poi service
 * @export
 * @class PoiService
 * @param {PoiRepository} poiRepository
 * @constructor
 */
@Injectable()
export class PoiService {
  constructor(private readonly poiRepository: PoiRepository) {}

  /**
   * Create a new POI
   * @param {CreatePOIDTO} body - The POI DTO
   * @returns {Promise<POIDTO>} - The POI DTO
   */
  async create(body: CreatePOIDTO): Promise<POIDTO> {
    body.slug = slugify(body.title);
    return await this.poiRepository.create(body);
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO[]>}
   */
  async update(body: CreatePOIDTO): Promise<POIDTO> {
    if (body.title) {
      body.slug = slugify(body.title);
    }
    return await this.poiRepository.update(body);
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO>}
   */
  async getOneBySlug(slug: string): Promise<POIDTO> {
    return await this.poiRepository.getOneBySlug(slug);
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO>}
   */
  async getOneById(id: number): Promise<POIDTO> {
    return await this.poiRepository.getOneById(id);
  }

  /**
   * Get all POIs
   * @returns {Promise<POIDTO[]>}
   */
  async delete(id: number): Promise<void> {
    await this.poiRepository.delete(id);
  }
}
