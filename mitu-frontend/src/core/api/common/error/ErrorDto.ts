import { ErrorType } from '@/types';

export interface ErrorIncomingDto {
  fieldId: string;
  messages: string[];
  type: ErrorType;
}

export interface ErrorInternalDto {
  fieldId: string | null;
  message: string;
  type: ErrorType;
}
