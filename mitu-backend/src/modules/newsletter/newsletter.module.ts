import { Module } from '@nestjs/common';
import NewsletterController from './newsletter.controller';
import NewsletterService from './newsletter.service';
import NewsletterRepository from './newsletter.repository';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MailModule, UserModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository],
  exports: [NewsletterService],
})
export default class NewsletterModule {}
