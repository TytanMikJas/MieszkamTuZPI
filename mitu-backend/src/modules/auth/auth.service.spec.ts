import { Test, TestingModule } from '@nestjs/testing';
import UserInternalDto from '../user/dto/user.internal';
import { AuthService } from './auth.service';
import { Provider } from '@nestjs/common';
import UserService from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import AuthRepository from './auth.repository';
import bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';
import { SimpleForbidden } from 'src/exceptions/simple-forbidden.exception';
import JwtException from './exceptions/jwt-token.exception';
import ForceChangePasswordInputDto from './dto/force-change-password.input';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import ConfirmRegistrationUserAlreadyVerified from './exceptions/confirm-registration-user-already-verified';
import { MailService } from '../mail/mail-sender.service';
describe('authService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let authRepository: AuthRepository;
  const activeUser: UserInternalDto = {
    id: 1,
    password: bcrypt.hashSync('password', 10),
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    newsletter_agreement: true,
    role: 'USER',
    status: 'ACTIVE',
    forceChangePassword: false,
  };

  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  beforeAll(async () => {
    const mockUserServiceProvider: Provider<Partial<UserService>> = {
      provide: UserService,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(UserService.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const mockJwtServiceProvider: Provider<Partial<JwtService>> = {
      provide: JwtService,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(JwtService.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const mockConfigServiceProvider: Provider<Partial<ConfigService>> = {
      provide: ConfigService,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(ConfigService.prototype)
          .filter((method) => method !== 'constructor') // Exclude the constructor
          .map((method) => [method, jest.fn()]), // Map each method to a jest.fn() mock
      ),
    };

    const mockAuthRepositoryProvider: Provider<Partial<AuthRepository>> = {
      provide: AuthRepository,
      useValue: Object.fromEntries(
        Object.getOwnPropertyNames(AuthRepository.prototype)
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
        AuthService,
        mockUserServiceProvider,
        mockJwtServiceProvider,
        mockConfigServiceProvider,
        mockAuthRepositoryProvider,
        mockMailServiceProvider,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return SignInOutputDTO when user is active', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(activeUser);
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementationOnce(() => mockAccessToken)
        .mockImplementationOnce(() => mockRefreshToken);
      const res = await authService.signIn(activeUser);
      expect(res).toBeDefined();
      expect(res.accessToken).toEqual(mockAccessToken);
      expect(res.refreshToken).toEqual(mockRefreshToken);
    });

    it('should throw SimpleForbidden when user email not confirmed', async () => {
      const inactiveUser = {
        ...activeUser,
        status: UserStatus.EMAIL_NOT_CONFIRMED,
      };
      jest.spyOn(userService, 'findById').mockResolvedValue(inactiveUser);
      await expect(authService.signIn(inactiveUser)).rejects.toThrow(
        SimpleForbidden,
      );
    });

    it('should throw SimpleNotFound when user is not found', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockImplementation(() => Promise.resolve(null));
      await expect(authService.signIn(activeUser)).rejects.toThrow(
        JwtException,
      );
    });

    it('should throw SimpleForbidden when user is deleted', async () => {
      const user = { ...activeUser, status: UserStatus.DELETED };
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      await expect(authService.signIn(user)).rejects.toThrow(SimpleForbidden);
    });

    it('should throw SimpleForbidden when user is shadow banned', async () => {
      const user = { ...activeUser, status: UserStatus.SHADOW_BANNED };
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      await expect(authService.signIn(user)).rejects.toThrow(SimpleForbidden);
    });
  });

  describe('forceChangePassword', () => {
    const correctPasswordForceChangePassword: ForceChangePasswordInputDto = {
      oldPassword: 'password',
      password: 'password!',
    };
    const activeUserWithForceChangePassword = {
      ...activeUser,
      forceChangePassword: true,
    };

    it('should force update password', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockResolvedValue(activeUserWithForceChangePassword);
      jest.spyOn(userService, 'updatePassword').mockResolvedValue();
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementationOnce(() => mockAccessToken)
        .mockImplementationOnce(() => mockRefreshToken);

      await authService.forceChangePassword(
        activeUserWithForceChangePassword,
        correctPasswordForceChangePassword,
      );
      expect(userService.forceUpdatePassword).toHaveBeenCalledWith(
        activeUserWithForceChangePassword.id,
        correctPasswordForceChangePassword.password,
      );
      expect(userService.setForceResetPassword).toHaveBeenCalledWith(
        activeUserWithForceChangePassword.id,
        false,
      );
    });

    it('should throw SimpleBadRequest when old password is incorrect', async () => {
      const incorrectPasswordForceChangePassword: ForceChangePasswordInputDto =
        {
          oldPassword: 'wrongPassword',
          password: 'password!',
        };
      jest
        .spyOn(userService, 'findById')
        .mockResolvedValue(activeUserWithForceChangePassword);
      await expect(
        authService.forceChangePassword(
          activeUserWithForceChangePassword,
          incorrectPasswordForceChangePassword,
        ),
      ).rejects.toThrow(SimpleBadRequest);
    });

    it('should throw SimpleBadRequest when user is not forced to change password', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(activeUser);
      await expect(
        authService.forceChangePassword(
          activeUser,
          correctPasswordForceChangePassword,
        ),
      ).rejects.toThrow(SimpleBadRequest);
    });
  });

  describe('validateUser', () => {
    const correctEmail = activeUser.email;
    const correctPassword = 'password';

    it('should return user when user exists and passwords match', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(activeUser);
      const res = await authService.validateUser(correctEmail, correctPassword);
      expect(res).toEqual(activeUser);
    });

    it('should return null when user does not exist', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      const res = await authService.validateUser(correctEmail, correctPassword);
      expect(res).toBeNull();
    });

    it('should return null when passwords do not match', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(activeUser);
      const res = await authService.validateUser(correctEmail, 'wrongPassword');
      expect(res).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const password = 'password';
      const hashedPassword = await authService.hashPassword(password);
      expect(bcrypt.compareSync(password, hashedPassword)).toBeTruthy();
    });
  });

  describe('generateAccessToken', () => {
    it('should return access token', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      const res = await authService.generateAccessToken(activeUser);
      expect(res).toEqual(mockAccessToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should return refresh token', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockRefreshToken);
      const res = await authService.generateRefreshToken(activeUser);
      expect(res).toEqual(mockRefreshToken);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return true when token is valid', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(activeUser);
      jest
        .spyOn(authRepository, 'getRefreshToken')
        .mockResolvedValue(mockRefreshToken);
      const res = await authService.validateRefreshToken(
        activeUser.id,
        mockRefreshToken,
      );
      expect(res).toBeTruthy();
    });

    it('should return false when token is invalid', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(activeUser);
      jest.spyOn(authRepository, 'getRefreshToken').mockResolvedValue(null);
      const res = await authService.validateRefreshToken(
        activeUser.id,
        mockRefreshToken,
      );
      expect(res).toBeFalsy();
    });

    it('should throw JWT exception when user is not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      await expect(
        authService.validateRefreshToken(activeUser.id, mockRefreshToken),
      ).rejects.toThrow(JwtException);
    });
  });

  describe('createConfirmation', () => {
    it('should create confirmation token', async () => {
      const notConfirmedUser = {
        ...activeUser,
        status: UserStatus.EMAIL_NOT_CONFIRMED,
      };
      jest
        .spyOn(authRepository, 'upsertRegistrationConfirmation')
        .mockResolvedValue();
      await authService.createConfirmation(notConfirmedUser);
    });

    it('should create confirmation token', async () => {
      const confirmedUser = { ...activeUser, status: UserStatus.ACTIVE };
      jest
        .spyOn(authRepository, 'upsertRegistrationConfirmation')
        .mockResolvedValue();
      expect(authService.createConfirmation(confirmedUser)).rejects.toThrow(
        ConfirmRegistrationUserAlreadyVerified,
      );
    });
  });

  describe('createChangePasswordToken', () => {
    it('should create change password token', async () => {
      jest
        .spyOn(authRepository, 'upsertChangePasswordToken')
        .mockResolvedValue();
      const res = await authService.createChangePasswordToken(activeUser);
      expect(res).toBeDefined();
    });
  });
});
