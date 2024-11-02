import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import AdminService from './admin.service';
import { $Enums } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/strategies/roles.guard';
import { JWTAuthGuard } from '../auth/strategies/jwt.strategy';
import { FilterUsersDto } from './dto/filter-users.dto';
import { PRISMA_ID } from 'src/types';
import CreateOfficialInputDto from '../user/dto/create-official.input';
import CreateOfficialDto from './dto/create-official.dto';

import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';

/**
 * Controller for admin actions
 * @export
 * @class AdminController
 * @param {AdminService} adminService
 * @constructor
 * @method {getAllUsers} Get all users
 * @method {createOfficial} Create official
 * @method {generatePassword} Generate password
 */
@ApiTags('admin')
@Controller('admin')
@Roles($Enums.UserRole.ADMIN)
@UseGuards(JWTAuthGuard, RolesGuard)
export class AdminController {
  /**
   * Creates an instance of AdminController.
   * @param {AdminService} adminService
   * @memberof AdminController
   */
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get all users
   * @param {FilterUsersDto} filter
   * @returns
   * @memberof AdminController
   */
  @Get('users')
  async getAllUsers(@Query() filter: FilterUsersDto) {
    return this.adminService.getAllUsers(filter);
  }

  /**
   * Create official
   * @param {CreateOfficialInputDto} body
   * @returns
   * @memberof AdminController
   */
  @Post('official')
  async createOfficial(
    @Body() body: CreateOfficialInputDto,
  ): Promise<CreateOfficialDto> {
    return this.adminService.createOfficial(body);
  }

  /**
   * Generate password
   * @param {PRISMA_ID} id
   * @returns
   * @memberof AdminController
   */
  @Patch('password/:id')
  async generatePassword(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<string> {
    return this.adminService.generatePassword(id);
  }
}
