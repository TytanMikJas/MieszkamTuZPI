import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to set success message
 * @param message
 */
export const SuccessMessage = (message: string) =>
  SetMetadata('success-message', message);
