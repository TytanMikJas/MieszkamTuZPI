import { Test, TestingModule } from '@nestjs/testing';
import { ListingService } from './listing.service';

describe('ListingsService', () => {
  let service: ListingService;

  beforeEach(async () => {
    const FileserviceHandlerMock = {
      provide: 'FilehandlerService',
      useValue: {
        providePath: jest.fn(),
        savePostFilesByType: jest.fn(),
        getAttachments: jest.fn(),
      },
    };

    const ListingsRepositoryMock = {
      provide: 'ListingsRepository',
      useValue: {
        create: jest.fn(),
        getAll: jest.fn(),
        getOne: jest.fn(),
        update: jest.fn(),
        getStatuses: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingService,
        ListingsRepositoryMock,
        FileserviceHandlerMock,
      ],
    }).compile();

    service = module.get<ListingService>(ListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
