import { Injectable } from '@nestjs/common';
import PublicUserDto from '../user/dto/public-user-dto';
import CreateUserInputDto from '../user/dto/create-user.input';
import UserService from '../user/user.service';
import { FilterUsersDto } from '../admin/dto/filter-users.dto';
import { PRISMA_ID } from 'src/types';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import {
  ERROR_ID_NOT_PROVIDED,
  ERROR_USER_NOT_FOUND,
  ERROR_USER_PASSWORD_ADMIN,
} from 'src/strings';
import { generatePassword as pswdGenerate } from './admin.utils';
import { $Enums } from '@prisma/client';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import CreateOfficialInputDto from '../user/dto/create-official.input';
import CreateOfficialDto from './dto/create-official.dto';
import { MailService } from '../mail/mail-sender.service';

/**
 * Service for admin actions
 * @category Modules
 * @class AdminService
 * @param {UserService} userService - Injected UserService
 * @param {MailService} mailService - Injected MailService
 * @method getAllUsers - Get all users
 * @method createOfficial - Create official
 * @method generatePassword - Generate password
 */
@Injectable()
export default class AdminService {
  /**
   * Creates an instance of AdminService.
   * @param {UserService} userService
   * @param {MailService} mailService
   * @memberof AdminService
   */
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Get all users
   * @param {FilterUsersDto} filter
   * @returns {Promise<PublicUserDto[]>}
   */
  async getAllUsers(filter: FilterUsersDto): Promise<PublicUserDto[]> {
    return await this.userService.getAll(filter);
  }

  /**
   * Create official
   * @param {CreateOfficialInputDto} body
   * @returns {Promise<CreateOfficialDto>}
   */
  async createOfficial(
    body: CreateOfficialInputDto,
  ): Promise<CreateOfficialDto> {
    const { role, ...rest } = body;
    const _b: CreateUserInputDto = {
      ...rest,
      password: await pswdGenerate(),
      newsletter_agreement: false,
      forceChangePassword: true,
    };
    await this.userService.adminCreate(_b);
    const user = await this.userService.findByEmail(body.email);

    return {
      user: await this.userService.assignRole(user.id, role),
      password: _b.password,
    };
  }

  /**
   * Generate password
   * @param {PRISMA_ID} id
   * @returns {Promise<string>}
   */
  async generatePassword(id: PRISMA_ID): Promise<string> {
    if (!id) {
      throw new SimpleBadRequest(ERROR_ID_NOT_PROVIDED);
    }

    const _u = await this.userService.findById(id);

    if (!_u) {
      throw new SimpleNotFound(ERROR_USER_NOT_FOUND);
    }

    if (_u.role === $Enums.UserRole.ADMIN) {
      throw new SimpleBadRequest(ERROR_USER_PASSWORD_ADMIN);
    }

    const password = await pswdGenerate();

    await this.userService.forceUpdatePassword(id, password);

    await this.userService.setForceResetPassword(id, true);

    await this.mailService.sendPasswordReset(_u.email, password);
    return password;
  }
}
