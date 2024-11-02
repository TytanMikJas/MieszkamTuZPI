import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import UserService from 'src/modules/user/user.service';
import {
  JWT_USER_NOT_ACTIVE_MESSAGE,
  JWT_USER_NOT_FOUND_MESSAGE,
  SECRET_KEY,
} from 'src/strings';
import JwtException from '../exceptions/jwt-token.exception';
import { UserStatus } from '@prisma/client';

/**
 * JWT strategy that extends PassportStrategy to validate JWT
 * @export
 * @class JWTStrategy
 * @extends {PassportStrategy(Strategy)}
 * @param {UserService} userService
 * @constructor
 * @method {validate}
 * @returns {Promise<UserInternalDto>}
 */
@Injectable()
export default class JWTStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JWTStrategy.
   * @param {UserService} userService
   * @memberof JWTStrategy
   */
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const accessToken = req?.cookies['accessToken'];
          return accessToken;
        },
      ]),
      secretOrKey: SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  /**
   * Validate JWT payload
   * @param {any} payload
   * @returns {Promise<UserInternalDto>}
   */
  async validate(payload: any): Promise<UserInternalDto> {
    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new JwtException(JWT_USER_NOT_FOUND_MESSAGE(payload.userId));
    }
    if (user.status != UserStatus.ACTIVE) {
      throw new JwtException(JWT_USER_NOT_ACTIVE_MESSAGE(payload.userId));
    }
    return user;
  }
}

/**
 * JWTAuthGuard that extends AuthGuard to check if the request has an accessToken cookie
 * @export
 * @class JWTAuthGuard
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {}
