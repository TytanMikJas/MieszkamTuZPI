import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(context.getClass().name);
    return next
      .handle()
      .pipe(tap((res) => logger.debug(this.responseLog(res))));
  }

  private responseLog(response: Response): string {
    return (
      'Responded gracefully with \n' +
      'body: ' +
      JSON.stringify(response, null, 2)
    );
  }
}
