import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

/**
 * Response transform interceptor that transforms the response to a standard format.
 * @export
 * @class ResponseTransformInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  /**
   * Intercepts the response and transforms it to a standard format.
   * @param {Reflector} reflector
   * @memberof ResponseTransformInterceptor
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepts the response and transforms it to a standard format.
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof ResponseTransformInterceptor
   */
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
