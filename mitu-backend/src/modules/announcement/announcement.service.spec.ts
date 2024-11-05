import { TestingModule, Test } from '@nestjs/testing';
import { FilehandlerService } from '../filehandler/filehandler.service';
import { PoiService } from '../poi/poi.service';
import { PostService } from '../post/post.service';
import AnnouncementRepository from './announcement.repository';
import { AnnouncementService } from './announcement.service';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import CreateAnnouncementInputDto from './dto/create-announcement-dto.input';
import PostDto from '../post/dto/post-dto.internal';
import { AnnouncementDto } from './dto/announcement-dto';
import { GenericFilter } from 'src/query.filter';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { POIDTO } from '../poi/dto/poi-dto.internal';
import { UpdateAnnouncementInputDto } from './dto/update-announcement-dto.input';

describe('AnnouncementService', () => {
  let postService: PostService;
  let filehandlerService: FilehandlerService;
  let poiService: PoiService;
  let announcementRepository: AnnouncementRepository;
  let announcementService: AnnouncementService;

  const mockAnnouncementRepository = () => ({
    getAll: jest.fn(),
    getByParent: jest.fn(),
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
      providers: [
        AnnouncementService,
        {
          provide: AnnouncementRepository,
          useFactory: mockAnnouncementRepository,
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
    announcementRepository = module.get<AnnouncementRepository>(
      AnnouncementRepository,
    );
    announcementService = module.get<AnnouncementService>(AnnouncementService);
  });

  describe('create', () => {
    it('should create an announcement', async () => {
      const inputAnnouncement = {
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
        content: 'Test content',
        thumbnail: 'test.png',
      } as CreateAnnouncementInputDto;

      const announcement = {
        id: 0,
        updatedAt: new Date(),
        ...inputAnnouncement,
        category: {
          name: 'test',
          icon: 'test',
        },
        slug: inputAnnouncement.title,
      } as AnnouncementDto;

      const post = {
        id: 0,
      } as PostDto;

      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;

      const poiParameters = {
        title: inputAnnouncement.title,
        slug: announcement.title,
        locationX: inputAnnouncement.locationX,
        locationY: inputAnnouncement.locationY,
        responsible: inputAnnouncement.responsible,
        street: inputAnnouncement.street,
        buildingNr: inputAnnouncement.buildingNr,
        apartmentNr: inputAnnouncement.apartmentNr,
      };

      jest.spyOn(postService, 'create').mockResolvedValue(post);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest
        .spyOn(announcementRepository, 'create')
        .mockResolvedValue(announcement);

      const result = await announcementService.create(
        inputAnnouncement,
        files,
        0,
      );

      expect(poiService.create).toHaveBeenCalledWith({
        ...poiParameters,
        id: post.id,
      });
      expect(filehandlerService.saveAllPostFiles).toHaveBeenCalledWith(
        files,
        'ANNOUNCEMENT',
        post.id,
      );
      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        announcement.thumbnail,
      );
      expect(result).toEqual(announcement);
    });

    it('should delete post and poi if announcement creation fails', async () => {
      const inputAnnouncement = {
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
        content: 'Test content',
        thumbnail: 'test.png',
      } as CreateAnnouncementInputDto;

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
      jest
        .spyOn(announcementRepository, 'create')
        .mockRejectedValue(new Error());

      try {
        await announcementService.create(inputAnnouncement, files, 0);
      } catch (e) {
        expect(postService.delete).toHaveBeenCalledWith(post.id);
        expect(poiService.delete).toHaveBeenCalledWith(post.id);
      }
    });

    it('should set thumbnail', async () => {
      const inputAnnouncement = {
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
        content: 'Test content',
        thumbnail: 'test.png',
      } as CreateAnnouncementInputDto;

      const announcement = {
        id: 0,
        updatedAt: new Date(),
        ...inputAnnouncement,
        category: {
          name: 'test',
          icon: 'test',
        },
        slug: inputAnnouncement.title,
      } as AnnouncementDto;

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
      jest
        .spyOn(announcementRepository, 'create')
        .mockResolvedValue(announcement);

      await announcementService.create(inputAnnouncement, files, 0);

      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        thumbnailFile.originalname,
      );
    });
  });

  describe('getAll', () => {
    it('should return all announcements', async () => {
      const filter = {} as GenericFilter;

      const announcements = [
        {
          id: 0,
          updatedAt: new Date(),
          title: 'Test announcement',
          locationX: 0,
          locationY: 0,
          area: '1,1;1,1;1,1;1,1',
          street: 'Test street',
          buildingNr: 'Test building number',
          apartmentNr: 'Test apartment number',
          thumbnail: 'test.png',
          category: {
            name: 'test',
            icon: 'test',
          },
          isCommentable: true,
          slug: 'test-announcement',
          responsible: 'Test responsible',
        },
      ] as AnnouncementDto[];

      jest
        .spyOn(announcementRepository, 'getAll')
        .mockResolvedValue(announcements);

      const result = await announcementService.getAll(filter);

      expect(result).toEqual(announcements);
      expect(announcementRepository.getAll).toHaveBeenCalledWith(filter);
    });

    it('should use sortPosts if orderBy is specified', async () => {
      const filter = {
        orderBy: 'title',
      } as unknown as GenericFilter;

      const announcements = [
        {
          id: 0,
          updatedAt: new Date(),
          title: 'Test announcement',
          locationX: 0,
          locationY: 0,
          area: '1,1;1,1;1,1;1,1',
          street: 'Test street',
          buildingNr: 'Test building number',
          apartmentNr: 'Test apartment number',
          thumbnail: 'test.png',
          category: {
            name: 'test',
            icon: 'test',
          },
          isCommentable: true,
          slug: 'test-announcement',
          responsible: 'Test responsible',
        },
      ] as AnnouncementDto[];

      jest
        .spyOn(announcementRepository, 'getAll')
        .mockResolvedValue(announcements);

      jest.spyOn(postService, 'sortPosts').mockResolvedValue(announcements);

      const result = await announcementService.getAll(filter);

      expect(result).toEqual(announcements);
      expect(postService.sortPosts).toHaveBeenCalledWith(
        announcements,
        filter,
        'ANNOUNCEMENT',
      );
      expect(announcementRepository.getAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getOne', () => {
    it('should return an announcement', async () => {
      const announcement = {
        id: 0,
        updatedAt: new Date(),
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        area: '1,1;1,1;1,1;1,1',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        thumbnail: 'test.png',
        category: {
          name: 'test',
          icon: 'test',
        },
        isCommentable: true,
        slug: 'test-announcement',
        responsible: 'Test responsible',
      } as AnnouncementDto;

      jest
        .spyOn(announcementRepository, 'getOne')
        .mockResolvedValue(announcement);

      const result = await announcementService.getOne(0);

      expect(result).toEqual(announcement);
      expect(announcementRepository.getOne).toHaveBeenCalledWith(0);
    });

    it('should throw an error if announcement is not found', async () => {
      jest.spyOn(announcementRepository, 'getOne').mockResolvedValue(null);
      expect(announcementService.getOne(0)).rejects.toThrow(SimpleNotFound);
    });
  });

  describe('getOneBySlug', () => {
    it('should return an announcement', async () => {
      const poi = {
        id: 0,
      } as POIDTO;

      const announcement = {
        id: 0,
        updatedAt: new Date(),
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        area: '1,1;1,1;1,1;1,1',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        thumbnail: 'test.png',
        category: {
          name: 'test',
          icon: 'test',
        },
        isCommentable: true,
        slug: 'test-announcement',
        responsible: 'Test responsible',
      } as AnnouncementDto;

      jest
        .spyOn(announcementRepository, 'getOne')
        .mockResolvedValue(announcement);
      jest.spyOn(poiService, 'getOneBySlug').mockResolvedValue(poi);

      const result =
        await announcementService.getOneBySlug('test-announcement');

      expect(result).toEqual(announcement);
      expect(announcementRepository.getOne).toHaveBeenCalledWith(0);
    });

    it('should throw an error if poi is not found', async () => {
      jest.spyOn(poiService, 'getOneBySlug').mockResolvedValue(null);
      expect(
        announcementService.getOneBySlug('test-announcement'),
      ).rejects.toThrow(SimpleNotFound);
    });

    it('should throw an error if announcement is not found', async () => {
      jest.spyOn(announcementRepository, 'getOne').mockResolvedValue(null);
      expect(
        announcementService.getOneBySlug('test-announcement'),
      ).rejects.toThrow(SimpleNotFound);
    });
  });

  describe('update', () => {
    it('should update an announcement', async () => {
      const inputAnnouncement = {
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        responsible: 'Test responsible',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        content: 'Test content',
        thumbnail: 'test.png',
        id: 0,
        slug: 'test-announcement',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UpdateAnnouncementInputDto;

      const announcement = {
        id: 0,
        updatedAt: new Date(),
        ...inputAnnouncement,
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
        category: {
          name: 'test',
          icon: 'test',
        },
        slug: inputAnnouncement.title,
      } as AnnouncementDto;

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

      const poi = {
        id: 0,
        title: inputAnnouncement.title,
        slug: announcement.title,
        locationX: inputAnnouncement.locationX,
        locationY: inputAnnouncement.locationY,
        responsible: inputAnnouncement.responsible,
        street: inputAnnouncement.street,
        buildingNr: inputAnnouncement.buildingNr,
        apartmentNr: inputAnnouncement.apartmentNr,
        area: '1,1;1,1;1,1;1,1',
        isCommentable: true,
        categoryName: 'Test category',
      } as POIDTO;

      jest.spyOn(postService, 'getOne').mockResolvedValue(post);
      jest
        .spyOn(announcementRepository, 'getOne')
        .mockResolvedValue(announcement);
      jest
        .spyOn(filehandlerService, 'handlePatchedFiles')
        .mockResolvedValue(false);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);
      jest.spyOn(poiService, 'update').mockResolvedValue(poi);

      const result = await announcementService.update(
        0,
        inputAnnouncement,
        files,
      );

      expect(poiService.update).toHaveBeenCalled();
      expect(announcementRepository.update).toHaveBeenCalled();
      expect(postService.setThumbnail).toHaveBeenCalledWith(
        post.id,
        thumbnailFile.originalname,
      );
      expect(result).toEqual(announcement.slug);
    });
  });

  describe('delete', () => {
    it('should delete an announcement', async () => {
      const announcement = {
        id: 0,
        updatedAt: new Date(),
        title: 'Test announcement',
        locationX: 0,
        locationY: 0,
        area: '1,1;1,1;1,1;1,1',
        street: 'Test street',
        buildingNr: 'Test building number',
        apartmentNr: 'Test apartment number',
        thumbnail: 'test.png',
        category: {
          name: 'test',
          icon: 'test',
        },
        isCommentable: true,
        slug: 'test-announcement',
        responsible: 'Test responsible',
      } as AnnouncementDto;

      jest
        .spyOn(announcementRepository, 'getOne')
        .mockResolvedValue(announcement);

      const result = await announcementService.delete(0);

      expect(postService.delete).toHaveBeenCalledWith(announcement.id);
      expect(poiService.delete).toHaveBeenCalledWith(announcement.id);
      expect(result.prevSlug).toEqual(announcement.slug);
    });

    it('should throw an error if announcement is not found', async () => {
      jest.spyOn(announcementRepository, 'getOne').mockResolvedValue(null);
      expect(announcementService.delete(0)).rejects.toThrow(SimpleNotFound);
    });
  });
});
