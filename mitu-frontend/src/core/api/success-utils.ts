import { emitSuccess } from '@/toast-actions';
import { AxiosResponse } from 'axios';

export function emitSuccessMessage(response: AxiosResponse): void {
  if (response.data && response.data.message) {
    emitSuccess(response.data.message);
  }
}
