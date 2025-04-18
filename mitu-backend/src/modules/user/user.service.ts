import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import CreateUserInputDto from './dto/create-user.input';
import { AuthService } from '../auth/auth.service';
import { InvalidInputException } from 'src/exceptions/invalid-input.exception';
import UserInternalDto from './dto/user.internal';
import UserRepository from './user.repository';
import { RenderType } from 'src/dto/exception.output';
import { UserRole, UserStatus } from '@prisma/client';
import { ERROR_USER_NOT_FOUND, USER_LOGIN_ALREADY_EXISTS } from 'src/strings';
import PublicUserDto from './dto/public-user-dto';
import { PRISMA_ID } from '../../types';
import { FilterUsersDto } from '../admin/dto/filter-users.dto';
import UpdateUserInfoInputDto from './dto/update-user-info.input';
import UpdateUserPasswordInputDto from './dto/update-user-password.input';
import UpdateUserEmailInputDto from './dto/update-user-email.input';
import * as bcrypt from 'bcrypt';
import DeleteAccountInputDto from './dto/delete-account-input-dto';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { MailService } from '../mail/mail-sender.service';

/**
 * User service
 * @export
 * @class UserService
 * @param {UserRepository} userRepository
 * @param {AuthService} authService
 * @param {MailService} mailService
 */
