import { Module, forwardRef } from '@nestjs/common';
import UserService from './user.service';
import UserController from './user.controller';
import UserRepository from './user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserRepository],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
