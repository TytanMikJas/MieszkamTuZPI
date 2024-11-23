import { IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import UserRolesTransform from 'src/decorators/transformers/user-roles.transformer';
import { Logger } from '@nestjs/common';

const logger = new Logger('FilterUsersDto');

/**
 * Data transfer object for filtering users
 * @export
 * @class FilterUsersDto
 * @param {UserStatus} status
 * @param {UserRole[]} roles
 * @param {string} orderBy
 * @param {string} sortOrder
 * @method {where} Get where clause
 * @method {order} Get order clause
 */
export class FilterUsersDto {
  @ApiProperty({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus = null;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @UserRolesTransform()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[] = null;

  @IsOptional()
  orderBy?: string = null;

  @IsOptional()
  sortOrder?: string = null;

  public get where() {
    logger.debug(this.status, this.roles);
    if (!this.status && !this.roles) {
      return {};
    }

    if (this.roles.length > 1) {
      return {
        AND: [
          this.status ? { status: this.status } : {},
          {
            role: {
              in: this.roles,
            },
          },
        ],
      };
    }

    return {
      AND: [
        this.status ? { status: this.status } : {},
        this.roles ? { role: this.roles[0] } : {},
      ],
    };
  }

  public get order() {
    if (!this.orderBy) {
      return {};
    }
    return {
      [this.orderBy]: this.sortOrder || 'asc',
    };
  }
}
