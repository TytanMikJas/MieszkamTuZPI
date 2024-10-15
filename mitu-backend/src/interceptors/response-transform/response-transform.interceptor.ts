import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let successMessage = this.reflector.get(
      'success-message',
      context.getHandler(),
    );

    if (!successMessage) {
      successMessage = '';
    }

    return next.handle().pipe(
      map((data) => ({
        data: data,
        message: successMessage,
      })),
    );
  }
}
