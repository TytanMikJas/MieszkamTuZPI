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
@Injectable()
export default class JWTStrategy extends PassportStrategy(Strategy) {
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

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {}
