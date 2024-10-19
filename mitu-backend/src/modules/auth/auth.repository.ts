import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

@Injectable()
export default class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user_RefreshToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: refreshToken,
      },
      create: {
        userId: userId,
        token: refreshToken,
      },
    });
  }

  async getRefreshToken(userId: PRISMA_ID): Promise<string | null> {
    const refreshToken = await this.prisma.user_RefreshToken.findUnique({
      where: {
        userId: userId,
      },
    });
    return refreshToken?.token || null;
  }

  async getUserFromToken(token: string): Promise<User | null> {
    const data = await this.prisma.user_EmailVerificationToken.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    });
    if (!data.user) {
      return null;
    }
    return data.user;
  }

  async upsertRegistrationConfirmation(userId: PRISMA_ID, token: string) {
    await this.prisma.user_EmailVerificationToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: token,
      },
      create: {
        userId: userId,
        token: token,
      },
    });
  }

  async getConfirmationTokenByUserId(id: PRISMA_ID): Promise<string | null> {
    const data = await this.prisma.user_EmailVerificationToken.findFirst({
      where: {
        userId: id,
      },
    });
    return data?.token || null;
  }

  async deleteRegistrationConfirmation(id: PRISMA_ID) {
    await this.prisma.user_EmailVerificationToken.delete({
      where: {
        userId: id,
      },
    });
  }

  async upsertChangePasswordToken(userId: PRISMA_ID, token: string) {
    await this.prisma.user_ChangePasswordToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: token,
      },
      create: {
        userId: userId,
        token: token,
      },
    });
  }

  async getUserFromChangePasswordToken(token: string): Promise<User | null> {
    const data = await this.prisma.user_ChangePasswordToken.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    });
    if (!data || !data.user) {
      return null;
    }
    return data.user;
  }

  async deleteChangePasswordToken(token: string): Promise<void> {
    await this.prisma.user_ChangePasswordToken.delete({
      where: {
        token: token,
      },
    });
  }
}
