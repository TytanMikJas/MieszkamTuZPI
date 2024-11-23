import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Response logging interceptor that logs all outgoing responses from the server.
 * @export
 * @class ResponseLoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  /**
   * Intercepts the response and logs the response body.
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof ResponseLoggingInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(context.getClass().name);
    return next
      .handle()
      .pipe(tap((res) => logger.debug(this.responseLog(res))));
  }

  /**
   * Logs the response body.
   * @param {*} response
   * @returns {string}
   * @memberof ResponseLoggingInterceptor
   */
  private responseLog(response: Response): string {
    return (
      'Responded gracefully with \n' +
      'body: ' +
      JSON.stringify(response, null, 2)
    );
  }
}
