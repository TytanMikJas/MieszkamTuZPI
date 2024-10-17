import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import UserService from 'src/modules/user/user.service';
import { SECRET_KEY } from 'src/strings';
import { Observable } from 'rxjs';

@Injectable()
export default class IdentifyStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
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
    try {
      const user = await this.userService.findById(payload.userId);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

@Injectable()
export class IdentifyAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Check if the request has the accessToken cookie
    if (!request || !request.cookies['accessToken']) {
      // If no accessToken is present, skip JWT validation and allow the request
      return true;
    }
    // If accessToken exists, proceed with JWT validation
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // If there's no user due to no token or validation failure, return null instead of throwing an error
    if (!user) {
      return null;
    }
    // If a user is found, proceed normally
    return user;
  }
}
