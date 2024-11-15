import { InvalidValidationException } from './exceptions/invalid-validation.exception';
import { RenderType } from './dto/exception.output';
import { ValidationPipe } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { DEFAULT_CACHE_TTL_SECONDS } from './constants';

/**
 * Pipe to validate the class-validator decorators.
 */
export const ClassValidatorPipe = new ValidationPipe({
  transform: true,
  exceptionFactory: (errors) => {
    return new InvalidValidationException(
      errors.map((error) => {
        return {
          type: RenderType.alert,
          field: error.property,
          messages: Object.values(error.constraints),
        };
      }),
    );
  },
});

export const RedisCacheManager = redisStore({
  ttl: DEFAULT_CACHE_TTL_SECONDS,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});
