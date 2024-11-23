import { Test, TestingModule } from '@nestjs/testing';
import UserService from './user.service';
import UserRepository from './user.repository';
import { Provider } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail-sender.service';
import CreateUserInputDto from './dto/create-user.input';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import UpdateUserEmailInputDto from './dto/update-user-email.input';
import DeleteAccountInputDto from './dto/delete-account-input-dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let authService: AuthService;
  beforeAll(async () => {
    const mockUserRepositoryProvider: Provider<Partial<UserRepository>> = {
      provide: UserRepository,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(UserRepository.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const mockAuthServiceProvider: Provider<Partial<AuthService>> = {
      provide: AuthService,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(AuthService.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const mockMailServiceProvider: Provider<Partial<MailService>> = {
      provide: MailService,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(MailService.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        mockUserRepositoryProvider,
        mockAuthServiceProvider,
        mockMailServiceProvider,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    authService = module.get<AuthService>(AuthService);
  });

  const mockCreateUserInputDto: CreateUserInputDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    forceChangePassword: false,
    newsletter_agreement: false,
    password: 'password',
  };

  const mockDbUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    forceChangePassword: false,
    newsletter_agreement: false,
    password: bcrypt.hashSync('password', 10),
    role: UserRole.USER,
    status: UserStatus.EMAIL_NOT_CONFIRMED,
    avatar: null,
    id: 1,
  };

  describe('create', () => {
    it('should create a new user and send confirmation', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(authService, 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockDbUser);
      jest.spyOn(authService, 'createConfirmation');
      await userService.create(mockCreateUserInputDto);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserInputDto.email,
      );
      expect(authService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserInputDto.password,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        firstName: mockCreateUserInputDto.firstName,
        lastName: mockCreateUserInputDto.lastName,
        email: mockCreateUserInputDto.email,
        forceChangePassword: mockCreateUserInputDto.forceChangePassword,
        newsletter_agreement: mockCreateUserInputDto.newsletter_agreement,
        password: 'hashedPassword',
        role: 'USER',
        status: 'EMAIL_NOT_CONFIRMED',
      });
    });
    it('should throw an error if the email already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockDbUser);
      await expect(
        userService.create(mockCreateUserInputDto),
      ).rejects.toThrow();
    });
  });

  describe('adminCreate', () => {
    it('should create a new admin', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(authService, 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockDbUser);
      await userService.adminCreate(mockCreateUserInputDto);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserInputDto.email,
      );
      expect(authService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserInputDto.password,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        firstName: mockCreateUserInputDto.firstName,
        lastName: mockCreateUserInputDto.lastName,
        email: mockCreateUserInputDto.email,
        forceChangePassword: mockCreateUserInputDto.forceChangePassword,
        newsletter_agreement: mockCreateUserInputDto.newsletter_agreement,
        password: 'hashedPassword',
        role: 'USER',
        status: 'ACTIVE',
      });
    });
    it('should throw an error if the email already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockDbUser);
      await expect(
        userService.adminCreate(mockCreateUserInputDto),
      ).rejects.toThrow();
    });
  });

  describe('updateInfo', () => {
    it('should update user info', async () => {
      jest.spyOn(userRepository, 'updateInfo');
      await userService.updateInfo(1, mockCreateUserInputDto);
      expect(userRepository.updateInfo).toHaveBeenCalledWith(
        1,
        mockCreateUserInputDto,
      );
    });
  });

  /* 
  async updatePassword(
    id: PRISMA_ID,
    body: UpdateUserPasswordInputDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);

    const passwordsMatch = await this.comparePasswords(
      body.oldPassword,
      user.password,
    );

    if (!passwordsMatch) {
      throw new InvalidInputException(
        'Nieprawidłowe hasło',
        HttpStatus.CONFLICT,
        RenderType.form,
      );
    }

    const hashedPassword = await this.authService.hashPassword(
      body.newPassword,
    );
    await this.userRepository.updatePassword(id, hashedPassword);
  }
  
  */

  describe('updatePassword', () => {
    it('should update user password', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      jest
        .spyOn(authService, 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'updatePassword');
      await userService.updatePassword(1, {
        oldPassword: 'password',
        newPassword: 'newPassword',
      });
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        mockDbUser.id,
        'hashedPassword',
      );
    });

    it('should throw an error if the old password is incorrect', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      await expect(
        userService.updatePassword(1, {
          oldPassword: 'wrongPassword',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow();
    });
  });

  const mockUpdateUserEmailInputDto: UpdateUserEmailInputDto = {
    email: 'johndoe2@gmail.com',
    password: 'password',
  };

  describe('updateEmail', () => {
    it('should update user email', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      jest.spyOn(userRepository, 'updateEmail');
      await userService.updateEmail(1, mockUpdateUserEmailInputDto);
      expect(userRepository.updateEmail).toHaveBeenCalledWith(
        1,
        mockUpdateUserEmailInputDto.email,
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      await expect(
        userService.updateEmail(1, {
          ...mockUpdateUserEmailInputDto,
          password: 'bad password:(',
        }),
      ).rejects.toThrow();
    });
  });

  const mockDeleteAccountInputDto: DeleteAccountInputDto = {
    password: 'password',
  };

  describe('deteleUser', () => {
    it('should delete user', async () => {
      jest.spyOn(userRepository, 'deleteUser');
      await userService.deteleUser(1, mockDeleteAccountInputDto);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the password is incorrect', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      await expect(
        userService.deteleUser(1, {
          ...mockDeleteAccountInputDto,
          password: 'bad password:(',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockDbUser);
      await userService.findByEmail(mockDbUser.email);
    });
  });

  describe('setForceResetPassword', () => {
    it('should set force reset password', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      jest.spyOn(userRepository, 'setForceResetPassword');
      await userService.setForceResetPassword(1, true);
      expect(userRepository.setForceResetPassword).toHaveBeenCalledWith(
        1,
        true,
      );
    });

    it('should throw an error if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
      await expect(
        userService.setForceResetPassword(1, true),
      ).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockDbUser);
      await userService.findById(1);
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
      await expect(userService.findById(1)).resolves.toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userRepository, 'getAll').mockResolvedValue([mockDbUser]);
      const res = await userService.getAll({ where: {}, order: {} });
      expect(res).toEqual([mockDbUser]);
    });
  });

  /* describe('getAllWithNewsletterAgreement', () => {});

  describe('assignRole', () => {});

  describe('forceUpdatePassword', () => {});

  describe('assignStatus', () => {});

  describe('updateForgottenPassword', () => {}); */
});
