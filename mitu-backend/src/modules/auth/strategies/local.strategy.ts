import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import InvalidCredentialsException from '../exceptions/invalid-credentials.exception';

/**
 * Local strategy that extends PassportStrategy to validate local login
 * @export
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 * @param {AuthService} authService
 * @constructor
 * @method {validate}
 * @returns {Promise<UserInternalDto>}
 */
@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password', options: {} });
  }

  /**
   * Validate local login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserInternalDto>}
   */
  async validate(email: string, password: string): Promise<UserInternalDto> {
    email = email.toLocaleLowerCase();
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}

/**
 * LocalAuthGuard that extends AuthGuard to check if the request has an accessToken cookie
 * @export
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
