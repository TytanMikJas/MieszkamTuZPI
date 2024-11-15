import { Test, TestingModule } from '@nestjs/testing';
import RatingRepository from './rating.repository';
import RatingService from './rating.service';
import { PostVote, PostVoteType } from '@prisma/client';
import RatingDto, { RatingType } from './dto/rating-dto';
import { PostService } from '../post/post.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PoiService } from '../poi/poi.service';

describe('RatingService', () => {
  let ratingService: RatingService;
  let ratingRepository: RatingRepository;
  let postService: PostService;
  const userId = 1;
  const postId = 1;
  beforeEach(async () => {
    const RatingRepositoryMock = {
      provide: RatingRepository,
      useValue: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findByUserIdAndPostId: jest.fn(),
        findByUserIdAndPostIds: jest.fn(),
        deleteByUserIdAndPostId: jest.fn(),
        createByUserIdAndPostId: jest.fn(),
        getVotesCountByPostId: jest.fn(),
      },
    };

    const mockPostService: Partial<PostService> = {
      create: jest.fn(),
      getOne: jest.fn(),
      setContent: jest.fn(),
      incrementComentCount: jest.fn(),
      decrementComentCount: jest.fn(),
      decrementDownvoteCount: jest.fn(),
      incrementDownvoteCount: jest.fn(),
      decrementUpvoteCount: jest.fn(),
      incrementUpvoteCount: jest.fn(),
    };

    const PoiServiceMock = {
      provide: PoiService,
      useValue: {
        getOneById: jest.fn(),
      },
    };

    const PostServiceMock = {
      provide: PostService,
      useValue: mockPostService,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        RatingRepositoryMock,
        PostServiceMock,
        PoiServiceMock,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    ratingService = module.get<RatingService>(RatingService);
    ratingRepository = module.get<RatingRepository>(RatingRepository);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(ratingService).toBeDefined();
  });

  describe('performVote', () => {
    const mockDeletedUpvote: PostVote = {
      userId,
      postId,
      type: PostVoteType.UPVOTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockDeletedDownvote: PostVote = {
      userId,
      postId,
      type: PostVoteType.DOWNVOTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return novote and delete vote when upvoted upvote', async () => {
      const desiredVote = RatingType.UPVOTE;
      const contrVote = RatingType.DOWNVOTE;
      const existingRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.UPVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(existingRating);
      jest
        .spyOn(ratingRepository, 'deleteByUserIdAndPostId')
        .mockResolvedValue(mockDeletedUpvote);
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.deleteByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.NOVOTE });
      expect(postService.decrementUpvoteCount).toHaveBeenCalledWith(postId);
    });

    it('should return upvote and create vote when upvoted novote', async () => {
      const desiredVote = RatingType.UPVOTE;
      const contrVote = RatingType.DOWNVOTE;
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(null);
      jest
        .spyOn(ratingRepository, 'createByUserIdAndPostId')
        .mockResolvedValue({
          userId,
          postId,
          type: PostVoteType.UPVOTE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.createByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
        PostVoteType.UPVOTE,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.UPVOTE });
      expect(postService.incrementUpvoteCount).toHaveBeenCalledWith(postId);
    });

    it('should return downvote and create vote when downvoted novote', async () => {
      const desiredVote = RatingType.DOWNVOTE;
      const contrVote = RatingType.UPVOTE;
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(null);
      jest
        .spyOn(ratingRepository, 'createByUserIdAndPostId')
        .mockResolvedValue({
          userId,
          postId,
          type: PostVoteType.DOWNVOTE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.createByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
        PostVoteType.DOWNVOTE,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.DOWNVOTE });
      expect(postService.incrementDownvoteCount).toHaveBeenCalledWith(postId);
    });

    it('should return novote and delete vote when downvoted downvote', async () => {
      const desiredVote = RatingType.DOWNVOTE;
      const contrVote = RatingType.UPVOTE;
      const existingRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.DOWNVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(existingRating);
      jest
        .spyOn(ratingRepository, 'deleteByUserIdAndPostId')
        .mockResolvedValue(mockDeletedDownvote);
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.deleteByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.NOVOTE });
      expect(postService.decrementDownvoteCount).toHaveBeenCalledWith;
    });

    it('should return downvote and delete vote and create vode when downvoted upvote', async () => {
      const desiredVote = RatingType.DOWNVOTE;
      const contrVote = RatingType.UPVOTE;
      const existingRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.UPVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.DOWNVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(existingRating);
      jest
        .spyOn(ratingRepository, 'createByUserIdAndPostId')
        .mockResolvedValue(newRating);
      jest
        .spyOn(ratingRepository, 'deleteByUserIdAndPostId')
        .mockResolvedValue(mockDeletedUpvote);
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.deleteByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.DOWNVOTE });
      expect(postService.decrementUpvoteCount).toHaveBeenCalledWith(postId);
      expect(postService.incrementDownvoteCount).toHaveBeenCalledWith(postId);
    });

    it('should return upvote and delete vote and create vote when upvoted downvote', async () => {
      const desiredVote = RatingType.UPVOTE;
      const contrVote = RatingType.DOWNVOTE;
      const existingRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.DOWNVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newRating: PostVote = {
        userId,
        postId,
        type: PostVoteType.UPVOTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostId')
        .mockResolvedValue(existingRating);
      jest
        .spyOn(ratingRepository, 'createByUserIdAndPostId')
        .mockResolvedValue(newRating);
      jest
        .spyOn(ratingRepository, 'deleteByUserIdAndPostId')
        .mockResolvedValue(mockDeletedDownvote);
      const ratingDto: RatingDto = await ratingService.performVote(
        desiredVote,
        contrVote,
        userId,
        postId,
      );
      expect(ratingRepository.deleteByUserIdAndPostId).toHaveBeenCalledWith(
        userId,
        postId,
      );
      expect(ratingDto).toEqual({ postId, type: RatingType.UPVOTE });
      expect(postService.decrementDownvoteCount).toHaveBeenCalledWith(postId);
      expect(postService.incrementUpvoteCount).toHaveBeenCalledWith(postId);
    });
  });

  describe('getVotesCountByPostId', () => {
    it('should return upvote and downvote count', async () => {
      const postId = 1;
      const upvoteCount = 1;
      const downvoteCount = 2;
      jest
        .spyOn(ratingRepository, 'getVotesCountByPostId')
        .mockResolvedValue({ postId, upvoteCount, downvoteCount });
      const postVoteCountInternalDto =
        await ratingService.getVotesCountByPostId(postId);
      expect(postVoteCountInternalDto).toEqual({
        postId,
        upvoteCount,
        downvoteCount,
      });
    });
  });

  describe('getVotesByUserIdAndPostIds', () => {
    it('should return votes by user id and post ids', async () => {
      const postIds = [1, 2];
      const userId = 1;
      const postVotes: PostVote[] = [
        {
          userId,
          postId: 1,
          type: PostVoteType.UPVOTE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId,
          postId: 2,
          type: PostVoteType.DOWNVOTE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostIds')
        .mockResolvedValue(postVotes);
      const postVotesResult = await ratingService.getVotesByUserIdAndPostIds(
        postIds,
        userId,
      );
      expect(postVotesResult).toEqual(postVotes);
    });

    it('should return empty array when no votes found', async () => {
      const postIds = [1, 2];
      const userId = 1;
      jest
        .spyOn(ratingRepository, 'findByUserIdAndPostIds')
        .mockResolvedValue([]);
      const postVotesResult = await ratingService.getVotesByUserIdAndPostIds(
        postIds,
        userId,
      );
      expect(postVotesResult).toEqual([]);
    });
  });
});
