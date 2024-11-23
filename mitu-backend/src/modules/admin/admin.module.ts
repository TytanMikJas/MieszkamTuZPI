import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import AdminService from './admin.service';
import { MailModule } from '../mail/mail.module';

/**
 * Module for admin actions
 */
@Module({
  imports: [UserModule, MailModule],
  controllers: [AdminController],
  exports: [],
  providers: [AdminService],
})
export class AdminModule {}
