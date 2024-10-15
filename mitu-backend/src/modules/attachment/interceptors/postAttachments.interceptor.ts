import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { AttachmentService } from '../attachment.service';

@Injectable()
export class AttachmentsInterceptor implements NestInterceptor {
  constructor(private attachmentService: AttachmentService) {} // Inject your service

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
