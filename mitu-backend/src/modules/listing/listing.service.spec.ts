import { TestingModule, Test } from '@nestjs/testing';
import { FilehandlerService } from '../filehandler/filehandler.service';
import { PoiService } from '../poi/poi.service';
import { PostService } from '../post/post.service';
import ListingRepository from './listing.repository';
import { ListingService } from './listing.service';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import CreateListingInputDto from './dto/create-listing-dto.input';
import PostDto from '../post/dto/post-dto.internal';
import { ListingDto } from './dto/listing-dto';
import { GenericFilter } from 'src/query.filter';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { POIDTO } from '../poi/dto/poi-dto.internal';
import { UpdateListingInputDto } from './dto/update-listing-dto';

describe('ListingService', () => {
  let postService: PostService;
  let filehandlerService: FilehandlerService;
  let poiService: PoiService;
  let listingRepository: ListingRepository;
  let listingService: ListingService;

  const mockListingRepository = () => ({
    getAll: jest.fn(),
    getByParent: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
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
      providers: [
        ListingService,
        {
          provide: ListingRepository,
          useFactory: mockListingRepository,
        },
        {
          provide: PostService,
          useFactory: mockPostService,
        },
        {
          provide: FilehandlerService,
          useFactory: mockFilehandlerService,
        },
        {
          provide: PoiService,
          useFactory: mockPoiService,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    filehandlerService = module.get<FilehandlerService>(FilehandlerService);
    poiService = module.get<PoiService>(PoiService);
    listingRepository = module.get<ListingRepository>(ListingRepository);
    listingService = module.get<ListingService>(ListingService);
  });

  describe('create', () => {
    it('should create a listing', async () => {
      const inputListing = {
        title: 'Test listing',
        locationX: 10,
        locationY: 20,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        area: '2,2;2,2;2,2;2,2',
        isCommentable: false,
        categoryName: 'Test category',
        content: 'Test content',
        thumbnail: 'test-thumbnail.png',
        price: 1000,
        surface: 50,
        sell: true,
      } as CreateListingInputDto;

      const listing = {
        id: 1,
        updatedAt: new Date(),
        ...inputListing,
        category: {
          name: 'category',
          icon: 'icon',
        },
        slug: inputListing.title,
      } as ListingDto;

      const post = {
        id: 1,
      } as PostDto;

      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      const poiParameters = {
        title: inputListing.title,
        slug: listing.title,
        locationX: inputListing.locationX,
        locationY: inputListing.locationY,
        responsible: inputListing.responsible,
        street: inputListing.street,
        buildingNr: inputListing.buildingNr,
        apartmentNr: inputListing.apartmentNr,
      };

      jest.spyOn(postService, 'create').mockResolvedValue(post);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest.spyOn(listingRepository, 'create').mockResolvedValue(listing);

      const result = await listingService.create(inputListing, files, 1);

      expect(poiService.create).toHaveBeenCalledWith({
        ...poiParameters,
        id: post.id,
      });
      expect(filehandlerService.saveAllPostFiles).toHaveBeenCalledWith(
        files,
        'LISTING',
        post.id,
      );
      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        listing.thumbnail,
      );
      expect(result).toEqual(listing);
    });

    describe('getAll', () => {
      it('should return all listings with filter applied', async () => {
        const filter = {} as GenericFilter;

        const listings = [
          { id: 1, title: 'Listing 1' },
          { id: 2, title: 'Listing 2' },
        ] as ListingDto[];

        jest.spyOn(listingRepository, 'getAll').mockResolvedValue(listings);

        const result = await listingService.getAll(filter);

        expect(listingRepository.getAll).toHaveBeenCalledWith(filter);
        expect(result).toEqual(listings);
      });
    });

    describe('getOne', () => {
      it('should return a listing by ID', async () => {
        const listing = { id: 1, title: 'Listing 1' } as ListingDto;

        jest.spyOn(listingRepository, 'getOne').mockResolvedValue(listing);

        const result = await listingService.getOne(1);

        expect(listingRepository.getOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(listing);
      });

      it('should throw NotFound exception if listing not found', async () => {
        jest.spyOn(listingRepository, 'getOne').mockResolvedValue(null);

        await expect(listingService.getOne(1)).rejects.toThrow(SimpleNotFound);
      });
    });

    it('should delete post and poi if listing creation fails', async () => {
      const inputListing = {
        title: 'Test listing',
        locationX: 10,
        locationY: 20,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        area: '2,2;2,2;2,2;2,2',
        isCommentable: false,
        categoryName: 'Test category',
        content: 'Test content',
        thumbnail: 'test-thumbnail.png',
        price: 1000,
        surface: 50,
        sell: true,
      } as CreateListingInputDto;

      const post = {
        id: 1,
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
      jest.spyOn(listingRepository, 'create').mockRejectedValue(new Error());

      try {
        await listingService.create(inputListing, files, 1);
      } catch (e) {
        expect(postService.delete).toHaveBeenCalledWith(post.id);
        expect(poiService.delete).toHaveBeenCalledWith(post.id);
      }
    });

    describe('update', () => {
      it('should update a listing', async () => {
        const inputListing = {
          title: 'Updated Listing',
          locationX: 0,
          locationY: 0,
          responsible: 'Test responsible',
          street: 'Test street',
          buildingNr: 'Test building number',
          apartmentNr: 'Test apartment number',
          thumbnail: 'updated-thumbnail.png',
          price: 100000,
          surface: 100,
          content: 'Updated content',
          slug: 'updated-listing',
          sell: true,
          id: 0,
          updatedAt: new Date(),
        } as UpdateListingInputDto;

        const listing = {
          id: 0,
          updatedAt: new Date(),
          price: 205000,
          ...inputListing,
        } as ListingDto;

        const post = {
          id: 0,
        } as PostDto;

        const thumbnailFile = {
          originalname: 'updated-thumbnail.png',
        } as Express.Multer.File;

        const files = {
          IMAGE: [thumbnailFile],
          TD: [],
          DOC: [],
        } as PostFilesGrouped;

        const poi = {
          id: 0,
          title: inputListing.title,
          slug: inputListing.slug,
          locationX: inputListing.locationX,
          locationY: inputListing.locationY,
          responsible: inputListing.responsible,
          street: inputListing.street,
          buildingNr: inputListing.buildingNr,
          apartmentNr: inputListing.apartmentNr,
          price: listing.price,
          surface: inputListing.surface,
          sell: inputListing.sell,
        } as POIDTO;

        jest.spyOn(postService, 'getOne').mockResolvedValue(post);
        jest.spyOn(listingRepository, 'getOne').mockResolvedValue(listing);
        jest
          .spyOn(filehandlerService, 'handlePatchedFiles')
          .mockResolvedValue(false);
        jest
          .spyOn(filehandlerService, 'canAssignThumbnail')
          .mockResolvedValue(true);
        jest.spyOn(poiService, 'update').mockResolvedValue(poi);

        const result = await listingService.update(0, inputListing, files);

        expect(poiService.update).toHaveBeenCalled();
        expect(listingRepository.update).toHaveBeenCalled();
        expect(postService.setThumbnail).toHaveBeenCalledWith(
          post.id,
          thumbnailFile.originalname,
        );
        expect(result.slug).toEqual(listing.slug);
      });
    });
  });
});
