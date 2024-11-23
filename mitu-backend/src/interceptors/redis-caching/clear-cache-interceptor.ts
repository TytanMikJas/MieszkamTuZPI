import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CLEAR_CACHE_KEY } from '../../strings';
import { RedisCacheManager } from '../../configuration';

const logger = new Logger('ClearCacheInterceptor');

function removeTrailingSlash(url: string): string {
  url = url.replace(/\/$/, '');
  logger.debug(`Removed trailing slash from ${url}`);
  return url;
}

@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url: string = context.switchToHttp().getRequest().url;
    const additionalPatterns = this.reflector.get<string[]>(
      CLEAR_CACHE_KEY,
      context.getHandler(),
    );
    logger.debug('additionalPatterns', additionalPatterns);
    let patterns: string[] = [url];
    if (additionalPatterns) {
      patterns.push(...additionalPatterns);
    }

    patterns = patterns.map(removeTrailingSlash);

    return next.handle().pipe(
      switchMap(async (response: any) => {
        const redisClient = await RedisCacheManager;

        patterns.map(async (urlToClear) => {
          if (urlToClear.includes('/slug')) {
            const { prevSlug } = response;
            await redisClient.del(`${urlToClear}/${prevSlug}`);
          } else if (urlToClear.includes('/one/')) {
            await redisClient.del(`${urlToClear}`);
          } else {
            // clear all getAlls:
            const redisKeys = await redisClient.keys(`${urlToClear}\\?*`);
            logger.debug(
              `Clearing cache for ${urlToClear} and ${redisKeys.length} related keys`,
            );
            for (const key of redisKeys) {
              await redisClient.del(key);
            }
            await redisClient.del(urlToClear);
          }
        });
        return response;
      }),
    );
  }
}
