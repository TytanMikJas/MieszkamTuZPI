import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment.service';

/**
 * Interceptor to attach attachments to a post
 * @export
 * @class Attachments
 * @implements {NestInterceptor}
 * @param {ExecutionContext} context
 * @param {CallHandler} next
 * @returns {Observable<any>}
 */
@Injectable()
export class AttachmentsInterceptor implements NestInterceptor {
  constructor(private attachmentService: AttachmentService) {} // Inject your service

  /**
   * Intercepts the response and attaches attachments to the post
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof AttachmentsInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (data) => {
        const attachments = await this.attachmentService.getByPostId(data.id);
        return {
          ...data,
          attachments, // Add custom data from your service to the response
        };
      }),
    );
  }
}
