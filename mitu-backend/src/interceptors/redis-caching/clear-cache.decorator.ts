import { SetMetadata } from '@nestjs/common';
import { CLEAR_CACHE_KEY } from '../../strings';

export const ClearCache = (patterns: string[]) =>
  SetMetadata(CLEAR_CACHE_KEY, patterns);
