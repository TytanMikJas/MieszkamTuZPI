import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Request logging interceptor that logs all incoming requests to the server.
 * @export
 * @class RequestLoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  logger: Logger = new Logger('HTTP');

  /**
   * Intercepts the request and logs the request method, path, body and query parameters.
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof RequestLoggingInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger = new Logger(context.getClass().name);
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const bodyString = JSON.stringify(req.body, null, 2);
    const queryString = JSON.stringify(req.query, null, 2);
    const msg = `Received ${req.method} on ${req.path} \n body: ${bodyString} \n query: ${queryString}`;
    this.logger.debug(msg);
    return next.handle();
  }
}
