import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

/**
 * Repository for Auth
 * @export
 * @class AuthRepository
 * @param {PrismaClient} prisma
 * @method {updateRefreshToken}
 * @method {getRefreshToken}
 * @method {getUserFromToken}
 * @method {upsertRegistrationConfirmation}
 * @method {getConfirmationTokenByUserId}
 * @method {deleteRegistrationConfirmation}
 * @method {upsertChangePasswordToken}
 * @method {getUserFromChangePasswordToken}
 * @method {deleteChangePasswordToken}
 */
@Injectable()
export default class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Update refresh token
   * @param {number} userId
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
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

  /**
   * Get refresh token
   * @param {number} userId
   * @returns {Promise<string>}
   */
  async getRefreshToken(userId: PRISMA_ID): Promise<string | null> {
    const refreshToken = await this.prisma.user_RefreshToken.findUnique({
      where: {
        userId: userId,
      },
    });
    return refreshToken?.token || null;
  }

  /**
   * Get user from token
   * @param {string} token
   * @returns {Promise<User | null>}
   */
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

  /**
   * Upsert registration confirmation
   * @param {PRISMA_ID} userId
   * @param {string} token
   * @returns {Promise<void>}
   */
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

  /**
   * Get confirmation token by userId
   * @param {PRISMA_ID} id
   * @returns {Promise<string | null>}
   */
  async getConfirmationTokenByUserId(id: PRISMA_ID): Promise<string | null> {
    const data = await this.prisma.user_EmailVerificationToken.findFirst({
      where: {
        userId: id,
      },
    });
    return data?.token || null;
  }

  /**
   * Delete registration confirmation
   * @param {PRISMA_ID} id
   * @returns {Promise<void>}
   */
  async deleteRegistrationConfirmation(id: PRISMA_ID) {
    await this.prisma.user_EmailVerificationToken.delete({
      where: {
        userId: id,
      },
    });
  }

  /**
   * Upsert change password token
   * @param {PRISMA_ID} userId
   * @param {string} token
   * @returns {Promise<void>}
   */
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

  /**
   * Get user from change password token
   * @param {string} token
   * @returns {Promise<User | null>}
   */
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

  /**
   * Delete change password token
   * @param {string} token
   * @returns {Promise<void>}
   */
  async deleteChangePasswordToken(token: string): Promise<void> {
    await this.prisma.user_ChangePasswordToken.delete({
      where: {
        token: token,
      },
    });
  }
}
