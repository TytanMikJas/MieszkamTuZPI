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
    CartographyModule,
    FilehandlerModule,
    AttachmentModule,
    PrismaModule,
    UserModule,
    AuthModule,
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
