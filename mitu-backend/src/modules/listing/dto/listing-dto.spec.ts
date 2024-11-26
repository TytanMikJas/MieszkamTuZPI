import { plainToClass } from 'class-transformer';
import { ListingDto } from './listing-dto';

describe('ListingDto', () => {
  it('should correctly transform numeric fields', () => {
    const data = {
      price: '100000',
      surface: '50',
    };

    const dto = plainToClass(ListingDto, data);
    expect(dto.price).toBe(100000);
    expect(dto.surface).toBe(50);
  });

  it('should handle missing optional fields without error', () => {
    const data = {
      id: 1,
      title: 'Test Listing',
      locationX: 1,
      locationY: 1,
      responsible: 'UM Test',
      sell: true,
    };

    const dto = plainToClass(ListingDto, data);
    expect(dto.street).toBeUndefined();
    expect(dto.buildingNr).toBeUndefined();
  });
});
