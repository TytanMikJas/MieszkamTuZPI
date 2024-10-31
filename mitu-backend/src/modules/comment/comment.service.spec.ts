import { PostService } from '../post/post.service';
import { FilehandlerService } from '../filehandler/filehandler.service';
import { CommentRepository } from './comment.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { $Enums, PostType } from '@prisma/client';
import PostDto from '../post/dto/post-dto.internal';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import UserInternalDto from '../user/dto/user.internal';
import { CommentService } from './comment.service';
import CommentDto from './dto/comment-dto.output';
import { CreateCommentInputDto } from './dto/create-comment-dto.input';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: CommentRepository;
  let postService: PostService;
  let filehandlerService: FilehandlerService;

  const mockCommentRepository = () => ({
    getAll: jest.fn(),
    getByParent: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
  });

  const mockPostService = () => ({
    getOne: jest.fn(),
    create: jest.fn(),
    incrementComentCount: jest.fn(),
    setContent: jest.fn(),
    setThumbnail: jest.fn(),
    decrementComentCount: jest.fn(),
    delete: jest.fn(),
  });

  const mockFilehandlerService = () => ({
    saveAllPostFiles: jest.fn(),
    canAssignThumbnail: jest.fn(),
    handlePatchedFiles: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository(),
        },
        {
          provide: PostService,
          useValue: mockPostService(),
        },
        {
          provide: FilehandlerService,
          useValue: mockFilehandlerService(),
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    postService = module.get<PostService>(PostService);
    filehandlerService = module.get<FilehandlerService>(FilehandlerService);
  });

  describe('getAll', () => {
    it('should return all comments', async () => {
      const comment = {
        id: 0,
        parentNodeId: 0,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;
      const result = [comment];

      jest.spyOn(commentRepository, 'getAll').mockResolvedValue(result);
      const comments = await commentService.getAll(null);
      expect(comments).toEqual(result);
    });
  });

  describe('getByParent', () => {
    it('should return comments by parent id', async () => {
      const comment = {
        id: 0,
        parentNodeId: 0,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;
      const result = [comment];

      jest.spyOn(commentRepository, 'getByParent').mockResolvedValue(result);
      const comments = await commentService.getByParent(0, null, null);
      expect(comments).toEqual(result);
    });
  });

  describe('create', () => {
    const body: CreateCommentInputDto = {
      content: 'test',
      parentNodeId: 0,
    };

    it('should create a unapproved comment', async () => {
      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;
      const userId = 0;
      const userRole = $Enums.UserRole.USER;

      const post = {
        id: 0,
        postType: PostType.INVESTMENT,
      } as PostDto;

      const commentPost = {
        id: 1,
        postType: PostType.COMMENT,
      } as PostDto;

      const comment = {
        id: 0,
        parentNodeId: 0,
        status: $Enums.CommentStatus.PENDING,
      } as CommentDto;

      jest.spyOn(postService, 'getOne').mockResolvedValue(post);
      jest.spyOn(postService, 'create').mockResolvedValue(commentPost);
      jest.spyOn(commentRepository, 'create').mockResolvedValue(comment);

      const result = await commentService.create(body, files, userId, userRole);
      expect(result.id).toEqual(comment.id);
      expect(result.status).toEqual(comment.status);
      expect(result.parentNodeId).toEqual(comment.parentNodeId);
      expect(postService.incrementComentCount).not.toHaveBeenCalled();
    });

    it('should create a approved comment', async () => {
      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;
      const userId = 0;
      const userRole = $Enums.UserRole.OFFICIAL;

      const post = {
        id: 0,
        postType: PostType.INVESTMENT,
      } as PostDto;

      const commentPost = {
        id: 1,
        postType: PostType.COMMENT,
      } as PostDto;

      const comment = {
        id: 0,
        parentNodeId: 0,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      jest.spyOn(postService, 'getOne').mockResolvedValue(post);
      jest.spyOn(postService, 'create').mockResolvedValue(commentPost);
      jest.spyOn(commentRepository, 'create').mockResolvedValue(comment);

      const result = await commentService.create(body, files, userId, userRole);
      expect(result.id).toEqual(comment.id);
      expect(result.status).toEqual(comment.status);
      expect(result.parentNodeId).toEqual(comment.parentNodeId);
      expect(postService.incrementComentCount).toHaveBeenCalled();
    });

    it('should throw error because of non existent parent', async () => {
      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;
      const userId = 0;
      const userRole = $Enums.UserRole.OFFICIAL;

      jest.spyOn(postService, 'getOne').mockResolvedValue(null);

      await expect(
        commentService.create(body, files, userId, userRole),
      ).rejects.toThrow();
    });

    it('should throw error because of double nested comment', async () => {
      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;
      const userId = 0;
      const userRole = $Enums.UserRole.OFFICIAL;

      const post = {
        id: 0,
        postType: PostType.COMMENT,
      } as PostDto;

      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await expect(
        commentService.create(body, files, userId, userRole),
      ).rejects.toThrow();
    });

    it('should throw error because of unapproved parent comment', async () => {
      const files = {
        IMAGE: [],
        TD: [],
        DOC: [],
      } as PostFilesGrouped;
      const userId = 0;
      const userRole = $Enums.UserRole.OFFICIAL;

      const post = {
        id: 0,
        postType: PostType.INVESTMENT,
      } as PostDto;

      const parentComment = {
        id: 1,
        parentNodeId: 0,
        status: $Enums.CommentStatus.PENDING,
      } as CommentDto;

      jest.spyOn(postService, 'getOne').mockResolvedValue(post);
      jest.spyOn(commentRepository, 'getById').mockResolvedValue(parentComment);

      await expect(
        commentService.create(body, files, userId, userRole),
      ).rejects.toThrow();
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const comment = {
        id: 0,
        status: $Enums.CommentStatus.PENDING,
      } as CommentDto;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);

      await commentService.updateStatus(0, $Enums.CommentStatus.APPROVED);

      expect(postService.incrementComentCount).toHaveBeenCalled();
      expect(commentRepository.updateStatus).toHaveBeenCalled();
    });

    it('should throw when requested comment is non existent', async () => {
      jest.spyOn(commentRepository, 'getById').mockResolvedValue(null);

      await expect(
        commentService.updateStatus(0, $Enums.CommentStatus.APPROVED),
      ).rejects.toThrow();
    });
  });

  describe('updateContent', () => {
    it('should update content and change status', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.USER,
      } as UserInternalDto;

      const post = {
        id: 0,
        createdById: user.id,
      } as PostDto;

      const content = 'test';

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      const result = await commentService.updateContent(
        comment.id,
        content,
        user,
      );

      expect(commentRepository.updateStatus).toHaveBeenCalled();
      expect(postService.setContent).toHaveBeenCalled();
      expect(result.content).toEqual(content);
    });

    it('should update content and not change status', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.OFFICIAL,
      } as UserInternalDto;

      const post = {
        id: 0,
        createdById: user.id,
      } as PostDto;

      const content = 'test';

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      const result = await commentService.updateContent(
        comment.id,
        content,
        user,
      );

      expect(commentRepository.updateStatus).not.toHaveBeenCalled();
      expect(postService.setContent).toHaveBeenCalled();
      expect(result.content).toEqual(content);
    });

    it('should throw when user is not the creator of the comment', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.OFFICIAL,
      } as UserInternalDto;

      const post = {
        id: 0,
        createdById: 12,
      } as PostDto;

      const content = 'test';

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await expect(
        commentService.updateContent(comment.id, content, user),
      ).rejects.toThrow();
    });

    it('should throw when post is null', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.OFFICIAL,
      } as UserInternalDto;

      const content = 'test';

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(null);

      await expect(
        commentService.updateContent(comment.id, content, user),
      ).rejects.toThrow();
    });

    it('should throw when comment is null', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.OFFICIAL,
      } as UserInternalDto;

      const content = 'test';

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(null);

      await expect(
        commentService.updateContent(comment.id, content, user),
      ).rejects.toThrow();
    });
  });

  describe('updateFiles', () => {
    it('should update files and thumbnail', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const thumbnailImage = {
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const files = {
        IMAGE: [thumbnailImage],
        TD: [] as Array<Express.Multer.File>,
        DOC: [] as Array<Express.Multer.File>,
      } as PostFilesGrouped;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest
        .spyOn(filehandlerService, 'handlePatchedFiles')
        .mockResolvedValue(false);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(true);

      const result = await commentService.updateFiles(0, files, null);

      expect(postService.setThumbnail).toHaveBeenCalled();
      expect(result).toEqual(thumbnailImage.originalname);
    });

    it('should update files and not thumbnail', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const files = {
        IMAGE: [] as Array<Express.Multer.File>,
        TD: [] as Array<Express.Multer.File>,
        DOC: [] as Array<Express.Multer.File>,
      } as PostFilesGrouped;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest
        .spyOn(filehandlerService, 'handlePatchedFiles')
        .mockResolvedValue(false);
      jest
        .spyOn(filehandlerService, 'canAssignThumbnail')
        .mockResolvedValue(false);

      const result = await commentService.updateFiles(0, files, null);

      expect(postService.setThumbnail).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });

  describe('delete', () => {
    it('should delete comment', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const post = {
        id: 0,
        postType: PostType.COMMENT,
      } as PostDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.OFFICIAL,
      } as UserInternalDto;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await commentService.delete(0, user);

      expect(postService.decrementComentCount).toHaveBeenCalled();
      expect(postService.delete).toHaveBeenCalled();
    });

    it('should throw when comment is null', async () => {
      jest.spyOn(commentRepository, 'getById').mockResolvedValue(null);
      await expect(commentService.delete(0, null)).rejects.toThrow();
    });

    it('should throw when post is null', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(null);

      await expect(commentService.delete(0, null)).rejects.toThrow();
    });

    it('should throw when user is not the creator of the comment', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const post = {
        id: 0,
        createdById: 12,
      } as PostDto;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await expect(commentService.delete(0, null)).rejects.toThrow();
    });

    it('should throw when user is not the official', async () => {
      const comment = {
        id: 0,
        parentNodeId: 999,
        status: $Enums.CommentStatus.APPROVED,
      } as CommentDto;

      const post = {
        id: 0,
        createdById: 999,
      } as PostDto;

      const user = {
        id: 0,
        role: $Enums.UserRole.USER,
      } as UserInternalDto;

      jest.spyOn(commentRepository, 'getById').mockResolvedValue(comment);
      jest.spyOn(postService, 'getOne').mockResolvedValue(post);

      await expect(commentService.delete(0, user)).rejects.toThrow();
    });
  });
});
