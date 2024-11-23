import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import UserService from 'src/modules/user/user.service';
import { SECRET_KEY } from 'src/strings';
import { Observable } from 'rxjs';

/**
 * Identify strategy that extends PassportStrategy to validate JWT
 * @export
 * @class IdentifyStrategy
 * @extends {PassportStrategy(Strategy)}
 * @param {UserService} userService
 * @constructor
 * @method {validate}
 * @returns {Promise<UserInternalDto>}
 */
@Injectable()
export default class IdentifyStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of IdentifyStrategy.
   * @param {UserService} userService
   * @memberof Identify
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
   * Validate the payload
   * @param {*} payload
   * @returns {Promise<UserInternalDto>}
   */
  async validate(payload: any): Promise<UserInternalDto> {
    try {
      const user = await this.userService.findById(payload.userId);
      return user;
    } catch (error) {
      return null;
    }
  }
}

/**
 * IdentifyAuthGuard that extends AuthGuard to check if the request has an accessToken cookie
 * @export
 * @class IdentifyAuthGuard
 * @extends {AuthGuard('jwt')}
 * @method {canActivate}
 * @method {handleRequest}
 */
@Injectable()
export class IdentifyAuthGuard extends AuthGuard('jwt') {
  /**
   * Check if the request has an accessToken cookie
   * @param {ExecutionContext} context
   * @returns {boolean | Promise<boolean> | Observable<boolean>}
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request || !request.cookies['accessToken']) {
      return true;
    }
    return super.canActivate(context);
  }

  /**
   * Handle the request and return the user
   * @param {*} _err
   * @param {*} user
   * @param {*} _info
   * @param {ExecutionContext} _context
   * @returns {UserInternalDto}
   */
  handleRequest(_err: any, user, _info: any, _context: ExecutionContext) {
    if (!user) {
      return null;
    }
    return user;
  }
}
