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
export const saltRounds = 10;
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
    this.apiPublicUrl = configService.get<string>('API_PUBLIC_URL');
    this.frontendPublicUrl = configService.get<string>('FRONTEND_PUBLIC_URL');
  }
  private apiPublicUrl: string;
  private frontendPublicUrl: string;
  //this method assumes, that user was already validated by Passport's LocalStrategy
  async signIn(user: UserInternalDto): Promise<SignInOutputDto> {
    await this.validateAccountStatus(user.status);
    const token = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

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

  async hashPassword(plaintextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);
    return hash;
  }

  async comparePassword(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(plaintextPassword, hashedPassword);
    return result;
  }

  async generateAccessToken(user: UserInternalDto): Promise<string> {
    const payload: AccessTokenPayloadDto = { userId: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '2h' });
    return token;
  }

  async generateRefreshToken(user: UserInternalDto): Promise<string> {
    const payload: AccessTokenPayloadDto = { userId: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.updateRefreshToken(user.id, token);
    return token;
  }

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

  async validateAccountStatus(status: UserStatus) {
    switch (status) {
      case UserStatus.ACTIVE: {
        return;
      }
      case UserStatus.BANNED: {
        throw new SimpleNotFound(ERROR_USER_DELETED);
      }
      case UserStatus.DELETED: {
        throw new SimpleNotFound(ERROR_USER_DELETED);
      }
      case UserStatus.EMAIL_NOT_CONFIRMED: {
        throw new SimpleNotFound(ERROR_EMAIL_NOT_CONFIRMED);
      }
      case UserStatus.SHADOW_BANNED: {
        throw new SimpleNotFound(ERROR_USER_DELETED);
      }
    }
  }
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

  async createConfirmation(user: UserInternalDto): Promise<string> {
    if (user.status != UserStatus.EMAIL_NOT_CONFIRMED) {
      throw new ConfirmRegistrationUserAlreadyVerified();
    }
    const token = randomUUID();
    const confirmationLink = this.createConfirmationLink(token);
    this.authRepository.upsertRegistrationConfirmation(user.id, token);
    //TODO send email with confirmation link
    return confirmationLink;
  }

  private createConfirmationLink(token: string): string {
    return `${this.frontendPublicUrl}/api/auth/confirm-registration?token=${token}`;
  }

  private createChangePasswordLink(token: string): string {
    return `${this.frontendPublicUrl}/mapa/zapomnialem-hasla?token=${token}`;
  }

  async createChangePasswordToken(user: UserInternalDto): Promise<string> {
    const token = randomUUID();
    this.authRepository.upsertChangePasswordToken(user.id, token);
    //TODO send email with change password link
    return token;
  }

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

  async validateForgotPasswordToken(token: string): Promise<boolean> {
    const user =
      await this.authRepository.getUserFromChangePasswordToken(token);
    if (!user) {
      return false;
    }
    return true;
  }
}
