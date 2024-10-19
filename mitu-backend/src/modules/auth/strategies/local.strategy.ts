import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import InvalidCredentialsException from '../exceptions/invalid-credentials.exception';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password', options: {} });
  }

  async validate(email: string, password: string): Promise<UserInternalDto> {
    email = email.toLocaleLowerCase();
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
