import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import AuthController from './auth.controller';
import LocalStrategy, { LocalAuthGuard } from './strategies/local.strategy';
import AuthRepository from './auth.repository';
import JWTStrategy, { JWTAuthGuard } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/strings';
import RefreshTokenStrategy, { RefreshTokenAuthGuard } from './strategies/refresh-token.strategy';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy,
    LocalAuthGuard,
    JWTAuthGuard,
    RefreshTokenAuthGuard,
    RefreshTokenStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: SECRET_KEY,
      global: true,
    }),
  ],
})
export class AuthModule {}
