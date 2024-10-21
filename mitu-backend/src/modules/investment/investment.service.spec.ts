import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentService } from './investment.service';
import { FilehandlerService } from '../filehandler/filehandler.service';
import InvestmentRepository from './investment.repository';

describe('InvestmentsService', () => {
  let service: InvestmentService;

  beforeEach(async () => {
    const FileserviceHandlerMock = {
      provide: FilehandlerService,
      useValue: {
        providePath: jest.fn(),
        savePostFilesByType: jest.fn(),
        getAttachments: jest.fn(),
      },
    };

    const InvestmentRepositoryMock = {
      provide: InvestmentRepository,
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
        InvestmentService,
        InvestmentRepositoryMock,
        FileserviceHandlerMock,
      ],
    }).compile();

    service = module.get<InvestmentService>(InvestmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
