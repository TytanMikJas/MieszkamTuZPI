import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import UserService from 'src/modules/user/user.service';
import { JWT_USER_NOT_FOUND_MESSAGE, SECRET_KEY } from 'src/strings';
import JwtException from '../exceptions/jwt-token.exception';

/**
 * RefreshTokenStrategy that extends PassportStrategy to validate refresh JWT token
 * @export
 * @class JWTStrategy
 * @extends {PassportStrategy(Strategy)}
 * @param {UserService} userService
 * @constructor
 * @method {validate}
 * @returns {Promise<UserInternalDto>}
 */
@Injectable()
export default class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  /**
   * Creates an instance of JWTStrategy.
   * @param {UserService} userService
   * @memberof JWTStrategy
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const accessToken = req?.cookies['refreshToken'];
          return accessToken;
        },
      ]),
      secretOrKey: SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  /**
   * Validate if user exists based on JWT token
   * @param {any} payload
   * @returns {Promise<UserInternalDto>}
   */
  async validate(payload: any): Promise<UserInternalDto> {
    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new JwtException(JWT_USER_NOT_FOUND_MESSAGE(payload.userId));
    }
    return user;
  }
}

/**
 * RefreshTokenAuthGuard that extends AuthGuard
 * @export
 * @class JWTAuthGuard
 * @extends {AuthGuard('access-token')}
 */
@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('access-token') {}
