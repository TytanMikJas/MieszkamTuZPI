import { Test, TestingModule } from '@nestjs/testing';
import PoiRepository from './poi.repository';
import { PoiService } from './poi.service';
import { POIDTO } from './dto/poi-dto.internal';

const poi = {
  id: 0,
  title: 'test',
  slug: 'slug',
  locationX: 1,
  locationY: 1,
  responsible: 'test',
  street: 'test',
  buildingNr: 'test',
  apartmentNr: 'test',
} as POIDTO;

describe('POI Service', () => {
  let poiService: PoiService;

  const mockPoiRepository = {
    create: jest.fn(),
    update: jest.fn(),
    getOneBySlug: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoiService,
        {
          provide: PoiRepository,
          useValue: mockPoiRepository,
        },
      ],
    }).compile();

    poiService = module.get<PoiService>(PoiService);
  });

  it('should be defined', () => {
    expect(poiService).toBeDefined();
  });

  describe('create', () => {
    it('should create a POI', async () => {
      mockPoiRepository.create.mockResolvedValue(poi);

      expect(await poiService.create(poi)).toEqual(poi);
    });
  });

  describe('update', () => {
    it('should update a POI', async () => {
      mockPoiRepository.update.mockResolvedValue(poi);

      expect(await poiService.update(poi)).toEqual(poi);
    });
  });

  describe('getOneBySlug', () => {
    it('should get a POI by slug', async () => {
      mockPoiRepository.getOneBySlug.mockResolvedValue(poi);

      expect(await poiService.getOneBySlug('slug')).toEqual(poi);
    });
  });

  describe('delete', () => {
    it('should delete a POI', async () => {
      mockPoiRepository.delete.mockResolvedValue(undefined);

      expect(await poiService.delete(0)).toBeUndefined();
    });
  });
});
