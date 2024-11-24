import { Module } from '@nestjs/common';
import { CartographyModule } from './modules/cartography/cartography.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { RequestLoggingInterceptor } from './interceptors/request-logging/request-logging.interceptor';
import { ResponseTransformInterceptor } from './interceptors/response-transform/response-transform.interceptor';
import { ResponseLoggingInterceptor } from './interceptors/response-logging/response-logging.interceptor';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilehandlerModule } from './modules/filehandler/filehandler.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { STATIC_ROOT_PATH } from './constants';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { PostModule } from './modules/post/post.module';
import { PoiModule } from './modules/poi/poi.module';
import { InvestmentModule } from './modules/investment/investment.module';
import { ListingModule } from './modules/listing/listing.module';
import { CommentModule } from './modules/comment/comment.module';
import { AdminModule } from './modules/admin/admin.module';
import { RatingModule } from './modules/rating/rating.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheManager } from './configuration';
import { SentimentModule } from './modules/sentiment/sentiment.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import NewsletterModule from './modules/newsletter/newsletter.module';

/**
 * Main module of the application.
 * Contains all the other modules.
 * @module
 * @name AppModule
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: STATIC_ROOT_PATH,
      renderPath: '/uploads',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await RedisCacheManager,
      }),
    }),
    CartographyModule,
    FilehandlerModule,
    AttachmentModule,
    PrismaModule,
    PostModule,
    CommentModule,
    UserModule,
    AuthModule,
    AnnouncementModule,
    InvestmentModule,
    ListingModule,
    PoiModule,
    ModerationModule,
    AdminModule,
    RatingModule,
    SentimentModule,
    NewsletterModule,
  ],
  providers: [
    Reflector,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule {}
