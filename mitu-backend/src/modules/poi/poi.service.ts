import { Injectable } from '@nestjs/common';
import PoiRepository from 'src/modules/poi/poi.repository';
import { CreatePOIDTO } from 'src/modules/poi/dto/create-poi-dto.internal';
import { POIDTO } from 'src/modules/poi/dto/poi-dto.internal';
import { slugify } from 'src/utils/string-utils';

@Injectable()
export class PoiService {
  constructor(private readonly poiRepository: PoiRepository) {}

  async create(body: CreatePOIDTO): Promise<POIDTO> {
    body.slug = slugify(body.title);
    return await this.poiRepository.create(body);
  }

  async update(body: CreatePOIDTO): Promise<POIDTO> {
    if (body.title) {
      body.slug = slugify(body.title);
    }
    return await this.poiRepository.update(body);
  }

  async getOneBySlug(slug: string): Promise<POIDTO> {
    return await this.poiRepository.getOneBySlug(slug);
  }

  async delete(id: number): Promise<void> {
    await this.poiRepository.delete(id);
  }
}
