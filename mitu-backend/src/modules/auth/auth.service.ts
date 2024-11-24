import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserService from '../user/user.service';
import UserInternalDto from '../user/dto/user.internal';
import AccessTokenPayloadDto from './dto/access-token-payload';
import SignInOutputDto from './dto/sign-in.output';
import JwtException from './exceptions/jwt-token.exception';
import AuthRepository from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import {
  ERROR_EMAIL_NOT_CONFIRMED,
  ERROR_PSWD_INVALID,
  ERROR_PSWD_RESET_NOT_PERMITED,
  ERROR_USER_DELETED,
  ERROR_USER_NOT_FOUND,
  JWT_USER_NOT_FOUND_MESSAGE,
} from 'src/strings';
import ForceChangePasswordInputDto from './dto/force-change-password.input';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { UserStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import ConfirmRegistrationUserNotFound from './exceptions/confirm-registration-user-not-found';
import ConfirmRegistrationUserAlreadyVerified from './exceptions/confirm-registration-user-already-verified';
import ChangeForgottenPasswordInputDto from './dto/change-forgotten-password-dto.input';
import { SimpleForbidden } from 'src/exceptions/simple-forbidden.exception';
import { MailService } from '../mail/mail-sender.service';
export const saltRounds = 10;

/**
 * Auth service
 * @export
 * @class AuthService
 * @param {UserService} userService
 * @param {AuthRepository} authRepository
 * @param {JwtService} jwtService
 * @param {ConfigService} configService
 * @constructor
 * @method {signUp}
 * @method {signIn}
 * @method {refreshToken}
 * @method {me}
 * @method {changePassword}
 * @method {confirmRegistration}
 * @method {createForgotPasswordToken}
 * @method {changeForgottenPassword}
 * @method {validateForgotPasswordToken}
 * @method {validateUser}
 * @method {hashPassword}
 * @method {comparePassword}
 */
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  /**
   * Creates an instance of AuthService.
   * @param userService userService
   * @param authRepository authRepository
   * @param jwtService jwtService
   * @param configService configService
   */
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.logger = new Logger(AuthService.name);
    this.apiPublicUrl = configService.get<string>('API_PUBLIC_URL');
    this.frontendPublicUrl = configService.get<string>('FRONTEND_PUBLIC_URL');
  }
  private apiPublicUrl: string;
  private frontendPublicUrl: string;

  /**
   * Sign in
   * this method assumes, that user was already validated by Passport's LocalStrategy
   * @param user user
   * @returns {Promise<SignInOutputDto>}
   */
  async signIn(user: UserInternalDto): Promise<SignInOutputDto> {
    await this.validateAccountStatus(user.status);
    const token = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  /**
   * Sign up
   * @param user user
   */
  async forceChangePassword(
    user: UserInternalDto,
    body: ForceChangePasswordInputDto,
  ) {
    const _u = await this.userService.findById(user.id);
    if (!_u) {
      throw new SimpleNotFound(ERROR_USER_NOT_FOUND);
    }

    if (_u.forceChangePassword === false) {
      throw new SimpleBadRequest(ERROR_PSWD_RESET_NOT_PERMITED);
    }

    if (!(await this.comparePassword(body.oldPassword, user.password))) {
      throw new SimpleBadRequest(ERROR_PSWD_INVALID);
    }

    await this.userService.forceUpdatePassword(user.id, body.password);
    await this.userService.setForceResetPassword(user.id, false);
  }

  /**
   * Sign up
   * @param user user
   * @returns {Promise<SignInOutputDto>}
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInternalDto | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordMatching = await this.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      return null;
    }
    return user;
  }

  /**
   * Hash password
   * @param plaintextPassword plaintextPassword
   * @returns {Promise<string>}
   */
  async hashPassword(plaintextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);
    return hash;
  }

  /**
   * Compare password
   * @param plaintextPassword plaintextPassword
   * @param hashedPassword hashedPassword
   * @returns {Promise<boolean>}
   */
  private async comparePassword(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(plaintextPassword, hashedPassword);
    return result;
  }

  /**
   * Generate access token
   * @param user user
   * @returns {Promise<string>}
   */
  async generateAccessToken(user: UserInternalDto): Promise<string> {
    const payload: AccessTokenPayloadDto = { userId: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '2h' });
    return token;
  }

  /**
   * Generate refresh token
   * @param user user
   * @returns {Promise<string>}
   */
  async generateRefreshToken(user: UserInternalDto): Promise<string> {
    const payload: AccessTokenPayloadDto = { userId: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.updateRefreshToken(user.id, token);
    return token;
  }

  /**
   * Refresh token
   * @param refreshToken refreshToken
   * @returns {Promise<SignInOutputDto>}
   */
  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new JwtException(JWT_USER_NOT_FOUND_MESSAGE(userId.toString()));
    }
    await this.authRepository.updateRefreshToken(userId, refreshToken);
  }

  /**
   * Refresh token
   * @param refreshToken refreshToken
   * @returns {Promise<SignInOutputDto>}
   */
  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new JwtException(JWT_USER_NOT_FOUND_MESSAGE(userId.toString()));
    }
    const userRefreshToken = await this.authRepository.getRefreshToken(userId);
    return userRefreshToken === refreshToken;
  }

  /**
   * Me
   * @param userId userId
   * @returns {Promise<UserInternalDto>}
   */
  async validateAccountStatus(status: UserStatus) {
    switch (status) {
      case UserStatus.ACTIVE: {
        return;
      }
      case UserStatus.BANNED: {
        throw new SimpleForbidden(ERROR_USER_DELETED);
      }
      case UserStatus.DELETED: {
        throw new SimpleForbidden(ERROR_USER_DELETED);
      }
      case UserStatus.EMAIL_NOT_CONFIRMED: {
        throw new SimpleForbidden(ERROR_EMAIL_NOT_CONFIRMED);
      }
      case UserStatus.SHADOW_BANNED: {
        throw new SimpleForbidden(ERROR_USER_DELETED);
      }
    }
  }

  /**
   * Me
   * @param userId userId
   * @returns {Promise<UserInternalDto>}
   */
  async confirmRegistration(token: string): Promise<void> {
    const user = await this.authRepository.getUserFromToken(token);
    if (!user) {
      throw new ConfirmRegistrationUserNotFound();
    }
    if (user.status != UserStatus.EMAIL_NOT_CONFIRMED) {
      throw new ConfirmRegistrationUserAlreadyVerified();
    }
    await this.userService.assignStatus(user.id, UserStatus.ACTIVE);
    await this.authRepository.deleteRegistrationConfirmation(user.id);
  }

  /**
   * Me
   * @param userId userId
   * @returns {Promise<UserInternalDto>}
   */
  async createConfirmation(user: UserInternalDto): Promise<string> {
    if (user.status != UserStatus.EMAIL_NOT_CONFIRMED) {
      throw new ConfirmRegistrationUserAlreadyVerified();
    }
    const token = randomUUID();
    const confirmationLink = this.createConfirmationLink(token);
    this.authRepository.upsertRegistrationConfirmation(user.id, token);
    this.mailService.sendRegisterConfirmation(user, confirmationLink);
    return confirmationLink;
  }

  /**
   * Create forgot password token
   * @param user user
   * @returns {Promise<string>}
   */
  private createConfirmationLink(token: string): string {
    return `${this.frontendPublicUrl}/api/auth/confirm-registration?token=${token}`;
  }

  /**
   * Create forgot password token
   * @param user user
   * @returns {Promise<string>}
   */
  private createChangePasswordLink(token: string): string {
    return `${this.frontendPublicUrl}/mapa/zapomnialem-hasla?token=${token}`;
  }

  /**
   * Create forgot password token
   * @param user user
   * @returns {Promise<string>}
   */
  async createChangePasswordToken(user: UserInternalDto): Promise<string> {
    const token = randomUUID();
    this.authRepository.upsertChangePasswordToken(user.id, token);
    const changePasswordLink = this.createChangePasswordLink(token);
    this.mailService.sendChangePasswordLink(user, changePasswordLink);
    return token;
  }

  /**
   * Change forgotten password
   * @param dto dto
   * @returns {Promise<void>}
   */
  async changeForgottenPassword(dto: ChangeForgottenPasswordInputDto) {
    const user = await this.authRepository.getUserFromChangePasswordToken(
      dto.token,
    );
    if (!user) {
      throw new SimpleNotFound(
        'Żądanie zmiany hasła wygasło. Proszę spróbować ponownie.',
      );
    }
    await this.authRepository.deleteChangePasswordToken(dto.token);
    await this.userService.updateForgottenPassword(user, dto.password);
  }

  /**
   * Validate forgot password token
   * @param token token
   * @returns {Promise<boolean>}
   */
  async validateForgotPasswordToken(token: string): Promise<boolean> {
    const user =
      await this.authRepository.getUserFromChangePasswordToken(token);
    if (!user) {
      return false;
    }
    return true;
  }
}