@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Create a new user
   * @param {CreateUserInputDto} body
   * @param {UserStatus} status
   * @returns {Promise<void>}
   */
  async create(body: CreateUserInputDto, status?: UserStatus): Promise<void> {
    if (await this.findByEmail(body.email)) {
      throw new InvalidInputException(
        USER_LOGIN_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        RenderType.form,
        'email',
      );
    }

    const hashedPassword = await this.authService.hashPassword(body.password);
    const user = await this.userRepository.create({
      firstName: body.firstName,
      lastName: body.lastName,
      password: hashedPassword,
      email: body.email,
      newsletter_agreement: body.newsletter_agreement,
      role: UserRole.USER,
      status: status ? status : UserStatus.EMAIL_NOT_CONFIRMED,
      forceChangePassword: body.forceChangePassword
        ? body.forceChangePassword
        : false,
    });
    if (user.status === UserStatus.EMAIL_NOT_CONFIRMED) {
      this.authService.createConfirmation(user);
    }
  }

  /**
   * Create a new admin
   * @param {CreateUserInputDto} body
   * @returns {Promise<void>}
   */
  async adminCreate(body: CreateUserInputDto): Promise<void> {
    if (await this.findByEmail(body.email)) {
      throw new InvalidInputException(
        USER_LOGIN_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        RenderType.form,
        'email',
      );
    }

    const hashedPassword = await this.authService.hashPassword(body.password);
    const user = await this.userRepository.create({
      firstName: body.firstName,
      lastName: body.lastName,
      password: hashedPassword,
      email: body.email,
      newsletter_agreement: body.newsletter_agreement,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      forceChangePassword: body.forceChangePassword
        ? body.forceChangePassword
        : false,
    });
    this.mailService.sendAdminCreatedYourAccountMail(user.email, body.password);
  }

  /**
   * Update user info
   * @param {PRISMA_ID} id
   * @param {UpdateUserInfoInputDto} body
   * @returns {Promise<void>}
   */
  async updateInfo(id: PRISMA_ID, body: UpdateUserInfoInputDto): Promise<void> {
    await this.userRepository.updateInfo(id, body);
  }

  /**
   * Update user password
   * @param {PRISMA_ID} id
   * @param {UpdateUserPasswordInputDto} body
   * @returns {Promise<void>}
   */
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

  //TODO: ZROBIC WERYFIKACJE POPRZEZ MAILA
  async updateEmail(
    id: PRISMA_ID,
    body: UpdateUserEmailInputDto,
  ): Promise<void> {
    // throw new NotImplementedException();
    const user = await this.userRepository.findById(id);

    const passwordsMatch = await this.comparePasswords(
      body.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new InvalidInputException(
        'Nieprawidłowe hasło',
        HttpStatus.CONFLICT,
        RenderType.form,
      );
    }

    const emailExists = await this.findByEmail(body.email);
    if (emailExists && emailExists.id !== id) {
      throw new InvalidInputException(
        USER_LOGIN_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        RenderType.form,
        'email',
      );
    }
    await this.userRepository.updateEmail(id, body.email);
  }

  /**
   * Delete user
   * @param {PRISMA_ID} id
   * @param {DeleteAccountInputDto} body
   * @returns {Promise<void>}
   */
  async deteleUser(id: PRISMA_ID, body: DeleteAccountInputDto): Promise<void> {
    const user = await this.userRepository.findById(id);

    const passwordsMatch = await this.comparePasswords(
      body.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new InvalidInputException(
        'Nieprawidłowe hasło',
        HttpStatus.CONFLICT,
        RenderType.form,
      );
    }

    await this.userRepository.deleteUser(id);
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<UserInternalDto>}
   * @memberof UserService
   */
  async findByEmail(email: string): Promise<UserInternalDto> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  /**
   * Find user by email
   * @returns {Promise<UserInternalDto>}
   * @memberof UserService
   */
  async setForceResetPassword(
    id: PRISMA_ID,
    forceChangePassword: boolean,
  ): Promise<void> {
    const _u = await this.userRepository.findById(id);
    if (!_u) {
      throw new SimpleNotFound(ERROR_USER_NOT_FOUND);
    }

    await this.userRepository.setForceResetPassword(id, forceChangePassword);
  }

  /**
   * Find user by id
   * @param {number} id
   * @returns {Promise<UserInternalDto | null>}
   */
  async findById(id: number): Promise<UserInternalDto | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  /**
   * Get all users
   * @param {FilterUsersDto} filter
   * @returns {Promise<PublicUserDto[]>}
   */
  async getAll(filter: FilterUsersDto): Promise<PublicUserDto[]> {
    filter.roles = [UserRole.ADMIN, UserRole.OFFICIAL];
    return await this.userRepository.getAll(filter);
  }

  /**
   * Get all users with newsletter agreement
   * @returns {Promise<UserInternalDto[]>}
   */
  async getAllWithNewsletterAgreement(): Promise<UserInternalDto[]> {
    return await this.userRepository.findAllByNewsletterAgreement(true);
  }

  /**
   * Assign role
   * @param {PRISMA_ID} id
   * @param {UserRole} role
   * @returns {Promise<PublicUserDto>}
   */
  async assignRole(id: PRISMA_ID, role: UserRole): Promise<PublicUserDto> {
    return await this.userRepository.assignRole(id, role);
  }

  /**
   * Compare passwords
   * @param {string} plainTextPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  /**
   * Force update password
   * @param {PRISMA_ID} id
   * @param {string} password
   * @returns {Promise<void>}
   */
  async forceUpdatePassword(id: PRISMA_ID, password: string): Promise<void> {
    const hashedPassword = await this.authService.hashPassword(password);
    await this.userRepository.forceUpdatePassword(id, hashedPassword);
  }

  /**
   * Assign status
   * @param {PRISMA_ID} id
   * @param {UserStatus} status
   * @returns {Promise<PublicUserDto>}
   */
  async assignStatus(
    id: PRISMA_ID,
    status: UserStatus,
  ): Promise<PublicUserDto> {
    return await this.userRepository.assignStatus(id, status);
  }

  /**
   * Update forgotten password
   * @param {UserInternalDto} user
   * @param {string} password
   * @returns {Promise<void>}
   */
  async updateForgottenPassword(
    user: UserInternalDto,
    password: string,
  ): Promise<void> {
    const hashedPassword = await this.authService.hashPassword(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);
  }
}
