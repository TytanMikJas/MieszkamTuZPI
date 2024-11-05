import { Module, forwardRef } from '@nestjs/common';
import UserService from './user.service';
import UserController from './user.controller';
import UserRepository from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

/**
 * User module
 * @export
 * @class UserModule
 */
@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserRepository],
  imports: [forwardRef(() => AuthModule), MailModule],
})
export class UserModule {}
