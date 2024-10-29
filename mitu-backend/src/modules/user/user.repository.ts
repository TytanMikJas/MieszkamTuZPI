import { Injectable } from '@nestjs/common';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import UserInternalDto from './dto/user.internal';
import PublicUserDto from './dto/public-user-dto';
import { PRISMA_ID } from '../../types';
import { FilterUsersDto } from '../admin/dto/filter-users.dto';
import UpdateUserInfoInputDto from './dto/update-user-info.input';

@Injectable()
export default class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: Omit<UserInternalDto, 'id'>): Promise<UserInternalDto> {
    const createdUser = await this.prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        email: user.email,
        newsletter_agreement: user.newsletter_agreement,
        status: user.status,
        role: user.role,
        forceChangePassword: user.forceChangePassword
          ? user.forceChangePassword
          : false,
      },
    });

    return {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      password: createdUser.password,
      email: createdUser.email,
      avatar: createdUser.avatar,
      newsletter_agreement: createdUser.newsletter_agreement,
      role: createdUser.role,
      status: createdUser.status,
      forceChangePassword: createdUser.forceChangePassword,
    };
  }

  async updateInfo(
    id: PRISMA_ID,
    user: UpdateUserInfoInputDto,
  ): Promise<UserInternalDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        newsletter_agreement: user.newsletter_agreement,
      },
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      password: updatedUser.password,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      newsletter_agreement: updatedUser.newsletter_agreement,
      role: updatedUser.role,
      status: updatedUser.status,
      forceChangePassword: updatedUser.forceChangePassword,
    };
  }

  async updatePassword(
    id: PRISMA_ID,
    password: string,
  ): Promise<UserInternalDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: password,
      },
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      password: updatedUser.password,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      newsletter_agreement: updatedUser.newsletter_agreement,
      role: updatedUser.role,
      status: updatedUser.status,
      forceChangePassword: updatedUser.forceChangePassword,
    };
  }

  async updateEmail(id: PRISMA_ID, email: string): Promise<UserInternalDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
      },
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      password: updatedUser.password,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      newsletter_agreement: updatedUser.newsletter_agreement,
      role: updatedUser.role,
      status: updatedUser.status,
      forceChangePassword: updatedUser.forceChangePassword,
    };
  }

  async deleteUser(id: PRISMA_ID): Promise<UserInternalDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: 'DELETED',
      },
    });

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      password: updatedUser.password,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      newsletter_agreement: updatedUser.newsletter_agreement,
      role: updatedUser.role,
      status: updatedUser.status,
      forceChangePassword: updatedUser.forceChangePassword,
    };
  }

  async setForceResetPassword(
    id: PRISMA_ID,
    forceResetPassword: boolean,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { forceChangePassword: forceResetPassword },
    });
  }

  async findById(id: PRISMA_ID): Promise<UserInternalDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      avatar: user.avatar,
      newsletter_agreement: user.newsletter_agreement,
      role: user.role,
      status: user.status,
      forceChangePassword: user.forceChangePassword,
    };
  }

  async findByEmail(email: string): Promise<UserInternalDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      avatar: user.avatar,
      newsletter_agreement: user.newsletter_agreement,
      role: user.role,
      status: user.status,
      forceChangePassword: user.forceChangePassword,
    };
  }

  async updateRefreshToken(
    userId: PRISMA_ID,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user_RefreshToken.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        token: refreshToken,
      },
      update: {
        token: refreshToken,
      },
    });
  }

  private visibleUserProps = {
    firstName: true,
    lastName: true,
    role: true,
    avatar: true,
    forceChangePassword: true,
  };

  async getAll(filter?: FilterUsersDto): Promise<PublicUserDto[]> {
    return this.prisma.user.findMany({
      where: filter.where,
      orderBy: filter.order,
      select: { ...this.visibleUserProps, id: true },
    });
  }

  async findAllByNewsletterAgreement(newsletterAgreement: boolean) {
    return this.prisma.user.findMany({
      where: { newsletter_agreement: newsletterAgreement },
    });
  }

  async assignRole(id: PRISMA_ID, role: UserRole): Promise<PublicUserDto> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: this.visibleUserProps,
    });
  }

  async forceUpdatePassword(
    id: PRISMA_ID,
    hashedPassword: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    await this.prisma.user_RefreshToken.deleteMany({
      where: { userId: id },
    });
  }
  async assignStatus(
    id: PRISMA_ID,
    status: UserStatus,
  ): Promise<PublicUserDto> {
    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: this.visibleUserProps,
    });
  }
}
