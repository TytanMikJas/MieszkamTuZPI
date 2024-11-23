import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CLEAR_CACHE_KEY } from '../../strings';
import { RedisCacheManager } from '../../configuration';

const logger = new Logger('ConditionalCacheInterceptor');

@Injectable()
export class ConditionalCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url: string = context.switchToHttp().getRequest().url;
    const patternsToIgnore: string[] = this.reflector.get<string[]>(
      CLEAR_CACHE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(async (response) => {
        const redisClient = await RedisCacheManager;

        for (const pattern of patternsToIgnore) {
          if (url.includes(pattern)) {
            logger.debug('Ignoring cache for url:', url);
            return;
          }
        }
        await redisClient.set(url, JSON.stringify(response));
      }),
    );
  }
}
