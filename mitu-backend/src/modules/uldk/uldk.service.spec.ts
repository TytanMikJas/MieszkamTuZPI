import { Test, TestingModule } from '@nestjs/testing';
import { ULDKService } from './uldk.service';

describe('ULDKService', () => {
  let service: ULDKService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ULDKService],
    }).compile();

    service = module.get<ULDKService>(ULDKService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct coordinates - 4326 -> 2180', () => {
    const { x, y } = service.epsg4326epsg2180('50.093019', '19.091449');
    expect(x).toBe('506539.264796399');
    expect(y).toBe('247311.70888504386');
  });

  it('should return correct coordinates - 2180 -> 4326', () => {
    // in this conversion, x and y are reversed
    const { x, y } = service.epsg2180epsg4326(
      '247311.70888504386',
      '506539.264796399',
    );
    expect(y).toBe('50.093019');
    expect(x).toBe('19.091449');
  });

  it('should return correct polygon center', () => {
    const center = service.calculatePolygonCenter([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
    expect(center[0]).toBe(2);
    expect(center[1]).toBe(2);
  });

  it('should return correct polygon bounds', () => {
    const bounds = service.calculatePolygonBounds([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
    expect(bounds[0]).toBe(1.4);
    expect(bounds[1]).toBe(1.4);
    expect(bounds[2]).toBe(2.6);
    expect(bounds[3]).toBe(2.6);
  });
});
