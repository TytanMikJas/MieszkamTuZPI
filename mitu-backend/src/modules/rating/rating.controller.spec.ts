import { Test, TestingModule } from '@nestjs/testing';
import RatingController from './rating.controller';
import RatingService from './rating.service';
import UserInternalDto from '../user/dto/user.internal';
import { RatingType } from './dto/rating-dto';

describe('RatingController', () => {
  let controller: RatingController;
  const testUser: UserInternalDto = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    forceChangePassword: false,
    newsletter_agreement: false,
    password: 'password',
    role: 'USER',
    status: 'ACTIVE',
    avatar: null,
  };
  let ratingService: RatingService;
  beforeEach(async () => {
    const RatingServiceMock = {
      provide: RatingService,
      useValue: {
        findByUserIdAndPostId: jest.fn(),
        createByUserIdAndPostId: jest.fn(),
        toggleByUserIdAndPostId: jest.fn(),
        performVote: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [RatingServiceMock],
    }).compile();

    controller = module.get<RatingController>(RatingController);
    ratingService = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upvote', () => {
    it('should call ratingService.performVote with correct arguments', async () => {
      const postId = 1;
      await controller.upvote(postId, testUser);
      expect(ratingService.performVote).toHaveBeenCalledWith(
        RatingType.UPVOTE,
        RatingType.DOWNVOTE,
        testUser.id,
        postId,
      );
    });
  });

  describe('downvote', () => {
    it('should call ratingService.performVote with correct arguments', async () => {
      const postId = 1;
      await controller.downvote(postId, testUser);
      expect(ratingService.performVote).toHaveBeenCalledWith(
        RatingType.DOWNVOTE,
        RatingType.UPVOTE,
        testUser.id,
        postId,
      );
    });
  });
});
