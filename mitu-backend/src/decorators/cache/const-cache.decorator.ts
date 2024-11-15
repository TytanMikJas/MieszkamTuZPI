import { CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { CONSTANT_CACHE_TTL_SECONDS } from 'src/constants';

export function ConstantCache(): MethodDecorator {
  return applyDecorators(
    CacheTTL(CONSTANT_CACHE_TTL_SECONDS),
    UseInterceptors(CacheInterceptor),
  );
}
