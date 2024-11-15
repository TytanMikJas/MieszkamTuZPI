import { Test, TestingModule } from '@nestjs/testing';
import { FilehandlerService } from '../filehandler/filehandler.service';
import { PoiService } from '../poi/poi.service';
import { PostService } from '../post/post.service';
import { InvestmentService } from './investment.service';
import InvestmentRepository from './investment.repository';
import CreateInvestmentInputDto from './dto/create-investment-dto.input';
import { InvestmentDto } from './dto/investment-dto';
import PostDto from '../post/dto/post-dto.internal';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { UpdateInvestmentInputDto } from './dto/update-investment-dto.input';
import { POIDTO } from '../poi/dto/poi-dto.internal';
import { GenericFilter } from 'src/query.filter';
import { FilterInvestmentDto } from './dto/filter-investment.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('InvestmentService', () => {
  let postService: PostService;
  let filehandlerService: FilehandlerService;
  let poiService: PoiService;
  let investmentRepository: InvestmentRepository;
  let investmentService: InvestmentService;

  const createInvestmentDto: CreateInvestmentInputDto = {
    title: 'Test investment',
    content: 'Test content',
    locationX: 0,
    locationY: 0,
    area: '1,1;1,1;1,1;1,1',
    street: 'Test street',
    buildingNr: '1',
    apartmentNr: '1',
    responsible: 'Test responsible',
    isCommentable: true,
    status: 'IN_PROGRESS',
    badges: ['badge1', 'badge2'],
    categoryName: 'Test category',
    thumbnail: 'test.png',
  };

  const updateInvestmentDto: UpdateInvestmentInputDto = {
    title: 'Test investment',
    content: 'Test content',
    locationX: 0,
    locationY: 0,
    area: '1,1;1,1;1,1;1,1',
    street: 'Test street',
    buildingNr: '1',
    apartmentNr: '1',
    responsible: 'Test responsible',
    isCommentable: true,
    status: 'IN_PROGRESS',
    badges: ['badge1', 'badge2'],
    categoryName: 'Test category',
    thumbnail: 'test.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 0,
    slug: 'test-investment',
  };

  const investment: InvestmentDto = {
    id: 0,
    updatedAt: new Date(),
    ...createInvestmentDto,
    category: {
      name: 'test',
      icon: 'test',
    },
    badges: [
      {
        name: 'badge1',
        icon: 'test',
        primary: 'test',
        secondary: 'test',
      },
      {
        name: 'badge2',
        icon: 'test',
        primary: 'test',
        secondary: 'test',
      },
    ],
    slug: createInvestmentDto.title,
  };

  const mockInvestmentRepository = () => ({
    getAll: jest.fn(),
    getByParent: jest.fn(),
    getStatuses: jest.fn(),
    getCategories: jest.fn(),
    getBadges: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    update: jest.fn(),
  });

  const mockPostService = () => ({
    getOne: jest.fn(),
    create: jest.fn(),
    incrementComentCount: jest.fn(),
    setContent: jest.fn(),
    setThumbnail: jest.fn(),
    decrementComentCount: jest.fn(),
    delete: jest.fn(),
    sortPosts: jest.fn(),
  });

  const mockFilehandlerService = () => ({
    saveAllPostFiles: jest.fn(),
    canAssignThumbnail: jest.fn(),
    handlePatchedFiles: jest.fn(),
  });

  const mockPoiService = () => ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getOneBySlug: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        InvestmentService,
        {
          provide: InvestmentRepository,
          useFactory: mockInvestmentRepository,
        },
        { provide: PostService, useFactory: mockPostService },
        { provide: FilehandlerService, useFactory: mockFilehandlerService },
        { provide: PoiService, useFactory: mockPoiService },
      ],
    }).compile();

    investmentService = module.get<InvestmentService>(InvestmentService);
    investmentRepository =
      module.get<InvestmentRepository>(InvestmentRepository);
    postService = module.get<PostService>(PostService);
    filehandlerService = module.get<FilehandlerService>(FilehandlerService);
    poiService = module.get<PoiService>(PoiService);
  });

  it('should be defined', () => {
    expect(investmentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new investment', async () => {
      const post = {
        id: 0,
      } as PostDto;

      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      const poiParameters =
        investmentService.getPoiParameters(createInvestmentDto);

      jest.spyOn(postService, 'create').mockResolvedValue(post);
      jest.spyOn(investmentRepository, 'create').mockResolvedValue(investment);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);

      const result = await investmentService.create(
        createInvestmentDto,
        files,
        0,
      );

      expect(poiService.create).toHaveBeenCalledWith({
        ...poiParameters,
        id: post.id,
      });

      expect(filehandlerService.saveAllPostFiles).toHaveBeenCalledWith(
        files,
        'INVESTMENT',
        post.id,
      );
      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        investment.thumbnail,
      );
      expect(result).toEqual(investment);
    });

    it('should throw an error if the post creation fails', async () => {
      const post = {
        id: 0,
      } as PostDto;

      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      jest.spyOn(postService, 'create').mockResolvedValue(post);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest.spyOn(investmentRepository, 'create').mockRejectedValue(new Error());

      try {
        await investmentService.create(createInvestmentDto, files, 0);
      } catch (e) {
        expect(postService.delete).toHaveBeenCalledWith(post.id);
        expect(poiService.delete).toHaveBeenCalledWith(post.id);
      }
    });

    it('should set thumbnail', async () => {
      const post = {
        id: 0,
      } as PostDto;

      const thumbnailFile = {
        originalname: 'test.png',
      } as Express.Multer.File;

      const files = {
        IMAGE: [thumbnailFile],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      jest.spyOn(postService, 'create').mockResolvedValue(post);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest.spyOn(investmentRepository, 'create').mockResolvedValue(investment);

      await investmentService.create(createInvestmentDto, files, 0);

      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        thumbnailFile.originalname,
      );
    });
  });

  describe('update', () => {
    it('should update an investment', async () => {
      const post = {
        id: 0,
      } as PostDto;

      const thumbnailFile = {
        originalname: 'test.png',
      } as Express.Multer.File;

      const files = {
        IMAGE: [thumbnailFile],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      const poiParameters = {
        id: 0,
        title: createInvestmentDto.title,
        slug: investment.title,
        locationX: createInvestmentDto.locationX,
        locationY: createInvestmentDto.locationY,
        responsible: createInvestmentDto.responsible,
        street: createInvestmentDto.street,
        buildingNr: createInvestmentDto.buildingNr,
        apartmentNr: createInvestmentDto.apartmentNr,
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
      } as POIDTO;

      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(investment);
      jest.spyOn(investmentRepository, 'update').mockResolvedValue(investment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);
      jest
        .spyOn(filehandlerService, 'handlePatchedFiles')
        .mockResolvedValue(false);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest.spyOn(poiService, 'update').mockResolvedValue(poiParameters);

      const result = await investmentService.update(
        0,
        updateInvestmentDto,
        files,
      );

      expect(poiService.update).toHaveBeenCalled();
      expect(investmentRepository.update).toHaveBeenCalled();
      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        thumbnailFile.originalname,
      );
      expect(result.slug).toEqual(investment.slug);
    });

    it('should throw an error if the investment does not exist', async () => {
      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(null);

      try {
        await investmentService.update(
          0,
          updateInvestmentDto,
          {} as PostFilesGrouped,
        );
      } catch (e: any) {
        expect(e.message).toBe('Simple Not Found');
      }
    });
  });

  describe('delete', () => {
    it('should delete an investment', async () => {
      const post = {
        id: 0,
      } as PostDto;

      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(investment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await investmentService.delete(0);

      expect(postService.delete).toHaveBeenCalled();
      expect(poiService.delete).toHaveBeenCalled();
    });

    it('should throw an error if the investment does not exist', async () => {
      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(null);

      try {
        await investmentService.delete(0);
      } catch (e: any) {
        expect(e.message).toBe('Simple Not Found');
      }
    });
  });

  describe('getAll', () => {
    it('should return all investments', async () => {
      const filter = {} as GenericFilter;
      const filterInvestmentDto = {} as FilterInvestmentDto;

      const investments = [
        {
          ...investment,
        },
      ] as InvestmentDto[];

      jest.spyOn(investmentRepository, 'getAll').mockResolvedValue(investments);

      const result = await investmentService.getAll(
        filter,
        filterInvestmentDto,
      );

      expect(result).toEqual(investments);
      expect(investmentRepository.getAll).toHaveBeenCalledWith(
        filter,
        filterInvestmentDto,
      );
    });
  });

  describe('getOne', () => {
    it('should return an investment', async () => {
      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(investment);

      const result = await investmentService.getOne(0);

      expect(result).toEqual(investment);
      expect(investmentRepository.getOne).toHaveBeenCalledWith(0);
    });
  });

  describe('getOneBySlug', () => {
    it('should return an investment by slug', async () => {
      const poi = {
        id: 0,
      } as POIDTO;

      jest.spyOn(investmentRepository, 'getOne').mockResolvedValue(investment);
      jest.spyOn(poiService, 'getOneBySlug').mockResolvedValue(poi);

      const result = await investmentService.getOneBySlug('test-investment');

      expect(result).toEqual(investment);
      expect(investmentRepository.getOne).toHaveBeenCalledWith(0);
    });
  });
});
