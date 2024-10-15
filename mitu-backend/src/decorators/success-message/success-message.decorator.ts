import { SetMetadata } from '@nestjs/common';
/**
 * Shortcut for setting nest response metadata key 'success-message' with a value of the message argument
 * @param message - message to be set as success message
 * @returns
 */
export const SuccessMessage = (message: string) =>
  SetMetadata('success-message', message);
