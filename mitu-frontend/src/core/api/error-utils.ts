import { emitError } from '@/toast-actions';
import { AxiosError } from 'axios';
import { ERROR_DISPLAY_ALERT } from '@/strings';
import { ErrorIncomingDto } from './common/error/ErrorDto';


export function handleErrorResponse(error: AxiosError<{data: any}> ): any[] { //TODO remove any
  if (!error.response || !error.response.data || !error.response.data.data) {
    return [];
  }

  if (!error.response.data.data || Array.isArray(!error.response.data.data)) {
    return [];
  }

  return error.response.data.data
    .map((error: ErrorIncomingDto) =>
      error.messages.map((message) => {
        return {
          fieldId: error.fieldId ? error.fieldId : null,
          message: message,
          type: error.type,
        };
      }),
    )
    .reduce((acc: any, val: any[]) => acc.concat(val), []);
}

export function emitErrors(error: AxiosError<{data: any}>): void {
  const errors = handleErrorResponse(error);
  errors.forEach((error) => {
    if (error.type === ERROR_DISPLAY_ALERT) {
      emitError(error.message);
    }
  });
}
